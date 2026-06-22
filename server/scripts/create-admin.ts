/**
 * Creates or updates the admin user account.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword npx tsx server/scripts/create-admin.ts
 *
 * Safe to re-run — upserts on email.
 */

import '../lib/env';
import bcrypt from 'bcryptjs';
import { pool } from '../db/connection';

async function run() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD before running');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO user_accounts (email, password_hash, is_admin, access_tier, email_verified)
     VALUES ($1, $2, TRUE, 'admin', TRUE)
     ON CONFLICT (email) DO UPDATE
       SET password_hash = $2, is_admin = TRUE, access_tier = 'admin',
           email_verified = TRUE, updated_at = NOW()`,
    [email.toLowerCase().trim(), hash]
  );

  console.log(`[create-admin] Admin user ${email} created/updated`);
  await pool.end();
}

run().catch((err) => {
  console.error('[create-admin] fatal:', err.message);
  process.exit(1);
});
