import { Router, Request, Response } from 'express';
import { pool } from '../db/connection';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.use(requireAdmin);

// GET /api/admin/people
router.get('/', async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT p.*, COUNT(m.id)::int AS message_count
     FROM admin_people p
     LEFT JOIN admin_contact_messages m ON m.person_id = p.id
     GROUP BY p.id
     ORDER BY p.created_at DESC`
  );
  res.json({ success: true, data: rows });
});

// GET /api/admin/people/:id — with full message history
router.get('/:id', async (req: Request, res: Response) => {
  const { rows: [person] } = await pool.query(
    'SELECT * FROM admin_people WHERE id = $1',
    [req.params.id]
  );
  if (!person) {
    res.status(404).json({ success: false, error: 'Not found' });
    return;
  }

  const { rows: messages } = await pool.query(
    'SELECT * FROM admin_contact_messages WHERE person_id = $1 ORDER BY created_at DESC',
    [req.params.id]
  );

  res.json({ success: true, data: { ...person, messages } });
});

// PATCH /api/admin/people/:id
router.patch('/:id', async (req: Request, res: Response) => {
  const { name, email, phone, notes, tags } = req.body;
  const { rows: [person] } = await pool.query(
    `UPDATE admin_people
     SET name  = COALESCE($1, name),
         email = COALESCE($2, email),
         phone = COALESCE($3, phone),
         notes = COALESCE($4, notes),
         tags  = COALESCE($5, tags),
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [name, email, phone, notes, tags, req.params.id]
  );
  if (!person) {
    res.status(404).json({ success: false, error: 'Not found' });
    return;
  }
  res.json({ success: true, data: person });
});

// DELETE /api/admin/people/:id
router.delete('/:id', async (req: Request, res: Response) => {
  await pool.query('DELETE FROM admin_people WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

export default router;
