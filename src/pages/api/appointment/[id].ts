import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../db/db';
import { appointments, doctorProfile } from '../../../../db/schema';
import type { InferModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

type Appointment = Omit<
    InferModel<typeof appointments, 'select'>,
    'created_at' | 'updated_at' | 'doctor_id'
>;
type Doctor = Omit<InferModel<typeof doctorProfile, 'select'>, 'user_id'>;

type AppointmentWithDoctor = Appointment & { doctor: Doctor };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AppointmentWithDoctor | { error: string }>
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: 'Метод не поддерживается' });
    }

    const { id } = req.query;
    if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: 'Необходимо указать корректный id записи' });
    }

    const appointmentId = Number(id);
    if (Number.isNaN(appointmentId)) {
        return res.status(400).json({ error: 'ID записи должен быть числом' });
    }

    try {
        const row = await db
            .select({
                id: appointments.id,
                appointment_date: appointments.appointment_date,
                appointment_time: appointments.appointment_time,
                appointment_type: appointments.appointment_type,
                status: appointments.status,
                comment: appointments.comment,
                diagnosis: appointments.diagnosis,
                file_url: appointments.file_url,
                doctor_id: doctorProfile.id,
                doctor_first_name: doctorProfile.first_name,
                doctor_last_name: doctorProfile.last_name,
                doctor_category: doctorProfile.category,
            })
            .from(appointments)
            .innerJoin(doctorProfile, eq(doctorProfile.id, appointments.doctor_id))
            .where(eq(appointments.id, appointmentId))
            .limit(1)
            .then((rows) => rows[0] ?? null);

        if (!row) {
            return res.status(404).json({ error: 'Запись не найдена' });
        }

        const result: AppointmentWithDoctor = {
            id: row.id,
            appointment_date:
                row.appointment_date instanceof Date
                    ? row.appointment_date.toISOString().slice(0, 10) // YYYY-MM-DD
                    : row.appointment_date,
            appointment_time:
                row.appointment_time instanceof Date
                    ? row.appointment_time.toISOString().slice(11, 16) // HH:MM
                    : row.appointment_time,
            appointment_type: row.appointment_type,
            status: row.status,
            comment: row.comment,
            diagnosis: row.diagnosis,
            file_url: row.file_url,
            doctor: {
                id: row.doctor_id,
                first_name: row.doctor_first_name,
                last_name: row.doctor_last_name,
                category: row.doctor_category,
            },
        };

        return res.status(200).json(result);
    } catch (err: unknown) {
        console.error('Drizzle select error:', err);
        return res.status(500).json({ error: 'Ошибка при получении записи' });
    }
}
