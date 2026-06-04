/**
 * thm-m2gdp.ts — M2/GDP-based THM for the main dashboard.
 *
 * Replaces the fixed (1.02)^t analytical formula with actual M2/GDP ratio data.
 * THM_M2GDP represents the debasement benchmark: how much money supply grew
 * above what real economic output required. Indexed to 100 at window start.
 *
 * Uses annual M2 and GDP data from DB, linearly interpolated to monthly.
 */

import { pool } from '../db/connection';
import { DataPoint } from './interpolate';

export interface THMPoint {
  date: string;
  value: number;
}

interface RatioPoint {
  year: number;
  ratio: number;
}

async function loadAnnualRatios(): Promise<RatioPoint[]> {
  const { rows } = await pool.query<{ year: number; m2: string; gdp: string }>(`
    SELECT
      EXTRACT(YEAR FROM m.date)::int AS year,
      m.m2_billions AS m2,
      g.gdp_billions AS gdp
    FROM market_m2_history m
    JOIN market_gdp_history g
      ON EXTRACT(YEAR FROM m.date)::int = EXTRACT(YEAR FROM g.date)::int
    WHERE m.m2_billions > 0 AND g.gdp_billions > 0
    ORDER BY year ASC
  `);
  return rows.map((r) => ({
    year: r.year,
    ratio: parseFloat(r.m2) / parseFloat(r.gdp),
  }));
}

function interpolateRatio(ratios: RatioPoint[], date: Date): number {
  if (ratios.length === 0) return 1;

  const fracYear = date.getUTCFullYear() + date.getUTCMonth() / 12;

  if (fracYear <= ratios[0].year) return ratios[0].ratio;
  if (fracYear >= ratios[ratios.length - 1].year) return ratios[ratios.length - 1].ratio;

  for (let i = 0; i < ratios.length - 1; i++) {
    if (ratios[i].year <= fracYear && ratios[i + 1].year > fracYear) {
      const t = (fracYear - ratios[i].year) / (ratios[i + 1].year - ratios[i].year);
      return ratios[i].ratio + t * (ratios[i + 1].ratio - ratios[i].ratio);
    }
  }

  return ratios[ratios.length - 1].ratio;
}

/**
 * Returns the M2/GDP ratio as monthly DataPoints from `from` to `endDate`.
 * Used by computePPSeries to deflate all assets with the same series that
 * drives the THM line — ensuring USD × THM = 100² at every point.
 */
export async function loadM2GDPMonthly(from: Date, endDate: Date): Promise<DataPoint[]> {
  const ratios = await loadAnnualRatios();
  if (ratios.length === 0) throw new Error('No M2/GDP data available');

  const points: DataPoint[] = [];
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1));
  while (cursor <= endDate) {
    points.push({ date: new Date(cursor), value: interpolateRatio(ratios, cursor) });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return points;
}

export async function calculateTHM_M2GDP(windowStart: Date, endDate: Date): Promise<THMPoint[]> {
  const ratios = await loadAnnualRatios();

  if (ratios.length === 0) {
    throw new Error('No M2/GDP data available for THM calculation');
  }

  const baseRatio = interpolateRatio(ratios, windowStart);
  if (baseRatio === 0) throw new Error('M2/GDP base ratio is zero at window start');

  const points: THMPoint[] = [];
  const cursor = new Date(Date.UTC(
    windowStart.getUTCFullYear(),
    windowStart.getUTCMonth(),
    1,
  ));

  while (cursor <= endDate) {
    const currentRatio = interpolateRatio(ratios, cursor);
    points.push({
      date: cursor.toISOString().split('T')[0],
      value: 100 * (currentRatio / baseRatio),
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return points;
}
