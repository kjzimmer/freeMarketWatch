import { Router, Request, Response } from 'express';
import { pool } from '../db/connection';
import { calculateTHM } from '../lib/thm';

const router = Router();

type WindowYears = 1 | 5 | 10;
const VALID_WINDOWS: WindowYears[] = [1, 5, 10];

function parseWindow(raw: unknown): WindowYears | null {
  const n = Number(raw);
  return (VALID_WINDOWS as number[]).includes(n) ? (n as WindowYears) : null;
}

// GET /api/series/:ticker?window=10
router.get('/:ticker', async (req: Request, res: Response) => {
  const ticker = req.params.ticker.toUpperCase();
  const windowYears = parseWindow(req.query['window'] ?? 10);

  if (!windowYears) {
    return res.status(400).json({ success: false, error: 'window must be 1, 5, or 10' });
  }

  // THM is not stored in market_pp_series — compute on-demand
  if (ticker === 'THM') {
    const windowStart = new Date();
    windowStart.setUTCFullYear(windowStart.getUTCFullYear() - windowYears);
    const today = new Date();
    const points = calculateTHM(windowStart, today);
    return res.json({
      success: true,
      data: { ticker: 'THM', window: windowYears, data: points },
    });
  }

  const { rows } = await pool.query<{ date: Date; pp_index: string }>(
    `SELECT date, pp_index
     FROM market_pp_series
     WHERE ticker = $1 AND window_years = $2
     ORDER BY date ASC`,
    [ticker, windowYears]
  );

  if (rows.length === 0) {
    return res.status(404).json({ success: false, error: `No data for ticker ${ticker} in ${windowYears}Y window` });
  }

  const data = rows.map((r) => ({
    date: r.date.toISOString().split('T')[0],
    value: parseFloat(r.pp_index),
  }));

  return res.json({ success: true, data: { ticker, window: windowYears, data } });
});

// GET /api/series/group/:group?window=10&btcAs=currency&view=real
router.get('/group/:group', async (req: Request, res: Response) => {
  const group = req.params.group.toLowerCase();
  const windowYears = parseWindow(req.query['window'] ?? 10);
  const btcAs = (req.query['btcAs'] as string | undefined)?.toLowerCase() ?? 'currency';
  const rawView = (req.query['view'] as string | undefined)?.toLowerCase() ?? 'real';
  const view: 'real' | 'nominal' = rawView === 'nominal' ? 'nominal' : 'real';

  if (!windowYears) {
    return res.status(400).json({ success: false, error: 'window must be 1, 5, or 10' });
  }

  if (!['currency', 'riskoff', 'riskon'].includes(group)) {
    return res.status(400).json({ success: false, error: 'group must be currency, riskoff, or riskon' });
  }

  // Determine which tickers belong in this panel (respecting BTC toggle)
  const { rows: instruments } = await pool.query<{ ticker: string }>(
    `SELECT ticker FROM market_instruments
     WHERE group_name = $1 OR ticker = 'THM'
     ORDER BY id ASC`,
    [group]
  );

  let tickers = instruments.map((r) => r.ticker);

  // BTC toggle: only include BTC in the group the user assigned it to
  const btcGroup = btcAs === 'riskon' ? 'riskon' : 'currency';
  if (group === btcGroup) {
    if (!tickers.includes('BTC')) tickers.push('BTC');
  } else {
    tickers = tickers.filter((t) => t !== 'BTC');
  }

  // In nominal view, USD is always 100 — meaningless on the currency chart, so omit it
  if (view === 'nominal' && group === 'currency') {
    tickers = tickers.filter((t) => t !== 'USD');
  }

  // Fetch all series for these tickers in one query (exclude THM — computed below)
  const dbTickers = tickers.filter((t) => t !== 'THM');

  // Select the appropriate index column based on view
  const indexCol = view === 'nominal' ? 'COALESCE(nominal_index, pp_index)' : 'pp_index';

  const { rows: ppRows } = await pool.query<{ ticker: string; date: Date; index_value: string }>(
    `SELECT ticker, date, ${indexCol} AS index_value
     FROM market_pp_series
     WHERE ticker = ANY($1) AND window_years = $2
     ORDER BY ticker, date ASC`,
    [dbTickers, windowYears]
  );

  // Group by ticker
  const series: Record<string, { date: string; value: number }[]> = {};

  for (const row of ppRows) {
    if (!series[row.ticker]) series[row.ticker] = [];
    series[row.ticker].push({
      date: row.date.toISOString().split('T')[0],
      value: parseFloat(row.index_value),
    });
  }

  // THM: always the real benchmark regardless of view
  const windowStart = new Date();
  windowStart.setUTCFullYear(windowStart.getUTCFullYear() - windowYears);
  series['THM'] = calculateTHM(windowStart, new Date());

  return res.json({
    success: true,
    data: { group, window: windowYears, btcAs, view, series },
  });
});

export default router;
