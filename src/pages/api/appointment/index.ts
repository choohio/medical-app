import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../db/db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { patient_id, doctor_id, appointment_time, appointment_date, appointment_type } =
            req.body;

        if (!patient_id || !doctor_id) {
            return res.status(400).json({ error: 'Ошибка при создании записи' });
        }

        try {
            await db.execute(
                `INSERT INTO appointments (patient_id, doctor_id, appointment_time, appointment_date, appointment_type, status) VALUES ('${patient_id}', '${doctor_id}', '${appointment_time}', '${appointment_date}', '${appointment_type}', 'scheduled')`
            );

            const result = await db.execute('SELECT last_insert_rowid() as id');
            const newId = result.rows[0].id;

            return res.status(201).json({ message: 'Запись создана', id: newId });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(error);
            }
            return res.status(500).json({ error: 'Ошибка создании записи' });
        }
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}

export default handler;
