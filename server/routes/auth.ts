import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/connection';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password required' });
    return;
  }

  const { rows } = await pool.query<{
    id: string;
    email: string;
    password_hash: string;
    is_admin: boolean;
  }>(
    'SELECT id, email, password_hash, is_admin FROM user_accounts WHERE email = $1',
    [email.toLowerCase().trim()]
  );

  const user = rows[0];
  if (!user?.is_admin) {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, is_admin: user.is_admin },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.json({ success: true, data: { token } });
});

// GET /api/auth/me — verify token and return payload
router.get('/me', requireAdmin, (req: Request, res: Response) => {
  res.json({ success: true, data: req.admin });
});

export default router;
