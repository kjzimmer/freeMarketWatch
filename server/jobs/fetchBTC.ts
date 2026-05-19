/**
 * fetchBTC.ts — Fetches Bitcoin price history from CoinGecko into market_price_history.
 *
 * Bootstrap run (no existing data): fetches full history (days=max, ~since 2013-04-28
 *   for daily granularity; CoinGecko's free tier limits granularity beyond 90 days).
 * Incremental run: fetches last 90 days to fill any gaps.
 *
 * CoinGecko free tier notes:
 *   - /coins/{id}/market_chart returns daily data when days > 90.
 *   - Beyond 90 days, granularity is fixed at daily regardless of interval param.
 *   - Returns timestamps in milliseconds UTC.
 *   - Rate limit: ~10-30 req/min on free tier — this job makes at most 1 request.
 *
 * BTC genesis block: 2009-01-03. CoinGecko data reliably starts ~2013-04-28.
 * The 2009-2013 gap is noted in the DB via the absence of rows — handled gracefully
 * by the frontend chart logic.
 *
 * Safe to re-run: all inserts are upserts.
 *
 * Usage:
 *   npx tsx jobs/fetchBTC.ts
 *   npx tsx jobs/fetchBTC.ts --full
 */

import 'dotenv/config';
import axios from 'axios';
import { pool } from '../db/connection';
import { logFetch } from '../db/queries/fetchLog';

const SOURCE = 'CoinGecko_BTC';
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const TICKER = 'BTC';

// [timestamp_ms, price_usd]
type PricePoint = [number, number];

interface MarketChartResponse {
  prices: PricePoint[];
}

async function getLatestStoredDate(): Promise<Date | null> {
  const { rows } = await pool.query<{ max_date: Date | null }>(
    `SELECT MAX(date) AS max_date FROM market_price_history WHERE ticker = $1`,
    [TICKER]
  );
  return rows[0]?.max_date ?? null;
}

async function fetchFromCoinGecko(days: number | 'max'): Promise<PricePoint[]> {
  const apiKey = process.env.COINGECKO_API_KEY;

  const url = `${COINGECKO_BASE}/coins/bitcoin/market_chart`;
  const params: Record<string, string> = {
    vs_currency: 'usd',
    days: String(days),
    interval: 'daily',
  };

  const headers: Record<string, string> = {};
  if (apiKey) {
    // CoinGecko Pro uses x-cg-pro-api-key; Demo uses x-cg-demo-api-key
    headers['x-cg-demo-api-key'] = apiKey;
  }

  console.log(`[fetchBTC] Fetching CoinGecko market_chart (days=${days})…`);
  const { data } = await axios.get<MarketChartResponse>(url, {
    params,
    headers,
    timeout: 60_000,
  });

  return data.prices;
}

async function upsertBTC(prices: PricePoint[]): Promise<number> {
  if (prices.length === 0) return 0;

  // CoinGecko returns one entry per day; timestamp is midnight UTC.
  // Convert ms timestamp → YYYY-MM-DD date string.
  const dates: string[] = [];
  const values: number[] = [];

  for (const [timestampMs, price] of prices) {
    const date = new Date(timestampMs).toISOString().split('T')[0];
    dates.push(date);
    values.push(price);
  }

  await pool.query(
    `INSERT INTO market_price_history (ticker, date, value, currency, source)
     SELECT $1, unnest($2::date[]), unnest($3::numeric[]), 'USD', 'CoinGecko'
     ON CONFLICT (ticker, date) DO UPDATE SET
       value      = EXCLUDED.value,
       updated_at = NOW()`,
    [TICKER, dates, values]
  );

  return prices.length;
}

async function run(): Promise<void> {
  const forceFullFetch = process.argv.includes('--full');
  const endpoint = `${COINGECKO_BASE}/coins/bitcoin/market_chart`;

  let days: number | 'max';

  if (forceFullFetch) {
    console.log('[fetchBTC] --full flag set: fetching complete history');
    days = 'max';
  } else {
    const latestDate = await getLatestStoredDate();
    if (!latestDate) {
      console.log('[fetchBTC] No existing data — bootstrapping full history');
      days = 'max';
    } else {
      // Fetch 90 days to fill any gaps and catch price corrections
      days = 90;
      console.log(`[fetchBTC] Incremental update: fetching last ${days} days (latest stored: ${latestDate.toISOString().split('T')[0]})`);
    }
  }

  try {
    const prices = await fetchFromCoinGecko(days);
    console.log(`[fetchBTC] Received ${prices.length} price points from CoinGecko`);

    const recordsAdded = await upsertBTC(prices);
    console.log(`[fetchBTC] Upserted ${recordsAdded} rows into market_price_history`);

    await logFetch({ source: SOURCE, endpoint, recordsAdded, success: true });
    console.log('[fetchBTC] Done.');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[fetchBTC] Error: ${message}`);
    await logFetch({ source: SOURCE, endpoint, success: false, errorMsg: message });
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
