/**
 * fetchEquities.ts — Fetches daily adjusted closing prices for equities and ETFs
 * from the Yahoo Finance v8 chart API into market_price_history.
 *
 * Tickers: AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA (Mag 7)
 *           TLT, GLD, TIPS (risk-off ETFs)
 *
 * Uses Yahoo Finance's v8 chart API directly via axios (not the yahoo-finance2 library,
 * which Yahoo has rate-limited against). A browser User-Agent is required.
 *
 * Bootstrap run (no data for a ticker): fetches 10 years of history.
 * Incremental run: fetches from latest stored date to today.
 *
 * Rate limiting: 2 second pause between tickers to avoid 429s.
 *
 * Safe to re-run: all inserts are upserts.
 *
 * Usage:
 *   npx tsx jobs/fetchEquities.ts
 *   npx tsx jobs/fetchEquities.ts --full
 */

import '../lib/env';
import axios from 'axios';
import { pool } from '../db/connection';
import { logFetch } from '../db/queries/fetchLog';

const SOURCE = 'YahooFinance';
const YF_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';
const HISTORY_YEARS = 10;

const YF_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

const TICKERS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA',
  'TLT', 'GLD', 'TIPS',
];

// Internal ticker → Yahoo Finance symbol (where they differ)
const YF_SYMBOL: Record<string, string> = {
  TIPS: 'TIP', // iShares TIPS Bond ETF trades as TIP on Yahoo Finance
};

interface ChartResult {
  timestamp: number[];
  indicators: {
    adjclose?: [{ adjclose: (number | null)[] }];
    quote: [{ close: (number | null)[] }];
  };
}

interface ChartResponse {
  chart: {
    result: ChartResult[] | null;
    error: { code: string; description: string } | null;
  };
}

function toUnixSeconds(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

function tenYearsAgo(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - HISTORY_YEARS);
  return d.toISOString().split('T')[0];
}

function today(): string {
  return new Date().toISOString().split('T')[0];
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
  period1Str: string,
  period2Str: string
): Promise<{ date: string; value: number }[]> {
  const p1 = toUnixSeconds(period1Str);
  const p2 = toUnixSeconds(period2Str);
  const url = `${YF_BASE}/${ticker}?interval=1d&period1=${p1}&period2=${p2}`;

  const { data } = await axios.get<ChartResponse>(url, {
    headers: YF_HEADERS,
    timeout: 30_000,
  });

  if (data.chart.error) {
    throw new Error(`Yahoo Finance error for ${ticker}: ${data.chart.error.description}`);
  }

  const result = data.chart.result?.[0];
  if (!result) throw new Error(`No data returned for ${ticker}`);

  const timestamps = result.timestamp;
  // Prefer adjusted close; fall back to unadjusted close
  const closes: (number | null)[] =
    result.indicators.adjclose?.[0]?.adjclose ??
    result.indicators.quote[0].close;

  return timestamps
    .map((ts, i) => ({
      date: new Date(ts * 1000).toISOString().split('T')[0],
      value: closes[i] as number,
    }))
    .filter((r) => r.value != null && !isNaN(r.value));
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
  const period2 = today();

  if (forceFullFetch) {
    period1 = tenYearsAgo();
  } else {
    const latestDate = await getLatestStoredDate(ticker);
    if (!latestDate) {
      console.log(`[fetchEquities] No data for ${ticker} — bootstrapping ${HISTORY_YEARS} years`);
      period1 = tenYearsAgo();
    } else {
      period1 = latestDate.toISOString().split('T')[0];
    }
  }

  const yfSymbol = YF_SYMBOL[ticker] ?? ticker;
  const endpoint = `${YF_BASE}/${yfSymbol}?interval=1d&period1=${period1}&period2=${period2}`;

  try {
    console.log(`[fetchEquities] Fetching ${ticker} (YF: ${yfSymbol}) from ${period1} to ${period2}…`);
    const rows = await fetchTicker(yfSymbol, period1, period2);
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

  const failedTickers: string[] = [];

  for (const ticker of TICKERS) {
    try {
      await fetchOneTicker(ticker, forceFullFetch);
    } catch {
      failedTickers.push(ticker);
    }
    await sleep(2_000);
  }

  if (failedTickers.length > 0) {
    throw new Error(`[fetchEquities] Failed tickers: ${failedTickers.join(', ')}`);
  }

  console.log('[fetchEquities] Done.');
}

export { run };

if (require.main === module) {
  run()
    .then(() => pool.end())
    .catch((err) => { console.error('[fetchEquities] fatal:', err.message); pool.end().finally(() => process.exit(1)); });
}
