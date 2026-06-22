import { Router, Request, Response } from 'express';
import { pool } from '../db/connection';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/contact — public; upserts person, creates message
router.post('/', async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ success: false, error: 'All fields required' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  const { rows: personRows } = await pool.query<{ id: string }>(
    `INSERT INTO admin_people (email, name)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
     RETURNING id`,
    [normalizedEmail, name.trim()]
  );

  await pool.query(
    `INSERT INTO admin_contact_messages (person_id, name, email, subject, message)
     VALUES ($1, $2, $3, $4, $5)`,
    [personRows[0].id, name.trim(), normalizedEmail, subject.trim(), message.trim()]
  );

  res.status(201).json({ success: true });
});

// GET /api/contact — admin only
router.get('/', requireAdmin, async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT m.id, m.person_id, m.name, m.email, m.subject, m.message,
            m.read, m.created_at, p.tags
     FROM admin_contact_messages m
     LEFT JOIN admin_people p ON p.id = m.person_id
     ORDER BY m.created_at DESC`
  );
  res.json({ success: true, data: rows });
});

// PATCH /api/contact/:id/read — admin only
router.patch('/:id/read', requireAdmin, async (req: Request, res: Response) => {
  await pool.query(
    'UPDATE admin_contact_messages SET read = TRUE WHERE id = $1',
    [req.params.id]
  );
  res.json({ success: true });
});

export default router;
