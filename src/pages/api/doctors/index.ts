import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../db/db';
import { doctorProfile, doctorTimeSlots } from '../../../../db/schema';
import type { InferModel } from 'drizzle-orm';

type Doctor = InferModel<typeof doctorProfile, 'select'>;

type Timeslot = { time: string; duration: number; is_booked: boolean };

type DoctorWithSlots = Omit<
    Doctor & {
        timeslots: {
            date: string;
            timeslots: Timeslot[];
        }[];
    },
    'user_id'
>;

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

        const result = doctors.map((doc) => {
            const docSlots = slots.filter((s) => s.doctor_profile_id === doc.id);

            const grouped: Record<string, { date: string; timeslots: Timeslot[] }> = {};
            for (const slot of docSlots) {
                const dateKey =
                    slot.date instanceof Date
                        ? slot.date.toISOString().slice(0, 10) // YYYY-MM-DD
                        : slot.date; // если уже строка
                if (!grouped[dateKey]) {
                    grouped[dateKey] = {
                        date: dateKey,
                        timeslots: [],
                    };
                }
                const timeStr =
                    slot.time instanceof Date
                        ? slot.time.toISOString().slice(11, 16) // HH:MM
                        : slot.time;
                if (!grouped[dateKey].timeslots.find((timeslot) => timeslot.time === timeStr)) {
                    grouped[dateKey].timeslots.push({
                        time: timeStr,
                        duration: slot.duration,
                        is_booked: slot.is_booked,
                    });
                }
            }

            return {
                ...doc,
                timeslots: Object.values(grouped),
            };
        });

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
}
