import { db } from '../../../db/db';
import { news } from '../../../db/schema';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const result = await db
                .select({
                    id: news.id,
                    title: news.title,
                    description: news.description,
                    date: news.date,
                })
                .from(news);

            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Метод ${req.method} не разрешён`);
    }
}
