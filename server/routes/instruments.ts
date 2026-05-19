import { Router, Request, Response } from 'express';
import { pool } from '../db/connection';

const router = Router();

// GET /api/instruments
router.get('/', async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT ticker, name, group_name, data_source, frequency, notes
     FROM market_instruments
     ORDER BY id ASC`
  );
  return res.json({ success: true, data: rows });
});

export default router;
