import { NextApiRequest, NextApiResponse } from 'next';
import { patientProfile } from '../../../../db/schema';
import { db } from '../../../../db/db';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    console.log(req.query, id);
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
        const { first_name, gender, birth_date, snils } = req.body;

        try {
            const existing = await db
                .select()
                .from(patientProfile)
                .where(eq(patientProfile['user_id'], id))
                .limit(1);

            if (existing.length === 0) {
                return res.status(404).json({ error: 'Профиль не найден' });
            }

            const profile = existing[0];

            const updatedFields = {
                firstN: first_name ?? profile.first_name,
                gender: gender ?? profile.gender,
                birthDate: birth_date ?? profile.birthDate,
                // phone: phone ?? profile.phone,
                // address: address ?? profile.address,
                snils: snils ?? profile.snils,
            };

            await db
                .update(patientProfile)
                .set(updatedFields)
                .where(eq(patientProfile['user_id'], id));

            return res.status(200).json({ ...profile, ...updatedFields });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка обновления профиля' });
        }
    }

    return res.status(405).json({ error: 'Метод не поддерживается' });
}
