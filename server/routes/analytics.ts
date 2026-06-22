import { Router, Request, Response } from 'express';
import axios from 'axios';
import { requireAdmin } from '../middleware/auth';

const router = Router();

interface CacheEntry { data: unknown; at: number }
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000;

const ZONE_QUERY = `
  query($zoneTag: String!, $startDate: Date!, $endDate: Date!) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        httpRequests1dGroups(
          limit: 31
          filter: { date_geq: $startDate, date_leq: $endDate }
          orderBy: [date_ASC]
        ) {
          dimensions { date }
          uniq { uniques }
          sum { requests pageViews bytes countryMap { clientCountryName requests } }
        }
      }
    }
  }
`;

// GET /api/analytics?range=7|14|30
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  const range = Math.min(30, Math.max(7, parseInt((req.query.range as string) ?? '30', 10)));

  const cacheKey = `analytics-${range}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL) {
    res.json({ success: true, data: cached.data });
    return;
  }

  const token = process.env.CF_ANALYTICS_TOKEN;
  const zoneId = process.env.CF_ZONE_ID;
  if (!token || !zoneId) {
    res.status(503).json({ success: false, error: 'CF_ANALYTICS_TOKEN and CF_ZONE_ID not configured' });
    return;
  }

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const cfRes = await axios.post(
    'https://api.cloudflare.com/client/v4/graphql',
    { query: ZONE_QUERY, variables: { zoneTag: zoneId, startDate, endDate } },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  const groups: {
    dimensions: { date: string };
    uniq: { uniques: number };
    sum: { requests: number; pageViews: number; bytes: number; countryMap: { clientCountryName: string; requests: number }[] };
  }[] = cfRes.data?.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];

  const daily = groups.map((g) => ({
    date: g.dimensions.date,
    uniques: g.uniq.uniques,
    requests: g.sum.requests,
    pageViews: g.sum.pageViews,
    bytes: g.sum.bytes,
  }));

  const totals = daily.reduce(
    (acc, d) => ({
      uniques: acc.uniques + d.uniques,
      requests: acc.requests + d.requests,
      pageViews: acc.pageViews + d.pageViews,
      bytes: acc.bytes + d.bytes,
    }),
    { uniques: 0, requests: 0, pageViews: 0, bytes: 0 }
  );

  const countryTotals = new Map<string, number>();
  for (const g of groups) {
    for (const { clientCountryName, requests } of g.sum.countryMap ?? []) {
      countryTotals.set(clientCountryName, (countryTotals.get(clientCountryName) ?? 0) + requests);
    }
  }
  const countries = Array.from(countryTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([country, requests]) => ({ country, requests }));

  const data = { daily, totals, countries, source: 'cloudflare', range };
  cache.set(cacheKey, { data, at: Date.now() });
  res.json({ success: true, data });
});

export default router;
