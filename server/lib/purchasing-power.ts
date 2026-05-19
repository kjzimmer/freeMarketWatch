/**
 * Purchasing power index calculations.
 *
 * All functions return a series indexed to 100 at windowStart.
 * "Purchasing power" means: how many real goods/services can 1 unit of this
 * instrument buy, relative to what it could buy at the window start?
 *
 * Formulas:
 *   USD:      100 × (CPI_start / CPI_t)
 *   Currency: 100 × (FX_start / FX_t) × (CPI_start / CPI_t)
 *   Equity:   100 × (price_t / price_start) × (CPI_start / CPI_t)
 *   BTC:      Same as equity (priced in USD, then CPI-adjusted)
 *
 * All FX rates are stored as units of foreign currency per 1 USD.
 * Lower rate = foreign currency appreciated vs USD.
 */

import { DataPoint, interpolate } from './interpolate';

export interface IndexPoint {
  date: string;  // "YYYY-MM-DD"
  value: number; // PP index (100 = windowStart)
}

// ─────────────────────────────────────────────
// USD Purchasing Power
// ─────────────────────────────────────────────

/**
 * Real purchasing power of holding USD over time.
 * Slopes downward as CPI rises.
 *
 * @param cpiSeries  Sorted ascending CPI monthly data
 * @param windowStart  Index start date
 * @param dates  Target dates for which to compute the index
 */
export function usdPurchasingPower(
  cpiSeries: DataPoint[],
  windowStart: Date,
  dates: Date[]
): IndexPoint[] {
  const startCPI = interpolate(cpiSeries, windowStart);
  if (startCPI === null || startCPI === 0) return [];

  return dates.map((date) => {
    const cpi = interpolate(cpiSeries, date);
    if (cpi === null || cpi === 0) return null;
    return {
      date: date.toISOString().split('T')[0],
      value: 100 * (startCPI / cpi),
    };
  }).filter((p): p is IndexPoint => p !== null);
}

// ─────────────────────────────────────────────
// Foreign Currency Purchasing Power
// ─────────────────────────────────────────────

/**
 * Real purchasing power of holding a foreign currency (EUR, JPY, GBP, CNY).
 *
 * Accounts for:
 *   1. Exchange rate movement vs USD
 *   2. USD CPI (as the common deflator)
 *
 * FX rate convention: units of foreign currency per 1 USD.
 *   Lower FX rate at date t vs start → foreign currency strengthened → PP up.
 *
 * @param fxSeries   Sorted ascending FX daily data (units of foreign per 1 USD)
 * @param cpiSeries  Sorted ascending CPI monthly data
 * @param windowStart  Index start date
 * @param dates  Target dates for which to compute the index
 */
export function currencyPurchasingPower(
  fxSeries: DataPoint[],
  cpiSeries: DataPoint[],
  windowStart: Date,
  dates: Date[]
): IndexPoint[] {
  const startFX = interpolate(fxSeries, windowStart);
  const startCPI = interpolate(cpiSeries, windowStart);
  if (startFX === null || startFX === 0 || startCPI === null || startCPI === 0) return [];

  return dates.map((date) => {
    const fx = interpolate(fxSeries, date);
    const cpi = interpolate(cpiSeries, date);
    if (fx === null || fx === 0 || cpi === null || cpi === 0) return null;

    // Foreign currency appreciation vs USD (lower units per USD = appreciated)
    const fxFactor = startFX / fx;
    // USD purchasing power change (lower CPI_start/CPI_t = more CPI inflation)
    const cpiFactor = startCPI / cpi;

    return {
      date: date.toISOString().split('T')[0],
      value: 100 * fxFactor * cpiFactor,
    };
  }).filter((p): p is IndexPoint => p !== null);
}

// ─────────────────────────────────────────────
// Equity / ETF / BTC Purchasing Power
// ─────────────────────────────────────────────

/**
 * Real purchasing power of holding an equity, ETF, or BTC.
 * Price is in USD; adjusted by CPI to get real return.
 *
 * For BTC: data begins ~2013 (CoinGecko daily). If windowStart predates
 * available BTC data, pass only the dates from when BTC data exists.
 * The frontend handles the gap gracefully (line begins late in the window).
 *
 * @param priceSeries  Sorted ascending daily price data (USD)
 * @param cpiSeries    Sorted ascending monthly CPI data
 * @param windowStart  Index start date
 * @param dates  Target dates for which to compute the index
 */
export function equityPurchasingPower(
  priceSeries: DataPoint[],
  cpiSeries: DataPoint[],
  windowStart: Date,
  dates: Date[]
): IndexPoint[] {
  const startPrice = interpolate(priceSeries, windowStart);
  const startCPI = interpolate(cpiSeries, windowStart);
  if (startPrice === null || startPrice === 0 || startCPI === null || startCPI === 0) return [];

  return dates.map((date) => {
    const price = interpolate(priceSeries, date);
    const cpi = interpolate(cpiSeries, date);
    if (price === null || cpi === null || cpi === 0) return null;

    const nominalReturn = price / startPrice;
    const realReturn = nominalReturn * (startCPI / cpi);

    return {
      date: date.toISOString().split('T')[0],
      value: 100 * realReturn,
    };
  }).filter((p): p is IndexPoint => p !== null);
}
