import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешён' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Неверный email' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Подтверждение email',
    html: `<p>Нажмите <a href="${verifyUrl}">сюда</a> для подтверждения почты.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Письмо отправлено' });
  } catch (error) {
    console.error('Ошибка отправки:', error);
    return res.status(500).json({ error: 'Ошибка при отправке письма' });
  }
}
