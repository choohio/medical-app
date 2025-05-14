import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'user_id обязателен' });
        }

        try {
            const result = await db.execute(
                `
                SELECT 
                    a.*,
                    d.first_name AS first_name,
                    d.last_name AS last_name,
                    d.specialty AS specialty,
                    d.address AS address
                FROM appointments a
                LEFT JOIN doctors d ON a.doctor_id = d.id
                WHERE a.patient_id = ?
                ORDER BY a.appointment_date ASC, a.appointment_time ASC
                `,
                [id]
            );

            const appointments = result.rows.map((row) => {
                const { first_name, last_name, specialty, address, ...rest } = row;

                return {
                    ...rest,
                    doctor: {
                        first_name: first_name,
                        last_name: last_name,
                        specialty: specialty,
                        address: address,
                    },
                };
            });

            return res.status(200).json(appointments);
        } catch (error) {
            console.error('Ошибка при получении записей:', error);
            return res.status(500).json({ error: 'Ошибка сервера при получении записей' });
        }
    }

    res.status(405).json({ error: 'Метод не поддерживается' });
}
