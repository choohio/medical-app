import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../db/db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: 'Необходимо указать корректный id записи' });
        }

        try {
            const result = await db.execute(
                `   
    SELECT 
        a.id AS appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.appointment_type,
        a.status,
        
        d.id AS doctor_id,
        d.first_name AS doctor_first_name,
        d.last_name AS doctor_last_name,
        d.address AS doctor_address,
        d.specialty AS doctor_specialty

    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    WHERE a.id = ?
    `,
                [id]
            );

            const row = Array.isArray(result.rows) ? result.rows[0] : null;

            if (!row) {
                return res.status(404).json({ error: 'Запись не найдена' });
            }

            const data = {
                id: row.appointment_id,
                appointment_date: row.appointment_date,
                appointment_time: row.appointment_time,
                appointment_type: row.appointment_type,
                status: row.status,
                doctor: {
                    id: row.doctor_id,
                    first_name: row.doctor_first_name,
                    last_name: row.doctor_last_name,
                    address: row.doctor_address,
                    specialty: row.doctor_specialty,
                },
            };

            return res.status(200).json(data);
        } catch (error: unknown) {
            console.error(error instanceof Error ? error.message : error);
            return res.status(500).json({ error: 'Ошибка при получении записи' });
        }
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}

export default handler;
