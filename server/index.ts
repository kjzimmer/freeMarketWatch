import 'dotenv/config';
import express from 'express';
import { pool } from './db/connection';
import seriesRouter from './routes/series';
import instrumentsRouter from './routes/instruments';
import healthRouter from './routes/health';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.use(express.json());

// In development, allow requests from the Vite dev server
if (process.env.NODE_ENV === 'development') {
  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
}

app.use('/api/series', seriesRouter);
app.use('/api/instruments', instrumentsRouter);
app.use('/api/health', healthRouter);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
  console.log(`[server] NODE_ENV=${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[server] SIGTERM received — closing pool');
  await pool.end();
  process.exit(0);
});
