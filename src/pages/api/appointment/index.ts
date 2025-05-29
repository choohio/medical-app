import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../db/db';
import { appointments } from '../../../../db/schema';
import type { InferModel } from 'drizzle-orm';

// Тип для вставки новой записи
type NewAppointment = InferModel<typeof appointments, 'insert'>;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string; id: number } | { error: string }>
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Метод ${req.method} не поддерживается` });
    }

    const { patient_id, doctor_id, appointment_date, appointment_time, appointment_type } =
        req.body;

    if (!patient_id || !doctor_id || !appointment_date || !appointment_time || !appointment_type) {
        return res.status(400).json({ error: 'Не переданы все обязательные параметры' });
    }

    try {
        const newAppointment: NewAppointment = {
            patient_id,
            doctor_id,
            appointment_date: new Date(appointment_date),
            appointment_time: new Date(appointment_time),
            appointment_type,
            status: 'scheduled',
        };

        const [inserted] = await db
            .insert(appointments)
            .values(newAppointment)
            .returning({ id: appointments.id });

        return res.status(201).json({ message: 'Запись создана', id: inserted.id });
    } catch (error: unknown) {
        console.error('Drizzle insert error:', error);
        return res.status(500).json({ error: 'Ошибка при создании записи' });
    }
}
