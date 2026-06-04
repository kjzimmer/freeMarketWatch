/**
 * fetchM2GDP.ts — Fetches M2 money supply and Real GDP from FRED.
 *
 * M2 (FRED M2SL):   monthly, 1959–present; stored as annual averages
 * GDP (FRED GDPC1): quarterly, 1947–present; stored as annual averages
 *
 * Pre-FRED historical data (1913–1958 M2, 1913–1946 GDP) comes from the
 * static seed file — never overwritten here.
 *
 * Safe to re-run: all inserts are upserts.
 *
 * Usage:
 *   npx tsx jobs/fetchM2GDP.ts           # incremental
 *   npx tsx jobs/fetchM2GDP.ts --full    # force re-fetch from FRED start
 */

import '../lib/env';
import axios from 'axios';
import { pool } from '../db/connection';
import { logFetch } from '../db/queries/fetchLog';

const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const M2_SERIES = 'M2SL';
const GDP_SERIES = 'GDPC1';

const M2_FRED_START = '1959-01-01';
const GDP_FRED_START = '1947-01-01';

interface FredObservation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: FredObservation[];
}

async function fetchFRED(seriesId: string, observationStart: string): Promise<FredObservation[]> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) throw new Error('FRED_API_KEY is not set');

  const url =
    `${FRED_BASE}?series_id=${seriesId}` +
    `&api_key=${apiKey}` +
    `&file_type=json` +
    `&observation_start=${observationStart}` +
    `&limit=100000`;

  console.log(`[fetchM2GDP] Fetching FRED ${seriesId} from ${observationStart}…`);
  const { data } = await axios.get<FredResponse>(url, { timeout: 30_000 });
  return data.observations.filter((o) => o.value !== '.' && o.value.trim() !== '');
}

function toAnnualAverages(obs: FredObservation[]): Map<number, number> {
  const byYear = new Map<number, number[]>();
  for (const o of obs) {
    const year = parseInt(o.date.slice(0, 4), 10);
    const val = parseFloat(o.value);
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(val);
  }
  const averages = new Map<number, number>();
  for (const [year, vals] of byYear) {
    averages.set(year, vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  return averages;
}

async function getLatestStoredYear(table: 'market_m2_history' | 'market_gdp_history'): Promise<number | null> {
  const col = table === 'market_m2_history' ? 'date' : 'date';
  const { rows } = await pool.query<{ max_date: Date | null }>(
    `SELECT MAX(${col}) AS max_date FROM ${table}`
  );
  const d = rows[0]?.max_date;
  return d ? d.getUTCFullYear() : null;
}

async function upsertM2(annualAverages: Map<number, number>): Promise<number> {
  if (annualAverages.size === 0) return 0;
  const dates: string[] = [];
  const values: number[] = [];
  for (const [year, avg] of annualAverages) {
    dates.push(`${year}-01-01`);
    values.push(avg);
  }
  await pool.query(
    `INSERT INTO market_m2_history (date, m2_billions, source)
     SELECT unnest($1::date[]), unnest($2::numeric[]), 'FRED_M2SL'
     ON CONFLICT (date) DO UPDATE SET
       m2_billions = EXCLUDED.m2_billions,
       source      = EXCLUDED.source,
       updated_at  = NOW()`,
    [dates, values]
  );
  return dates.length;
}

async function upsertGDP(annualAverages: Map<number, number>): Promise<number> {
  if (annualAverages.size === 0) return 0;
  const dates: string[] = [];
  const values: number[] = [];
  for (const [year, avg] of annualAverages) {
    dates.push(`${year}-01-01`);
    values.push(avg);
  }
  await pool.query(
    `INSERT INTO market_gdp_history (date, gdp_billions, source)
     SELECT unnest($1::date[]), unnest($2::numeric[]), 'FRED_GDPC1'
     ON CONFLICT (date) DO UPDATE SET
       gdp_billions = EXCLUDED.gdp_billions,
       source       = EXCLUDED.source,
       updated_at   = NOW()`,
    [dates, values]
  );
  return dates.length;
}

export async function run(): Promise<void> {
  const forceFullFetch = process.argv.includes('--full');

  // --- M2 ---
  let m2Start = M2_FRED_START;
  if (!forceFullFetch) {
    const latestYear = await getLatestStoredYear('market_m2_history');
    if (latestYear && latestYear >= 1959) {
      // Overlap by 2 years to catch FRED revisions
      m2Start = `${latestYear - 2}-01-01`;
      console.log(`[fetchM2GDP] M2 incremental from ${m2Start} (latest stored year: ${latestYear})`);
    } else {
      console.log('[fetchM2GDP] M2 bootstrapping from FRED start (1959)');
    }
  }

  const m2Endpoint = `${FRED_BASE}?series_id=${M2_SERIES}&observation_start=${m2Start}`;
  try {
    const m2Obs = await fetchFRED(M2_SERIES, m2Start);
    const m2Annual = toAnnualAverages(m2Obs);
    const m2Added = await upsertM2(m2Annual);
    console.log(`[fetchM2GDP] Upserted ${m2Added} M2 annual rows`);
    await logFetch({ source: 'FRED_M2', endpoint: m2Endpoint, recordsAdded: m2Added, success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[fetchM2GDP] M2 error: ${msg}`);
    await logFetch({ source: 'FRED_M2', endpoint: m2Endpoint, success: false, errorMsg: msg });
  }

  // --- GDP ---
  let gdpStart = GDP_FRED_START;
  if (!forceFullFetch) {
    const latestYear = await getLatestStoredYear('market_gdp_history');
    if (latestYear && latestYear >= 1947) {
      gdpStart = `${latestYear - 2}-01-01`;
      console.log(`[fetchM2GDP] GDP incremental from ${gdpStart} (latest stored year: ${latestYear})`);
    } else {
      console.log('[fetchM2GDP] GDP bootstrapping from FRED start (1947)');
    }
  }

  const gdpEndpoint = `${FRED_BASE}?series_id=${GDP_SERIES}&observation_start=${gdpStart}`;
  try {
    const gdpObs = await fetchFRED(GDP_SERIES, gdpStart);
    const gdpAnnual = toAnnualAverages(gdpObs);
    const gdpAdded = await upsertGDP(gdpAnnual);
    console.log(`[fetchM2GDP] Upserted ${gdpAdded} GDP annual rows`);
    await logFetch({ source: 'FRED_GDP', endpoint: gdpEndpoint, recordsAdded: gdpAdded, success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[fetchM2GDP] GDP error: ${msg}`);
    await logFetch({ source: 'FRED_GDP', endpoint: gdpEndpoint, success: false, errorMsg: msg });
  }
}

if (require.main === module) {
  run()
    .then(() => pool.end())
    .catch((err) => {
      console.error('[fetchM2GDP] fatal:', err.message);
      pool.end().finally(() => process.exit(1));
    });
}
