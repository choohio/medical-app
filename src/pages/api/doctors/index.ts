import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../db/db';
import { doctorProfile, doctorTimeSlots } from '../../../../db/schema';
import type { InferModel } from 'drizzle-orm';

type Doctor = InferModel<typeof doctorProfile, 'select'>;
type TimeSlot = InferModel<typeof doctorTimeSlots, 'select'>;

type DoctorWithSlots = Omit<Doctor & { timeslots: TimeSlot[] }, 'user_id'>;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DoctorWithSlots[] | { error: string }>
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Метод ${req.method} не разрешён`);
    }

    try {
        const doctors = await db
            .select({
                id: doctorProfile.id,
                first_name: doctorProfile.first_name,
                last_name: doctorProfile.last_name,
                category: doctorProfile.category,
            })
            .from(doctorProfile);

        const slots = await db
            .select({
                id: doctorTimeSlots.id,
                doctor_profile_id: doctorTimeSlots.doctor_profile_id,
                date: doctorTimeSlots.date,
                time: doctorTimeSlots.time,
                duration: doctorTimeSlots.duration,
                is_booked: doctorTimeSlots.is_booked,
            })
            .from(doctorTimeSlots);

        const result = doctors.map((doc) => ({
            ...doc,
            timeslots: slots.filter((s) => s.doctor_profile_id === doc.id),
        }));

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
}
