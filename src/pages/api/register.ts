import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { db } from '../../lib/db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { firstName, lastName, email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email и пароль обязательны' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const tx = await db.transaction();

        try {
            const result = await tx.execute({
                sql: `INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, ?, ?)`,
                args: [email, hashedPassword, role, new Date().toISOString()]
            }
            );

            const userId = result.lastInsertRowid;

            await tx.execute({
                sql: `INSERT INTO patient_profiles (user_id, first_name, last_name) VALUES (?, ?, ?)`,
                args: [userId, firstName, lastName]
            }   
            );

            await tx.commit();

            return res.status(201).json({ message: 'Пользователь зарегистрирован!' });
        } catch (error: unknown) {
            await tx.rollback();
            if (error instanceof Error) {
                if (error.message.includes('UNIQUE constraint failed: users.email')) {
                    return res.status(409).json({ error: 'Email уже зарегистрирован' });
                }
                console.error(error.message);
            } else {
                console.error(error);
            }
            return res.status(500).json({ error: 'Ошибка при регистрации' });
        }
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}

export default handler;
