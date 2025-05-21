import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../db/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { doctorId } = req.query;
    const { date } = req.query; // Дата передаётся как query param

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!doctorId || typeof doctorId !== 'string') {
        return res.status(400).json({ error: 'Invalid doctorId' });
    }

    if (!date || typeof date !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid date parameter' });
    }

    try {
        const result = await db.execute({
            sql: `
        SELECT time
        FROM available_slots
        WHERE doctor_id = ? AND date = ? AND is_booked = 0
        ORDER BY time ASC
      `,
            args: [doctorId, date],
        });

        const times = result.rows.map((row) => row.time);

        return res.status(200).json({ times });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
