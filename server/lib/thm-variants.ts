/**
 * thm-variants.ts — Three alternative THM calculation approaches.
 *
 * All three are indexed to 100 at the base year (1913). THM represents
 * purchasing power preservation only — no productivity addition.
 *
 * Formulas (Y = year, B = 1913):
 *   THM_CPI(Y)    = 100 × (CPI_Y / CPI_B)
 *   THM_M2GDP(Y)  = 100 × (M2_Y / GDP_Y) / (M2_B / GDP_B)
 *   THM_M2RAW(Y)  = 100 × (M2_Y / M2_B)
 *
 * Expected approximate values at 2024 (base 100 in 1913):
 *   THM_CPI:    ~3,200
 *   THM_M2GDP:  ~4,300
 *   THM_M2RAW:  ~116,000
 */

import { pool } from '../db/connection';

const BASE_YEAR = 1913;

export interface THMVariantPoint {
  year: number;
  thm_cpi: number;
  thm_m2gdp: number;
  thm_m2raw: number;
}

interface CpiRow { year: number; cpi: number }
interface M2Row  { year: number; m2: number }
interface GdpRow { year: number; gdp: number }

async function fetchCPIAnnual(): Promise<Map<number, number>> {
  // Annual averages from monthly CPI data stored in market_cpi_history
  const { rows } = await pool.query<{ year: number; avg_cpi: string }>(
    `SELECT EXTRACT(YEAR FROM date)::int AS year,
            AVG(cpi_value) AS avg_cpi
     FROM market_cpi_history
     GROUP BY year
     ORDER BY year ASC`
  );
  const map = new Map<number, number>();
  for (const r of rows) map.set(r.year, parseFloat(r.avg_cpi));
  return map;
}

async function fetchM2Annual(): Promise<Map<number, number>> {
  const { rows } = await pool.query<{ year: number; m2: string }>(
    `SELECT EXTRACT(YEAR FROM date)::int AS year, m2_billions AS m2
     FROM market_m2_history
     ORDER BY date ASC`
  );
  const map = new Map<number, number>();
  for (const r of rows) map.set(r.year, parseFloat(r.m2));
  return map;
}

async function fetchGDPAnnual(): Promise<Map<number, number>> {
  const { rows } = await pool.query<{ year: number; gdp: string }>(
    `SELECT EXTRACT(YEAR FROM date)::int AS year, gdp_billions AS gdp
     FROM market_gdp_history
     ORDER BY date ASC`
  );
  const map = new Map<number, number>();
  for (const r of rows) map.set(r.year, parseFloat(r.gdp));
  return map;
}

export async function calculateTHMVariants(): Promise<THMVariantPoint[]> {
  const [cpiMap, m2Map, gdpMap] = await Promise.all([
    fetchCPIAnnual(),
    fetchM2Annual(),
    fetchGDPAnnual(),
  ]);

  const cpiBase = cpiMap.get(BASE_YEAR);
  const m2Base  = m2Map.get(BASE_YEAR);
  const gdpBase = gdpMap.get(BASE_YEAR);

  if (!cpiBase) throw new Error(`Missing ${BASE_YEAR} CPI data (cpiMap has ${cpiMap.size} rows, min year: ${Math.min(...cpiMap.keys())})`);
  if (!m2Base)  throw new Error(`Missing ${BASE_YEAR} M2 data (m2Map has ${m2Map.size} rows, min year: ${Math.min(...m2Map.keys())})`);
  if (!gdpBase) throw new Error(`Missing ${BASE_YEAR} GDP data (gdpMap has ${gdpMap.size} rows, min year: ${Math.min(...gdpMap.keys())})`);


  const m2GdpBase = m2Base / gdpBase;

  // Build a sorted list of years present in all three datasets
  const allYears = Array.from(
    new Set([...cpiMap.keys(), ...m2Map.keys(), ...gdpMap.keys()])
  ).sort((a, b) => a - b);

  const points: THMVariantPoint[] = [];

  // Track last-known values for forward-filling sparse years
  let lastCPI = cpiBase;
  let lastM2  = m2Base;
  let lastGDP = gdpBase;

  for (const year of allYears) {
    if (year < BASE_YEAR) continue;

    const cpi = cpiMap.get(year)  ?? lastCPI;
    const m2  = m2Map.get(year)   ?? lastM2;
    const gdp = gdpMap.get(year)  ?? lastGDP;

    lastCPI = cpi;
    lastM2  = m2;
    lastGDP = gdp;

    const thm_cpi   = 100 * (cpi / cpiBase);
    const thm_m2gdp = 100 * (m2 / gdp) / m2GdpBase;
    const thm_m2raw = 100 * (m2 / m2Base);

    points.push({ year, thm_cpi, thm_m2gdp, thm_m2raw });
  }

  return points;
}

export async function calculateGapSeries(): Promise<Array<{
  year: number;
  m2_index: number;
  gdp_index: number;
  ratio_index: number;
}>> {
  const [m2Map, gdpMap] = await Promise.all([fetchM2Annual(), fetchGDPAnnual()]);

  const m2Base  = m2Map.get(BASE_YEAR);
  const gdpBase = gdpMap.get(BASE_YEAR);

  if (!m2Base || !gdpBase) {
    throw new Error(`Missing base year (${BASE_YEAR}) data for gap series`);
  }

  const m2GdpBase = m2Base / gdpBase;

  const allYears = Array.from(
    new Set([...m2Map.keys(), ...gdpMap.keys()])
  ).sort((a, b) => a - b);

  const points: Array<{ year: number; m2_index: number; gdp_index: number; ratio_index: number }> = [];

  let lastM2  = m2Base;
  let lastGDP = gdpBase;

  for (const year of allYears) {
    if (year < BASE_YEAR) continue;

    const m2  = m2Map.get(year)  ?? lastM2;
    const gdp = gdpMap.get(year) ?? lastGDP;
    lastM2  = m2;
    lastGDP = gdp;

    points.push({
      year,
      m2_index:    100 * (m2 / m2Base),
      gdp_index:   100 * (gdp / gdpBase),
      ratio_index: 100 * (m2 / gdp) / m2GdpBase,
    });
  }

  return points;
}
