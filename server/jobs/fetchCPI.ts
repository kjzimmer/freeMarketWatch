/**
 * fetchCPI.ts — Fetches US CPI data (FRED CPIAUCSL) into market_cpi_history.
 *
 * Bootstrap run (no existing data): fetches full history from 1913-01-01.
 * Incremental run (data exists):    fetches from 90 days before the latest
 *                                   stored date to catch any FRED revisions.
 *
 * Safe to re-run: all inserts are upserts.
 *
 * Usage:
 *   npx tsx jobs/fetchCPI.ts           # auto-detect bootstrap vs incremental
 *   npx tsx jobs/fetchCPI.ts --full    # force full re-fetch
 */

import '../lib/env';
import axios from 'axios';
import { pool } from '../db/connection';
import { logFetch } from '../db/queries/fetchLog';

const SOURCE = 'FRED_CPI';
const SERIES = 'CPIAUCNS'; // Not seasonally adjusted — starts Jan 1913; CPIAUCSL only goes back to 1947
const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const FULL_HISTORY_START = '1913-01-01';

interface FredObservation {
  date: string;   // "YYYY-MM-DD"
  value: string;  // numeric string, or "." for missing
}

interface FredResponse {
  observations: FredObservation[];
}

async function getLatestStoredDate(): Promise<Date | null> {
  const { rows } = await pool.query<{ max_date: Date | null }>(
    'SELECT MAX(date) AS max_date FROM market_cpi_history'
  );
  return rows[0]?.max_date ?? null;
}

async function fetchFromFRED(observationStart: string): Promise<FredObservation[]> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) throw new Error('FRED_API_KEY is not set');

  const url =
    `${FRED_BASE}?series_id=${SERIES}` +
    `&api_key=${apiKey}` +
    `&file_type=json` +
    `&observation_start=${observationStart}` +
    `&limit=100000`;

  console.log(`[fetchCPI] Fetching FRED ${SERIES} from ${observationStart}…`);
  const { data } = await axios.get<FredResponse>(url, { timeout: 30_000 });
  return data.observations;
}

async function upsertCPI(observations: FredObservation[]): Promise<number> {
  const valid = observations.filter((o) => o.value !== '.' && o.value.trim() !== '');
  if (valid.length === 0) return 0;

  const dates = valid.map((o) => o.date);
  const values = valid.map((o) => parseFloat(o.value));

  await pool.query(
    `INSERT INTO market_cpi_history (date, cpi_value)
     SELECT unnest($1::date[]), unnest($2::numeric[])
     ON CONFLICT (date) DO UPDATE SET
       cpi_value  = EXCLUDED.cpi_value,
       updated_at = NOW()`,
    [dates, values]
  );

  return valid.length;
}

async function run(): Promise<void> {
  const forceFullFetch = process.argv.includes('--full');

  let observationStart: string;

  if (forceFullFetch) {
    console.log('[fetchCPI] --full flag set: fetching complete history');
    observationStart = FULL_HISTORY_START;
  } else {
    const latestDate = await getLatestStoredDate();

    if (!latestDate) {
      console.log('[fetchCPI] No existing data — bootstrapping full history from 1913');
      observationStart = FULL_HISTORY_START;
    } else {
      // Fetch from 90 days before latest stored date to catch FRED revisions
      const lookback = new Date(latestDate);
      lookback.setDate(lookback.getDate() - 90);
      observationStart = lookback.toISOString().split('T')[0];
      console.log(`[fetchCPI] Incremental update from ${observationStart} (latest stored: ${latestDate.toISOString().split('T')[0]})`);
    }
  }

  const endpoint =
    `${FRED_BASE}?series_id=${SERIES}&observation_start=${observationStart}`;

  try {
    const observations = await fetchFromFRED(observationStart);
    console.log(`[fetchCPI] Received ${observations.length} observations from FRED`);

    const recordsAdded = await upsertCPI(observations);
    console.log(`[fetchCPI] Upserted ${recordsAdded} rows into market_cpi_history`);

    await logFetch({ source: SOURCE, endpoint, recordsAdded, success: true });
    console.log('[fetchCPI] Done.');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[fetchCPI] Error: ${message}`);
    await logFetch({ source: SOURCE, endpoint, success: false, errorMsg: message });
    throw err;
  }
}

export { run };

if (require.main === module) {
  run()
    .then(() => pool.end())
    .catch((err) => { console.error('[fetchCPI] fatal:', err.message); pool.end().finally(() => process.exit(1)); });
}
