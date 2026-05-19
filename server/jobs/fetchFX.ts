/**
 * fetchFX.ts — Fetches daily FX rates vs USD from FRED into market_fx_history.
 *
 * Series fetched:
 *   DEXUSEU  EUR → rate = USD per EUR  (need to invert to get EUR per USD)
 *   DEXJPUS  JPY → rate = JPY per USD  (already correct)
 *   DEXUSUK  GBP → rate = USD per GBP  (need to invert to get GBP per USD)
 *   DEXCHUS  CNY → rate = CNY per USD  (already correct)
 *
 * All values stored as: units of foreign currency per 1 USD.
 *
 * Bootstrap run: fetches from 1971-01-01 (Bretton Woods end; clean FX data starts here).
 * Incremental run: fetches from 14 days before latest stored date.
 *
 * Safe to re-run: all inserts are upserts.
 *
 * Usage:
 *   npx tsx jobs/fetchFX.ts
 *   npx tsx jobs/fetchFX.ts --full
 */

import '../lib/env';
import axios from 'axios';
import { pool } from '../db/connection';
import { logFetch } from '../db/queries/fetchLog';

const SOURCE = 'FRED_FX';
const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const FULL_HISTORY_START = '1971-01-01';

interface FredSeries {
  seriesId: string;
  currencyCode: string;
  invertRate: boolean; // true when FRED quotes USD per foreign unit (need to flip to foreign per USD)
}

const SERIES: FredSeries[] = [
  { seriesId: 'DEXUSEU', currencyCode: 'EUR', invertRate: true  }, // USD/EUR → EUR/USD
  { seriesId: 'DEXJPUS', currencyCode: 'JPY', invertRate: false }, // JPY/USD ✓
  { seriesId: 'DEXUSUK', currencyCode: 'GBP', invertRate: true  }, // USD/GBP → GBP/USD
  { seriesId: 'DEXCHUS', currencyCode: 'CNY', invertRate: false }, // CNY/USD ✓
];

interface FredObservation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: FredObservation[];
}

async function getLatestStoredDate(currencyCode: string): Promise<Date | null> {
  const { rows } = await pool.query<{ max_date: Date | null }>(
    'SELECT MAX(date) AS max_date FROM market_fx_history WHERE currency_code = $1',
    [currencyCode]
  );
  return rows[0]?.max_date ?? null;
}

async function fetchSeries(
  seriesId: string,
  observationStart: string
): Promise<FredObservation[]> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) throw new Error('FRED_API_KEY is not set');

  const url =
    `${FRED_BASE}?series_id=${seriesId}` +
    `&api_key=${apiKey}` +
    `&file_type=json` +
    `&observation_start=${observationStart}` +
    `&limit=100000`;

  const { data } = await axios.get<FredResponse>(url, { timeout: 30_000 });
  return data.observations;
}

async function upsertFX(
  currencyCode: string,
  observations: FredObservation[],
  invertRate: boolean
): Promise<number> {
  const valid = observations.filter((o) => o.value !== '.' && o.value.trim() !== '');
  if (valid.length === 0) return 0;

  const dates = valid.map((o) => o.date);
  const rates = valid.map((o) => {
    const raw = parseFloat(o.value);
    return invertRate ? 1 / raw : raw;
  });

  await pool.query(
    `INSERT INTO market_fx_history (currency_code, date, rate_vs_usd, source)
     SELECT $1, unnest($2::date[]), unnest($3::numeric[]), 'FRED'
     ON CONFLICT (currency_code, date) DO UPDATE SET
       rate_vs_usd = EXCLUDED.rate_vs_usd,
       updated_at  = NOW()`,
    [currencyCode, dates, rates]
  );

  return valid.length;
}

async function fetchOneSeries(series: FredSeries, forceFullFetch: boolean): Promise<void> {
  const { seriesId, currencyCode, invertRate } = series;

  let observationStart: string;

  if (forceFullFetch) {
    observationStart = FULL_HISTORY_START;
  } else {
    const latestDate = await getLatestStoredDate(currencyCode);
    if (!latestDate) {
      console.log(`[fetchFX] No data for ${currencyCode} — bootstrapping from ${FULL_HISTORY_START}`);
      observationStart = FULL_HISTORY_START;
    } else {
      const lookback = new Date(latestDate);
      lookback.setDate(lookback.getDate() - 14);
      observationStart = lookback.toISOString().split('T')[0];
    }
  }

  console.log(`[fetchFX] Fetching ${seriesId} (${currencyCode}) from ${observationStart}…`);

  const endpoint = `${FRED_BASE}?series_id=${seriesId}&observation_start=${observationStart}`;

  try {
    const observations = await fetchSeries(seriesId, observationStart);
    const recordsAdded = await upsertFX(currencyCode, observations, invertRate);
    console.log(`[fetchFX] ${currencyCode}: upserted ${recordsAdded} rows`);
    await logFetch({ source: SOURCE, endpoint, recordsAdded, success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[fetchFX] ${currencyCode} error: ${message}`);
    await logFetch({ source: SOURCE, endpoint, success: false, errorMsg: message });
    throw err;
  }
}

async function run(): Promise<void> {
  const forceFullFetch = process.argv.includes('--full');
  if (forceFullFetch) console.log('[fetchFX] --full flag set: fetching complete history');

  let exitCode = 0;

  for (const series of SERIES) {
    try {
      await fetchOneSeries(series, forceFullFetch);
    } catch {
      // Individual series failure is logged; continue with remaining series
      exitCode = 1;
    }
  }

  await pool.end();
  if (exitCode !== 0) process.exit(exitCode);
  console.log('[fetchFX] Done.');
}

run();
