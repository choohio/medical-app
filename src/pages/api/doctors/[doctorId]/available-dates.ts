import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { doctorId } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!doctorId || typeof doctorId !== 'string') {
        return res.status(400).json({ error: 'Invalid doctorId' });
    }

    try {
        const result = await db.execute({
            sql: `
        SELECT DISTINCT date
        FROM available_slots
        WHERE doctor_id = ? AND is_booked = 0
        ORDER BY date ASC
      `,
            args: [doctorId],
        });

        const dates = result.rows.map((row) => row.date);

        return res.status(200).json({ dates });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
