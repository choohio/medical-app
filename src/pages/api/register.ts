import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { db } from '../../lib/db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, surname, email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email и пароль обязательны' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        try {
            const tx = await db.transaction();

            await tx.execute(
                `INSERT INTO users (first_name, last_name, email, role, password_hash) VALUES ('${name}', '${surname}', '${email}', '${role}', '${passwordHash}')`
            );

            const result = await tx.execute('SELECT last_insert_rowid() as id');
            const userId = result.rows[0].id;

            await tx.execute(`INSERT INTO patient_profiles (user_id) VALUES ('${userId}')`);

            await tx.commit();

            return res.status(201).json({ message: 'Пользователь зарегистрирован!' });
        } catch (error: unknown) {
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
