/**
 * Date-based linear interpolation helpers.
 *
 * Used when CPI (monthly) and price/FX (daily) data are at different frequencies.
 * All interpolation is linear between adjacent known points.
 */

export interface DataPoint {
  date: Date;
  value: number;
}

/**
 * Find the interpolated value at targetDate from a sorted (ascending) series.
 * Returns null if targetDate is outside the series range.
 */
export function interpolate(series: DataPoint[], targetDate: Date): number | null {
  if (series.length === 0) return null;

  const targetMs = targetDate.getTime();
  const firstMs = series[0].date.getTime();
  const lastMs = series[series.length - 1].date.getTime();

  if (targetMs <= firstMs) return series[0].value;
  if (targetMs >= lastMs) return series[series.length - 1].value;

  // Binary search for the surrounding pair
  let lo = 0;
  let hi = series.length - 1;

  while (lo + 1 < hi) {
    const mid = (lo + hi) >>> 1;
    if (series[mid].date.getTime() <= targetMs) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const a = series[lo];
  const b = series[hi];
  const t = (targetMs - a.date.getTime()) / (b.date.getTime() - a.date.getTime());
  return a.value + t * (b.value - a.value);
}

/**
 * Find the value at the nearest date at or before targetDate.
 * Useful when interpolation is not appropriate (e.g., month-end carry-forward).
 */
export function lookupFloor(series: DataPoint[], targetDate: Date): number | null {
  if (series.length === 0) return null;

  const targetMs = targetDate.getTime();
  let result: number | null = null;

  for (const point of series) {
    if (point.date.getTime() <= targetMs) {
      result = point.value;
    } else {
      break;
    }
  }

  return result;
}
