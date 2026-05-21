/**
 * fetchBTC.ts — Fetches Bitcoin daily price history from CryptoCompare
 * into market_price_history.
 *
 * Source: CryptoCompare free API (no key required)
 *   https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&allData=true
 *
 * CoinGecko was the original spec source but their Demo API limits historical
 * data to the past 365 days. CryptoCompare provides full daily history back
 * to 2010-07-17 with no API key on the free tier.
 *
 * Bootstrap run (no existing data): fetches full history.
 * Incremental run: fetches last 90 days and upserts (covers weekends + gaps).
 *
 * Safe to re-run: all inserts are upserts.
 *
 * Usage:
 *   npx tsx jobs/fetchBTC.ts
 *   npx tsx jobs/fetchBTC.ts --full
 */

import '../lib/env';
import axios from 'axios';
import { pool } from '../db/connection';
import { logFetch } from '../db/queries/fetchLog';

const SOURCE = 'CryptoCompare_BTC';
const TICKER = 'BTC';
const FULL_HISTORY_URL = 'https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&allData=true';

interface CCDayData {
  time: number;     // Unix timestamp (seconds)
  close: number;    // Closing price in USD
  volumeto: number; // Volume (used to filter empty/zero-price days)
}

interface CCResponse {
  Response: string;
  Data: {
    Data: CCDayData[];
  };
  Message?: string;
}

async function getLatestStoredDate(): Promise<Date | null> {
  const { rows } = await pool.query<{ max_date: Date | null }>(
    `SELECT MAX(date) AS max_date FROM market_price_history WHERE ticker = $1`,
    [TICKER]
  );
  return rows[0]?.max_date ?? null;
}

async function fetchFromCryptoCompare(limit?: number): Promise<CCDayData[]> {
  // limit omitted = allData=true (full history). limit=N = last N days.
  const url = limit
    ? `https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=${limit}`
    : FULL_HISTORY_URL;

  console.log(`[fetchBTC] Fetching CryptoCompare BTC history (${limit ? `last ${limit} days` : 'full history'})…`);
  const { data } = await axios.get<CCResponse>(url, { timeout: 60_000 });

  if (data.Response !== 'Success') {
    throw new Error(`CryptoCompare error: ${data.Message ?? 'Unknown error'}`);
  }

  return data.Data.Data;
}

async function upsertBTC(dayData: CCDayData[]): Promise<number> {
  // Filter out entries with zero price (pre-exchange / no-trade days)
  const valid = dayData.filter((d) => d.close > 0);
  if (valid.length === 0) return 0;

  const dates = valid.map((d) => new Date(d.time * 1000).toISOString().split('T')[0]);
  const values = valid.map((d) => d.close);

  await pool.query(
    `INSERT INTO market_price_history (ticker, date, value, currency, source)
     SELECT $1, unnest($2::date[]), unnest($3::numeric[]), 'USD', 'CryptoCompare'
     ON CONFLICT (ticker, date) DO UPDATE SET
       value      = EXCLUDED.value,
       updated_at = NOW()`,
    [TICKER, dates, values]
  );

  return valid.length;
}

async function run(): Promise<void> {
  const forceFullFetch = process.argv.includes('--full');

  let limit: number | undefined;

  if (forceFullFetch) {
    console.log('[fetchBTC] --full flag set: fetching complete history');
    limit = undefined;
  } else {
    const latestDate = await getLatestStoredDate();
    if (!latestDate) {
      console.log('[fetchBTC] No existing data — bootstrapping full history');
      limit = undefined;
    } else {
      limit = 90;
      console.log(`[fetchBTC] Incremental update: fetching last ${limit} days (latest stored: ${latestDate.toISOString().split('T')[0]})`);
    }
  }

  const endpoint = limit ? `CryptoCompare histoday limit=${limit}` : 'CryptoCompare histoday allData=true';

  try {
    const dayData = await fetchFromCryptoCompare(limit);
    console.log(`[fetchBTC] Received ${dayData.length} data points`);

    const recordsAdded = await upsertBTC(dayData);
    console.log(`[fetchBTC] Upserted ${recordsAdded} rows into market_price_history`);

    await logFetch({ source: SOURCE, endpoint, recordsAdded, success: true });
    console.log('[fetchBTC] Done.');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[fetchBTC] Error: ${message}`);
    await logFetch({ source: SOURCE, endpoint, success: false, errorMsg: message });
    throw err;
  }
}

export { run };

if (require.main === module) {
  run()
    .then(() => pool.end())
    .catch((err) => { console.error('[fetchBTC] fatal:', err.message); pool.end().finally(() => process.exit(1)); });
}
