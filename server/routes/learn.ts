/**
 * learn.ts — API endpoints for the /learn section.
 *
 * GET /api/learn/thm-charts
 *   Returns all three THM variant series + gap series + chart4 for /lens/thm.
 *   Full 1913–present history; annual data points.
 *
 * Response shape:
 * {
 *   success: true,
 *   data: {
 *     thm_variants: Array<{ year, thm_cpi, thm_m2gdp, thm_m2raw }>,
 *     gap_series:   Array<{ year, m2_index, gdp_index, ratio_index }>,
 *     chart4:       Array<{ year, stolen }>  // thm_m2raw / thm_m2gdp
 *   }
 * }
 */

import { Router, Request, Response } from 'express';
import { calculateTHMVariants, calculateGapSeries } from '../lib/thm-variants';

const router = Router();

// GET /api/learn/thm-charts
router.get('/thm-charts', async (_req: Request, res: Response) => {
  try {
    const [thm_variants, gap_series] = await Promise.all([
      calculateTHMVariants(),
      calculateGapSeries(),
    ]);

    const chart4 = thm_variants.map((p) => ({
      year: p.year,
      stolen: p.thm_m2gdp > 0 ? p.thm_m2raw / p.thm_m2gdp : 1,
    }));

    return res.json({
      success: true,
      data: { thm_variants, gap_series, chart4 },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[learn/thm-charts] Error:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
});

export default router;
