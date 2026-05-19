import { pool } from '../connection';

interface FetchLogEntry {
  source: string;
  endpoint?: string;
  recordsAdded?: number;
  success: boolean;
  errorMsg?: string;
}

export async function logFetch(entry: FetchLogEntry): Promise<void> {
  await pool.query(
    `INSERT INTO fetch_log (source, endpoint, records_added, success, error_msg)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      entry.source,
      entry.endpoint ?? null,
      entry.recordsAdded ?? null,
      entry.success,
      entry.errorMsg ?? null,
    ]
  );
}

export async function getLatestFetch(source: string): Promise<Date | null> {
  const { rows } = await pool.query<{ fetched_at: Date }>(
    `SELECT fetched_at FROM fetch_log
     WHERE source = $1 AND success = true
     ORDER BY fetched_at DESC
     LIMIT 1`,
    [source]
  );
  return rows[0]?.fetched_at ?? null;
}
