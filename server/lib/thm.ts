/**
 * THM (Theoretical Hard Money) — synthetic purchasing power benchmark.
 *
 * Defined as +2% real annual appreciation, compounded continuously.
 * Represents the purchasing power gain of a productive, non-debased economy:
 * productivity improvements flow through as lower prices (deflation).
 *
 * Formula: THM(t) = 100 × (1.02)^years_elapsed
 *   - Always starts at 100 on startDate
 *   - Grows at a smooth, monotonic +2%/yr regardless of market conditions
 *   - No data source — purely computed
 *   - Displayed as a dashed lime-green line on every chart
 *
 * The 2% figure is a conservative estimate of long-run productivity-driven
 * deflation in a non-debased monetary system. See docs/methodology/thm.md.
 */

export interface THMPoint {
  date: string;  // ISO date "YYYY-MM-DD"
  value: number; // PP index (100 = start)
}

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const ANNUAL_GROWTH_RATE = 0.02;

/**
 * Generate a THM series between startDate and endDate (inclusive),
 * with one point per calendar month on the 1st of each month.
 */
export function calculateTHM(startDate: Date, endDate: Date): THMPoint[] {
  const points: THMPoint[] = [];
  const startMs = startDate.getTime();

  const cursor = new Date(Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    1
  ));

  while (cursor <= endDate) {
    const yearsElapsed = (cursor.getTime() - startMs) / MS_PER_YEAR;
    points.push({
      date: cursor.toISOString().split('T')[0],
      value: 100 * Math.pow(1 + ANNUAL_GROWTH_RATE, yearsElapsed),
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return points;
}

/**
 * Calculate a single THM value at a specific date relative to a window start.
 */
export function thmValueAt(windowStart: Date, targetDate: Date): number {
  const yearsElapsed = (targetDate.getTime() - windowStart.getTime()) / MS_PER_YEAR;
  return 100 * Math.pow(1 + ANNUAL_GROWTH_RATE, yearsElapsed);
}
