/**
 * Purchasing power index calculations.
 *
 * All functions return a series indexed to 100 at windowStart.
 * "Purchasing power" means: how many real goods/services can 1 unit of this
 * instrument buy, relative to what it could buy at the window start?
 *
 * Formulas:
 *   USD:      100 × (M2GDP_start / M2GDP_t)
 *   Currency: 100 × (FX_start / FX_t) × (M2GDP_start / M2GDP_t)
 *   Equity:   100 × (price_t / price_start) × (M2GDP_start / M2GDP_t)
 *   BTC:      Same as equity (priced in USD, then M2/GDP-adjusted)
 *
 * M2GDP_t = M2_t / GDP_t, linearly interpolated to monthly using the same
 * series that drives the THM benchmark — ensuring USD × THM = 100² at every point.
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
 * Slopes downward as M2/GDP ratio rises (more debasement).
 *
 * @param m2gdpSeries  Sorted ascending M2/GDP monthly data
 * @param windowStart  Index start date
 * @param dates  Target dates for which to compute the index
 */
export function usdPurchasingPower(
  m2gdpSeries: DataPoint[],
  windowStart: Date,
  dates: Date[]
): IndexPoint[] {
  const startM2GDP = interpolate(m2gdpSeries, windowStart);
  if (startM2GDP === null || startM2GDP === 0) return [];

  return dates.map((date) => {
    const m2gdp = interpolate(m2gdpSeries, date);
    if (m2gdp === null || m2gdp === 0) return null;
    return {
      date: date.toISOString().split('T')[0],
      value: 100 * (startM2GDP / m2gdp),
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
 *   2. M2/GDP deflation (same deflator as THM benchmark)
 *
 * FX rate convention: units of foreign currency per 1 USD.
 *   Lower FX rate at date t vs start → foreign currency strengthened → PP up.
 *
 * @param fxSeries      Sorted ascending FX daily data (units of foreign per 1 USD)
 * @param m2gdpSeries   Sorted ascending M2/GDP monthly data
 * @param windowStart   Index start date
 * @param dates  Target dates for which to compute the index
 */
export function currencyPurchasingPower(
  fxSeries: DataPoint[],
  m2gdpSeries: DataPoint[],
  windowStart: Date,
  dates: Date[]
): IndexPoint[] {
  const startFX = interpolate(fxSeries, windowStart);
  const startM2GDP = interpolate(m2gdpSeries, windowStart);
  if (startFX === null || startFX === 0 || startM2GDP === null || startM2GDP === 0) return [];

  return dates.map((date) => {
    const fx = interpolate(fxSeries, date);
    const m2gdp = interpolate(m2gdpSeries, date);
    if (fx === null || fx === 0 || m2gdp === null || m2gdp === 0) return null;

    // Foreign currency appreciation vs USD (lower units per USD = appreciated)
    const fxFactor = startFX / fx;
    // M2/GDP purchasing power factor (higher M2GDP = more debasement = lower PP)
    const m2gdpFactor = startM2GDP / m2gdp;

    return {
      date: date.toISOString().split('T')[0],
      value: 100 * fxFactor * m2gdpFactor,
    };
  }).filter((p): p is IndexPoint => p !== null);
}

// ─────────────────────────────────────────────
// Nominal (dollar-denominated) versions
// ─────────────────────────────────────────────

/** Nominal index of a foreign currency vs USD: pure exchange rate change, no deflation. */
export function currencyNominal(
  fxSeries: DataPoint[],
  windowStart: Date,
  dates: Date[]
): IndexPoint[] {
  const startFX = interpolate(fxSeries, windowStart);
  if (startFX === null || startFX === 0) return [];

  return dates.map((date) => {
    const fx = interpolate(fxSeries, date);
    if (fx === null || fx === 0) return null;
    return { date: date.toISOString().split('T')[0], value: 100 * (startFX / fx) };
  }).filter((p): p is IndexPoint => p !== null);
}

/** Nominal index of a price-based asset (equity, ETF, BTC): pure price change, no deflation. */
export function equityNominal(
  priceSeries: DataPoint[],
  windowStart: Date,
  dates: Date[]
): IndexPoint[] {
  const startPrice = interpolate(priceSeries, windowStart);
  if (startPrice === null || startPrice === 0) return [];

  return dates.map((date) => {
    const price = interpolate(priceSeries, date);
    if (price === null) return null;
    return { date: date.toISOString().split('T')[0], value: 100 * (price / startPrice) };
  }).filter((p): p is IndexPoint => p !== null);
}

// ─────────────────────────────────────────────
// Equity / ETF / BTC Purchasing Power
// ─────────────────────────────────────────────

/**
 * Real purchasing power of holding an equity, ETF, or BTC.
 * Price is in USD; adjusted by M2/GDP to get real return.
 *
 * For BTC: data begins ~2010 (CryptoCompare daily). If windowStart predates
 * available BTC data, pass only the dates from when BTC data exists.
 * The frontend handles the gap gracefully (line begins late in the window).
 *
 * @param priceSeries   Sorted ascending daily price data (USD)
 * @param m2gdpSeries   Sorted ascending M2/GDP monthly data
 * @param windowStart   Index start date
 * @param dates  Target dates for which to compute the index
 */
export function equityPurchasingPower(
  priceSeries: DataPoint[],
  m2gdpSeries: DataPoint[],
  windowStart: Date,
  dates: Date[]
): IndexPoint[] {
  const startPrice = interpolate(priceSeries, windowStart);
  const startM2GDP = interpolate(m2gdpSeries, windowStart);
  if (startPrice === null || startPrice === 0 || startM2GDP === null || startM2GDP === 0) return [];

  return dates.map((date) => {
    const price = interpolate(priceSeries, date);
    const m2gdp = interpolate(m2gdpSeries, date);
    if (price === null || m2gdp === null || m2gdp === 0) return null;

    const nominalReturn = price / startPrice;
    const realReturn = nominalReturn * (startM2GDP / m2gdp);

    return {
      date: date.toISOString().split('T')[0],
      value: 100 * realReturn,
    };
  }).filter((p): p is IndexPoint => p !== null);
}
