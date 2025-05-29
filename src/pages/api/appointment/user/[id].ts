// pages/api/appointments/user/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../db/db';
import { appointments, doctorProfile } from '../../../../../db/schema';
import { eq, asc } from 'drizzle-orm';
import type { InferModel } from 'drizzle-orm';

type Appointment = Omit<InferModel<typeof appointments, 'select'>, 'patient_id'>;
type Doctor = Omit<InferModel<typeof doctorProfile, 'select'>, 'user_id' | 'id'> & {
    id: number | null;
};

type UserAppointment = Appointment & {
    doctor: Doctor;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserAppointment[] | { error: string }>
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: 'Метод не поддерживается' });
    }

    const { id } = req.query;
    if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: 'user_id обязателен' });
    }

    try {
        const rows = await db
            .select({
                id: appointments.id,
                patient_id: appointments.patient_id,
                doctor_id: appointments.doctor_id,
                appointment_date: appointments.appointment_date,
                appointment_time: appointments.appointment_time,
                status: appointments.status,
                appointment_type: appointments.appointment_type,
                comment: appointments.comment,
                diagnosis: appointments.diagnosis,
                file_url: appointments.file_url,
                created_at: appointments.created_at,
                updated_at: appointments.updated_at,

                // Поля врача
                doc_id: doctorProfile.id,
                doc_first_name: doctorProfile.first_name,
                doc_last_name: doctorProfile.last_name,
                doc_category: doctorProfile.category,
            })
            .from(appointments)
            .leftJoin(doctorProfile, eq(doctorProfile.id, appointments.doctor_id))
            .where(eq(appointments.patient_id, id))
            .orderBy(asc(appointments.appointment_date), asc(appointments.appointment_time));

        const result: UserAppointment[] = rows.map((row) => ({
            id: row.id,
            patient_id: row.patient_id,
            doctor_id: row.doctor_id,
            appointment_date: row.appointment_date,
            appointment_time: row.appointment_time,
            status: row.status,
            appointment_type: row.appointment_type,
            comment: row.comment,
            diagnosis: row.diagnosis,
            file_url: row.file_url,
            created_at: row.created_at,
            updated_at: row.updated_at,
            doctor: {
                id: row.doc_id,
                first_name: row.doc_first_name,
                last_name: row.doc_last_name,
                category: row.doc_category,
            },
        }));

        return res.status(200).json(result);
    } catch (err: unknown) {
        console.error('Drizzle select error:', err);
        return res.status(500).json({ error: 'Ошибка сервера при получении записей' });
    }
}
