import './lib/env';
import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { pool } from './db/connection';
import seriesRouter from './routes/series';
import instrumentsRouter from './routes/instruments';
import healthRouter from './routes/health';
import learnRouter from './routes/learn';
import authRouter from './routes/auth';
import contactRouter from './routes/contact';
import adminPeopleRouter from './routes/adminPeople';
import analyticsRouter from './routes/analytics';
import { startScheduler } from './jobs/scheduler';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3333', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

app.use(cors({
  origin: isProd
    ? ['https://freemarketwatch.world', 'https://www.freemarketwatch.world']
    : ['https://staging.freemarketwatch.world', 'http://localhost:5173', 'http://localhost:5175'],
  credentials: true,
}));

app.use('/api/series', seriesRouter);
app.use('/api/instruments', instrumentsRouter);
app.use('/api/health', healthRouter);
app.use('/api/learn', learnRouter);
app.use('/api/auth', authRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin/people', adminPeopleRouter);
app.use('/api/analytics', analyticsRouter);

// Serve the React build in production — must be after API routes
if (isProd) {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    const prerendered = path.join(clientDist, req.path, 'index.html');
    if (fs.existsSync(prerendered)) {
      res.sendFile(prerendered);
    } else {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });
}

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
  console.log(`[server] NODE_ENV=${process.env.NODE_ENV}`);
  startScheduler();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[server] SIGTERM received — closing pool');
  await pool.end();
  process.exit(0);
});
