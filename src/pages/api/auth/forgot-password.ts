import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../db/db';
import { user, passwordResetTokens } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email обязателен' });

  const foundUser = await db
          .select()
          .from(user)
          .where(eq(user.email, email))
          .limit(1);

  if (!foundUser.length) return res.status(200).json({ message: 'Если пользователь существует, ссылка отправлена' });

  const token = randomBytes(32).toString('hex');

  // Сохраняем токен сброса
  await db.insert(passwordResetTokens).values({
    user_id: foundUser[0].id,
    token,
    expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), 
  }).run();

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset/${token}`;

  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Сброс пароля',
    text: `Чтобы сбросить пароль, перейдите по ссылке: ${resetLink}`
  });

  return res.status(200).json({ message: 'Если пользователь существует, ссылка отправлена' });
}
