/**
 * computePPSeries.ts — Computes purchasing power indexes for all instruments
 * and all time windows, then caches results in market_pp_series.
 *
 * Runs after all fetch jobs complete. Rebuilds the entire table each run:
 *   - Deletes existing rows for (ticker, window_years)
 *   - Reinserts freshly computed rows
 *
 * Window definition: 1Y, 5Y, 10Y ending today.
 *   window_start = today - N years
 *   window_end   = today
 *   All series indexed to 100 at window_start.
 *
 * THM is computed analytically (no DB read).
 * USD is computed from market_cpi_history.
 * Currencies from market_fx_history + market_cpi_history.
 * Equities/ETFs/BTC from market_price_history + market_cpi_history.
 *
 * Usage:
 *   npx tsx jobs/computePPSeries.ts
 */

import 'dotenv/config';
import { pool } from '../db/connection';
import { calculateTHM } from '../lib/thm';
import {
  usdPurchasingPower,
  currencyPurchasingPower,
  equityPurchasingPower,
  IndexPoint,
} from '../lib/purchasing-power';
import { DataPoint } from '../lib/interpolate';
import { logFetch } from '../db/queries/fetchLog';

const SOURCE = 'compute_pp_series';
const WINDOW_YEARS: number[] = [1, 5, 10];

// Currency tickers that use fx_history (not price_history)
const FX_TICKERS = ['EUR', 'JPY', 'GBP', 'CNY'];

// Tickers using price_history (equities, ETFs, BTC)
const PRICE_TICKERS = [
  'BTC',
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA',
  'TLT', 'GLD', 'TIPS',
];

// ─────────────────────────────────────────────
// DB read helpers
// ─────────────────────────────────────────────

async function loadCPI(from: Date): Promise<DataPoint[]> {
  const { rows } = await pool.query<{ date: Date; cpi_value: string }>(
    `SELECT date, cpi_value FROM market_cpi_history
     WHERE date >= $1
     ORDER BY date ASC`,
    [from.toISOString().split('T')[0]]
  );
  return rows.map((r) => ({ date: new Date(r.date), value: parseFloat(r.cpi_value) }));
}

async function loadFX(currencyCode: string, from: Date): Promise<DataPoint[]> {
  const { rows } = await pool.query<{ date: Date; rate_vs_usd: string }>(
    `SELECT date, rate_vs_usd FROM market_fx_history
     WHERE currency_code = $1 AND date >= $2
     ORDER BY date ASC`,
    [currencyCode, from.toISOString().split('T')[0]]
  );
  return rows.map((r) => ({ date: new Date(r.date), value: parseFloat(r.rate_vs_usd) }));
}

async function loadPrices(ticker: string, from: Date): Promise<DataPoint[]> {
  const { rows } = await pool.query<{ date: Date; value: string }>(
    `SELECT date, value FROM market_price_history
     WHERE ticker = $1 AND date >= $2
     ORDER BY date ASC`,
    [ticker, from.toISOString().split('T')[0]]
  );
  return rows.map((r) => ({ date: new Date(r.date), value: parseFloat(r.value) }));
}

// ─────────────────────────────────────────────
// DB write helpers
// ─────────────────────────────────────────────

async function deletePPSeries(ticker: string, windowYears: number): Promise<void> {
  await pool.query(
    `DELETE FROM market_pp_series WHERE ticker = $1 AND window_years = $2`,
    [ticker, windowYears]
  );
}

async function insertPPSeries(
  ticker: string,
  windowYears: number,
  windowStart: Date,
  points: IndexPoint[]
): Promise<void> {
  if (points.length === 0) return;

  const dates = points.map((p) => p.date);
  const values = points.map((p) => p.value);
  const windowStartStr = windowStart.toISOString().split('T')[0];

  await pool.query(
    `INSERT INTO market_pp_series (ticker, date, pp_index, window_years, window_start)
     SELECT $1, unnest($2::date[]), unnest($3::numeric[]), $4, $5`,
    [ticker, dates, values, windowYears, windowStartStr]
  );
}

// ─────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────

function windowStartDate(windowYears: number): Date {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() - windowYears);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function monthlyDates(from: Date, to: Date): Date[] {
  const dates: Date[] = [];
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1));
  while (cursor <= to) {
    dates.push(new Date(cursor));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return dates;
}

// ─────────────────────────────────────────────
// Per-ticker compute
// ─────────────────────────────────────────────

async function computeTHM(windowYears: number, windowStart: Date, today: Date): Promise<void> {
  await deletePPSeries('THM', windowYears);
  const points = calculateTHM(windowStart, today);
  await insertPPSeries('THM', windowYears, windowStart, points);
  console.log(`  THM [${windowYears}Y]: ${points.length} points`);
}

async function computeUSD(
  windowYears: number,
  windowStart: Date,
  today: Date,
  cpiSeries: DataPoint[]
): Promise<void> {
  const dates = monthlyDates(windowStart, today);
  const points = usdPurchasingPower(cpiSeries, windowStart, dates);
  await deletePPSeries('USD', windowYears);
  await insertPPSeries('USD', windowYears, windowStart, points);
  console.log(`  USD [${windowYears}Y]: ${points.length} points`);
}

async function computeCurrency(
  ticker: string,
  windowYears: number,
  windowStart: Date,
  today: Date,
  cpiSeries: DataPoint[]
): Promise<void> {
  // Load FX with a 90-day buffer before window start for interpolation accuracy
  const fxFrom = new Date(windowStart);
  fxFrom.setDate(fxFrom.getDate() - 90);
  const fxSeries = await loadFX(ticker, fxFrom);

  const dates = monthlyDates(windowStart, today);
  const points = currencyPurchasingPower(fxSeries, cpiSeries, windowStart, dates);
  await deletePPSeries(ticker, windowYears);
  await insertPPSeries(ticker, windowYears, windowStart, points);
  console.log(`  ${ticker} [${windowYears}Y]: ${points.length} points`);
}

async function computeEquity(
  ticker: string,
  windowYears: number,
  windowStart: Date,
  today: Date,
  cpiSeries: DataPoint[]
): Promise<void> {
  // Load price with a 90-day buffer before window start
  const priceFrom = new Date(windowStart);
  priceFrom.setDate(priceFrom.getDate() - 90);
  const priceSeries = await loadPrices(ticker, priceFrom);

  if (priceSeries.length === 0) {
    console.log(`  ${ticker} [${windowYears}Y]: no price data — skipping`);
    return;
  }

  // For BTC: if window starts before earliest BTC data, shift effective start
  const effectiveStart = priceSeries[0].date > windowStart ? priceSeries[0].date : windowStart;
  const dates = monthlyDates(effectiveStart, today);

  const points = equityPurchasingPower(priceSeries, cpiSeries, effectiveStart, dates);
  await deletePPSeries(ticker, windowYears);
  await insertPPSeries(ticker, windowYears, windowStart, points);
  console.log(`  ${ticker} [${windowYears}Y]: ${points.length} points (data from ${effectiveStart.toISOString().split('T')[0]})`);
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

async function run(): Promise<void> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let totalPoints = 0;

  try {
    for (const windowYears of WINDOW_YEARS) {
      const windowStart = windowStartDate(windowYears);
      console.log(`\n[computePP] Window ${windowYears}Y (${windowStart.toISOString().split('T')[0]} → ${today.toISOString().split('T')[0]})`);

      // Load CPI once per window (with buffer for interpolation)
      const cpiFrom = new Date(windowStart);
      cpiFrom.setDate(cpiFrom.getDate() - 90);
      const cpiSeries = await loadCPI(cpiFrom);
      console.log(`  CPI loaded: ${cpiSeries.length} monthly points`);

      // THM
      await computeTHM(windowYears, windowStart, today);

      // USD
      await computeUSD(windowYears, windowStart, today, cpiSeries);

      // Foreign currencies
      for (const ticker of FX_TICKERS) {
        await computeCurrency(ticker, windowYears, windowStart, today, cpiSeries);
      }

      // Equities, ETFs, BTC
      for (const ticker of PRICE_TICKERS) {
        await computeEquity(ticker, windowYears, windowStart, today, cpiSeries);
      }
    }

    const { rows } = await pool.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM market_pp_series'
    );
    totalPoints = parseInt(rows[0].count, 10);
    console.log(`\n[computePP] Done. market_pp_series now has ${totalPoints} rows.`);

    await logFetch({ source: SOURCE, recordsAdded: totalPoints, success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[computePP] Fatal error: ${message}`);
    await logFetch({ source: SOURCE, success: false, errorMsg: message });
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
