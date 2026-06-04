/**
 * migrate.ts — Applies pending SQL migrations from server/db/migrations/.
 *
 * Tracks applied migrations in a `migrations` table.
 * Idempotent: already-applied migrations are skipped.
 * Each migration runs inside a transaction — partial failures roll back cleanly.
 *
 * Usage (standalone):
 *   npx tsx server/db/migrate.ts
 *
 * Called automatically at startup via package.json "start" script:
 *   node server/dist/db/migrate.js && node server/dist/index.js
 */

import '../lib/env';
import fs from 'fs';
import path from 'path';
import { pool } from './connection';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function run(): Promise<void> {
  const client = await pool.connect();

  try {
    // Create the tracking table if this is the first run
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id         SERIAL       PRIMARY KEY,
        filename   VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);

    const { rows } = await client.query<{ filename: string }>(
      'SELECT filename FROM migrations ORDER BY filename ASC'
    );
    const applied = new Set(rows.map((r) => r.filename));

    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    let count = 0;

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`[migrate] skip  ${file}`);
        continue;
      }

      console.log(`[migrate] apply ${file}`);
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        count++;
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Migration ${file} failed: ${(err as Error).message}`);
      }
    }

    if (count === 0) {
      console.log('[migrate] up to date');
    } else {
      console.log(`[migrate] applied ${count} migration(s)`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('[migrate] fatal:', err.message);
  process.exit(1);
});
