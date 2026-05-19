/**
 * fetchEquities.ts — Fetches daily closing prices for equities and ETFs
 * from Yahoo Finance into market_price_history.
 *
 * Tickers: AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA (Mag 7)
 *           TLT, GLD, TIPS (risk-off ETFs)
 *
 * Bootstrap run (no data for a ticker): fetches 10 years of history.
 * Incremental run: fetches from latest stored date to today.
 *
 * Rate limiting: 1 request/second between tickers (Yahoo Finance is unofficial).
 *
 * Safe to re-run: all inserts are upserts.
 *
 * Usage:
 *   npx tsx jobs/fetchEquities.ts
 *   npx tsx jobs/fetchEquities.ts --full    # force 10yr re-fetch for all tickers
 */

import 'dotenv/config';
import yahooFinance from 'yahoo-finance2';
import { pool } from '../db/connection';
import { logFetch } from '../db/queries/fetchLog';

const SOURCE = 'YahooFinance';

const TICKERS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', // Mag 7
  'TLT', 'GLD', 'TIPS',                                       // Risk-off ETFs
];

const HISTORY_YEARS = 10;

function tenYearsAgo(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - HISTORY_YEARS);
  return d.toISOString().split('T')[0];
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

async function getLatestStoredDate(ticker: string): Promise<Date | null> {
  const { rows } = await pool.query<{ max_date: Date | null }>(
    `SELECT MAX(date) AS max_date FROM market_price_history WHERE ticker = $1`,
    [ticker]
  );
  return rows[0]?.max_date ?? null;
}

async function fetchTicker(
  ticker: string,
  period1: string,
  period2: string
): Promise<{ date: string; value: number }[]> {
  const results = await yahooFinance.historical(ticker, {
    period1,
    period2,
    interval: '1d',
  });

  return results
    .filter((r) => r.adjClose != null)
    .map((r) => ({
      date: r.date.toISOString().split('T')[0],
      value: r.adjClose as number,
    }));
}

async function upsertPrices(
  ticker: string,
  rows: { date: string; value: number }[]
): Promise<number> {
  if (rows.length === 0) return 0;

  const dates = rows.map((r) => r.date);
  const values = rows.map((r) => r.value);

  await pool.query(
    `INSERT INTO market_price_history (ticker, date, value, currency, source)
     SELECT $1, unnest($2::date[]), unnest($3::numeric[]), 'USD', 'YahooFinance'
     ON CONFLICT (ticker, date) DO UPDATE SET
       value      = EXCLUDED.value,
       updated_at = NOW()`,
    [ticker, dates, values]
  );

  return rows.length;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchOneTicker(ticker: string, forceFullFetch: boolean): Promise<void> {
  let period1: string;
  const period2 = yesterday();

  if (forceFullFetch) {
    period1 = tenYearsAgo();
  } else {
    const latestDate = await getLatestStoredDate(ticker);
    if (!latestDate) {
      console.log(`[fetchEquities] No data for ${ticker} — bootstrapping ${HISTORY_YEARS} years`);
      period1 = tenYearsAgo();
    } else {
      // Start from latest stored date (will re-fetch that day and forward)
      period1 = latestDate.toISOString().split('T')[0];
    }
  }

  const endpoint = `yahooFinance.historical(${ticker}, ${period1}..${period2})`;

  try {
    console.log(`[fetchEquities] Fetching ${ticker} from ${period1} to ${period2}…`);
    const rows = await fetchTicker(ticker, period1, period2);
    const recordsAdded = await upsertPrices(ticker, rows);
    console.log(`[fetchEquities] ${ticker}: upserted ${recordsAdded} rows`);
    await logFetch({ source: SOURCE, endpoint, recordsAdded, success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[fetchEquities] ${ticker} error: ${message}`);
    await logFetch({ source: SOURCE, endpoint, success: false, errorMsg: message });
    throw err;
  }
}

async function run(): Promise<void> {
  const forceFullFetch = process.argv.includes('--full');
  if (forceFullFetch) console.log('[fetchEquities] --full flag set: fetching 10yr history for all tickers');

  let failedTickers: string[] = [];

  for (const ticker of TICKERS) {
    try {
      await fetchOneTicker(ticker, forceFullFetch);
    } catch {
      failedTickers.push(ticker);
    }

    // Respect unofficial rate limit: 1 req/sec
    await sleep(1_100);
  }

  await pool.end();

  if (failedTickers.length > 0) {
    console.error(`[fetchEquities] Failed tickers: ${failedTickers.join(', ')}`);
    process.exit(1);
  }

  console.log('[fetchEquities] Done.');
}

run();
