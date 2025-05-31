import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { patientProfile, user as userSchema } from '../../../../db/schema';
import { db } from '../../../../db/db';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Некорректный ID' });
    }

    if (req.method === 'GET') {
        try {
            const profile = await db
                .select()
                .from(patientProfile)
                .where(eq(patientProfile['user_id'], id))
                .limit(1);

            if (profile.length === 0) {
                return res.status(404).json({ error: 'Профиль не найден' });
            }

            return res.status(200).json(profile[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка получения профиля' });
        }
    }

    if (req.method === 'PUT') {
        const { data, userId } = req.body;
        const { first_name, last_name, phone, newPassword, email } = data;

        try {
            const existing = await db
                .select()
                .from(patientProfile)
                .where(eq(patientProfile['user_id'], userId))
                .limit(1);

            const existingUser = await db
                .select()
                .from(userSchema)
                .where(eq(userSchema['id'], userId))
                .limit(1);

            if (existing.length === 0) {
                return res.status(404).json({ error: 'Профиль не найден' });
            }

            const profile = existing[0];
            const user = existingUser[0];

            const updatedFields = {
                first_name: first_name ?? profile.first_name,
                last_name: last_name ?? profile.last_name,
                phone: phone ?? profile.phone,
            };

            await db
                .update(patientProfile)
                .set(updatedFields)
                .where(eq(patientProfile['user_id'], userId));

            await db
                .update(userSchema)
                .set({
                    hashedPassword: newPassword
                        ? await bcrypt.hash(newPassword, 10)
                        : user.hashedPassword,
                    email: email ?? user.email,
                })
                .where(eq(userSchema['id'], userId));

            return res.status(200).json({ ...profile, ...updatedFields });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка обновления профиля' });
        }
    }

    return res.status(405).json({ error: 'Метод не поддерживается' });
}
