import { Router, Request, Response } from 'express';
import { pool } from '../db/connection';

const router = Router();

interface SourceStatus {
  source: string;
  lastFetch: string | null;
  success: boolean | null;
  stale: boolean;
}

const STALE_THRESHOLD_DAYS = 2;

// GET /api/health
router.get('/', async (_req: Request, res: Response) => {
  const sources = ['FRED_CPI', 'FRED_FX', 'CryptoCompare_BTC', 'YahooFinance', 'compute_pp_series'];

  const { rows } = await pool.query<{
    source: string;
    fetched_at: Date;
    success: boolean;
  }>(
    `SELECT DISTINCT ON (source) source, fetched_at, success
     FROM fetch_log
     WHERE source = ANY($1)
     ORDER BY source, fetched_at DESC`,
    [sources]
  );

  const now = new Date();
  const statusMap = new Map(rows.map((r) => [r.source, r]));

  const statuses: SourceStatus[] = sources.map((source) => {
    const row = statusMap.get(source);
    if (!row) {
      return { source, lastFetch: null, success: null, stale: true };
    }
    const ageMs = now.getTime() - row.fetched_at.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    return {
      source,
      lastFetch: row.fetched_at.toISOString(),
      success: row.success,
      stale: !row.success || ageDays > STALE_THRESHOLD_DAYS,
    };
  });

  const allHealthy = statuses.every((s) => !s.stale);

  return res.status(allHealthy ? 200 : 503).json({
    success: allHealthy,
    data: { status: allHealthy ? 'healthy' : 'degraded', sources: statuses },
  });
});

export default router;
