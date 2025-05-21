import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../db/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Некорректный ID' });
    }

    if (req.method === 'GET') {
        try {
            const profile = await db.execute(`SELECT * FROM patient_profiles WHERE user_id = ?`, [
                id,
            ]);

            if (profile.rows.length === 0) {
                return res.status(404).json({ error: 'Профиль не найден' });
            }

            return res.status(200).json(profile.rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка получения профиля' });
        }
    }

    if (req.method === 'PUT') {
        const { full_name, gender, birth_date, phone, address, snils } = req.body;

        try {
            const existing = await db.execute({
                sql: `SELECT * FROM patient_profiles WHERE id = ?`,
                args: [id],
            });

            if (existing.rows.length === 0) {
                return res.status(404).json({ error: 'Профиль не найден' });
            }

            const profile = existing.rows[0];

            const updated = await db.execute(
                `
                    UPDATE patient_profiles
                    SET full_name = ?, gender = ?, birth_date = ?, phone = ?, address = ?, snils = ?
                `,
                [
                    full_name ?? profile.full_name,
                    gender || profile.gender,
                    birth_date || profile.birth_date,
                    phone || profile.phone,
                    address || profile.address,
                    snils || profile.snils,
                ]
            );
            return res.status(200).json(updated);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка обновления профиля' });
        }
    }

    res.status(405).end();
}
