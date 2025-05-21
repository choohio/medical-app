import { NextApiRequest, NextApiResponse } from 'next';
import { passwordResetTokens, user } from '../../../../db/schema';
import { db } from '../../../../db/db';
import { hash } from 'bcrypt';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Токен и пароль обязательны' });

  const resetRequest = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token)).limit(1);

  if (!resetRequest.length || (Number(resetRequest[0].expires_at) < Date.now())) {
    return res.status(400).json({ message: 'Токен недействителен или истёк' });
  }

  const hashedPassword = await hash(password, 10);

  // Обновляем пароль пользователя
  await db.update(user)
    .set({ hashedPassword: hashedPassword })
    .where(eq(user.id, resetRequest[0].user_id))
    .run();

  // Удаляем запись с токеном
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token)).run();

  res.status(200).json({ message: 'Пароль успешно сброшен' });
}
