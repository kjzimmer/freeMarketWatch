/**
 * scheduler.ts — Daily data refresh jobs using node-cron.
 *
 * Schedule (UTC):
 *   02:00  Fetch CPI, FX, BTC, Equities in parallel
 *   02:45  Recompute purchasing power series (after fetches complete)
 *
 * Jobs run sequentially within each window to share the DB pool
 * without contention. The 45-minute gap between fetches and compute
 * ensures all fetch jobs have finished even if they run slowly.
 *
 * Call startScheduler() once from server/index.ts at startup.
 * Does nothing in test environments.
 */

import cron from 'node-cron';
import { run as fetchCPI } from './fetchCPI';
import { run as fetchFX } from './fetchFX';
import { run as fetchBTC } from './fetchBTC';
import { run as fetchEquities } from './fetchEquities';
import { run as computePPSeries } from './computePPSeries';
import { run as fetchM2GDP } from './fetchM2GDP';

async function runFetches(): Promise<void> {
  console.log('[scheduler] Starting daily fetch jobs…');

  const jobs: [string, () => Promise<void>][] = [
    ['fetchCPI', fetchCPI],
    ['fetchFX', fetchFX],
    ['fetchBTC', fetchBTC],
    ['fetchEquities', fetchEquities],
  ];

  for (const [name, job] of jobs) {
    try {
      await job();
    } catch (err) {
      // Log and continue — one failed source shouldn't block the others
      console.error(`[scheduler] ${name} failed:`, (err as Error).message);
    }
  }

  console.log('[scheduler] Fetch jobs complete.');
}

async function runCompute(): Promise<void> {
  console.log('[scheduler] Starting computePPSeries…');
  try {
    await computePPSeries();
    console.log('[scheduler] computePPSeries complete.');
  } catch (err) {
    console.error('[scheduler] computePPSeries failed:', (err as Error).message);
  }
}

export function startScheduler(): void {
  if (process.env.NODE_ENV === 'test') return;

  // 02:00 UTC daily — fetch all market data sources
  cron.schedule('0 2 * * *', runFetches, { timezone: 'UTC' });

  // 02:45 UTC daily — recompute PP series after fetches
  cron.schedule('45 2 * * *', runCompute, { timezone: 'UTC' });

  // 03:00 UTC Sunday — fetch M2 and GDP (monthly/quarterly updates; weekly refresh sufficient)
  cron.schedule('0 3 * * 0', async () => {
    console.log('[scheduler] Starting M2/GDP fetch…');
    try {
      await fetchM2GDP();
      console.log('[scheduler] M2/GDP fetch complete.');
    } catch (err) {
      console.error('[scheduler] fetchM2GDP failed:', (err as Error).message);
    }
  }, { timezone: 'UTC' });

  console.log('[scheduler] Scheduled: market fetches at 02:00 UTC, compute at 02:45 UTC, M2/GDP at 03:00 UTC Sunday');
}
