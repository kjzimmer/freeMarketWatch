/**
 * thm_historical_data.ts — Static seed data for THM methodology charts.
 *
 * Sources:
 *   M2 (1913–1958): Friedman & Schwartz, "A Monetary History of the United States"
 *   GDP (1913–1946): BEA historical national accounts (billions of chained 2017 USD)
 *
 * FRED coverage begins:
 *   M2SL: January 1959
 *   GDPC1: Q1 1947
 *
 * These values are fixed academic estimates and will never change.
 * Store once via seedTHMHistoricalData(); safe to re-run (upserts).
 */

import '../../lib/env';
import { pool } from '../connection';

const M2_FRIEDMAN_SCHWARTZ: Array<{ year: number; m2Billions: number }> = [
  { year: 1913, m2Billions: 18.5 },
  { year: 1914, m2Billions: 18.8 },
  { year: 1915, m2Billions: 19.9 },
  { year: 1916, m2Billions: 22.6 },
  { year: 1917, m2Billions: 25.7 },
  { year: 1918, m2Billions: 29.2 },
  { year: 1919, m2Billions: 33.9 },
  { year: 1920, m2Billions: 35.2 },
  { year: 1921, m2Billions: 32.5 },
  { year: 1922, m2Billions: 33.4 },
  { year: 1923, m2Billions: 36.1 },
  { year: 1924, m2Billions: 37.6 },
  { year: 1925, m2Billions: 40.4 },
  { year: 1926, m2Billions: 42.0 },
  { year: 1927, m2Billions: 43.7 },
  { year: 1928, m2Billions: 45.7 },
  { year: 1929, m2Billions: 46.4 },
  { year: 1930, m2Billions: 44.8 },
  { year: 1931, m2Billions: 41.0 },
  { year: 1932, m2Billions: 35.4 },
  { year: 1933, m2Billions: 31.9 },
  { year: 1934, m2Billions: 33.9 },
  { year: 1935, m2Billions: 38.1 },
  { year: 1936, m2Billions: 43.0 },
  { year: 1937, m2Billions: 44.5 },
  { year: 1938, m2Billions: 44.9 },
  { year: 1939, m2Billions: 49.3 },
  { year: 1940, m2Billions: 54.5 },
  { year: 1941, m2Billions: 62.0 },
  { year: 1942, m2Billions: 74.4 },
  { year: 1943, m2Billions: 93.5 },
  { year: 1944, m2Billions: 108.8 },
  { year: 1945, m2Billions: 126.6 },
  { year: 1946, m2Billions: 138.7 },
  { year: 1947, m2Billions: 146.0 },
  { year: 1948, m2Billions: 147.4 },
  { year: 1949, m2Billions: 148.0 },
  { year: 1950, m2Billions: 150.9 },
  { year: 1951, m2Billions: 158.1 },
  { year: 1952, m2Billions: 165.0 },
  { year: 1953, m2Billions: 170.5 },
  { year: 1954, m2Billions: 175.9 },
  { year: 1955, m2Billions: 183.6 },
  { year: 1956, m2Billions: 188.7 },
  { year: 1957, m2Billions: 193.7 },
  { year: 1958, m2Billions: 200.5 },
];

const GDP_BEA_HISTORICAL: Array<{ year: number; gdpBillions: number }> = [
  { year: 1913, gdpBillions: 823 },
  { year: 1914, gdpBillions: 792 },
  { year: 1915, gdpBillions: 814 },
  { year: 1916, gdpBillions: 892 },
  { year: 1917, gdpBillions: 904 },
  { year: 1918, gdpBillions: 990 },
  { year: 1919, gdpBillions: 966 },
  { year: 1920, gdpBillions: 966 },
  { year: 1921, gdpBillions: 880 },
  { year: 1922, gdpBillions: 959 },
  { year: 1923, gdpBillions: 1075 },
  { year: 1924, gdpBillions: 1085 },
  { year: 1925, gdpBillions: 1130 },
  { year: 1926, gdpBillions: 1193 },
  { year: 1927, gdpBillions: 1207 },
  { year: 1928, gdpBillions: 1228 },
  { year: 1929, gdpBillions: 1267 },
  { year: 1930, gdpBillions: 1140 },
  { year: 1931, gdpBillions: 1039 },
  { year: 1932, gdpBillions: 899 },
  { year: 1933, gdpBillions: 885 },
  { year: 1934, gdpBillions: 966 },
  { year: 1935, gdpBillions: 1064 },
  { year: 1936, gdpBillions: 1196 },
  { year: 1937, gdpBillions: 1245 },
  { year: 1938, gdpBillions: 1183 },
  { year: 1939, gdpBillions: 1290 },
  { year: 1940, gdpBillions: 1367 },
  { year: 1941, gdpBillions: 1574 },
  { year: 1942, gdpBillions: 1848 },
  { year: 1943, gdpBillions: 2134 },
  { year: 1944, gdpBillions: 2239 },
  { year: 1945, gdpBillions: 2239 },
  { year: 1946, gdpBillions: 1793 },
];

export async function seedTHMHistoricalData(): Promise<void> {
  console.log('[seed] Inserting Friedman & Schwartz M2 (1913–1958)…');
  const m2Dates = M2_FRIEDMAN_SCHWARTZ.map((r) => `${r.year}-01-01`);
  const m2Values = M2_FRIEDMAN_SCHWARTZ.map((r) => r.m2Billions);

  await pool.query(
    `INSERT INTO market_m2_history (date, m2_billions, source)
     SELECT unnest($1::date[]), unnest($2::numeric[]), 'Friedman_Schwartz'
     ON CONFLICT (date) DO UPDATE SET
       m2_billions = EXCLUDED.m2_billions,
       updated_at  = NOW()
     WHERE market_m2_history.source = 'Friedman_Schwartz'`,
    [m2Dates, m2Values]
  );
  console.log(`[seed] Inserted ${m2Dates.length} M2 rows.`);

  console.log('[seed] Inserting BEA historical GDP (1913–1946)…');
  const gdpDates = GDP_BEA_HISTORICAL.map((r) => `${r.year}-01-01`);
  const gdpValues = GDP_BEA_HISTORICAL.map((r) => r.gdpBillions);

  await pool.query(
    `INSERT INTO market_gdp_history (date, gdp_billions, source)
     SELECT unnest($1::date[]), unnest($2::numeric[]), 'BEA_Historical'
     ON CONFLICT (date) DO UPDATE SET
       gdp_billions = EXCLUDED.gdp_billions,
       updated_at   = NOW()
     WHERE market_gdp_history.source = 'BEA_Historical'`,
    [gdpDates, gdpValues]
  );
  console.log(`[seed] Inserted ${gdpDates.length} GDP rows.`);
}

if (require.main === module) {
  seedTHMHistoricalData()
    .then(() => pool.end())
    .catch((err) => {
      console.error('[seed] Fatal:', err.message);
      pool.end().finally(() => process.exit(1));
    });
}
