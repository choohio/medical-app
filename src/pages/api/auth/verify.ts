import { db } from '../../../../db/db';
import { user } from '../../../../db/schema';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET не указан');

    const decoded = jwt.verify(token as string, secret) as { email: string };
    const email = decoded.email;

    const now = new Date();

    const result = await db
      .update(user)
      .set({ emailVerified: now })
      .where(eq(user.email, email));

      return res.redirect(302, '/signin'); 
    } catch (err) {
      console.error('Ошибка токена:', err);
      return res.redirect(302, '/invalid-token'); 
    }
  }
