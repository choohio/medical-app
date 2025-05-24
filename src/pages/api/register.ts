import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { user, patientProfile, doctorProfile } from '../../../db/schema';
import { db } from '../../../db/db';
import { randomUUID } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Метод не поддерживается' });
    }

    const { firstName, lastName, email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await db.transaction(async (tx) => {
            const insertedUsers = await tx
                .insert(user)
                .values({
                    id: randomUUID(),
                    email,
                    hashedPassword: hashedPassword,
                    role: role ?? 'patient',
                    emailVerified: null,
                })
                .returning({ id: user.id });

            const userId = insertedUsers[0]?.id;

            if (!userId) throw new Error('Ошибка создания пользователя');

            if (role === 'patient') {
                await tx.insert(patientProfile).values({
                    user_id: userId,
                    first_name: firstName,
                    last_name: lastName,
                });
            } else {
                await tx.insert(doctorProfile).values({
                    user_id: userId,
                    first_name: firstName,
                    last_name: lastName,
                });
            }

            return userId;
        });

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/send-verification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        return res.status(201).json({ message: 'Пользователь зарегистрирован!', userId: result });
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email уже зарегистрирован' });
        }

        console.error(error);
        return res.status(500).json({ error: 'Ошибка при регистрации' });
    }
}
