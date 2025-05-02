import { db } from "@/lib/db"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await db.execute('SELECT id, title, description, date FROM news')
      res.status(200).json(result.rows)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Ошибка сервера' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Метод ${req.method} не разрешён`)
  }
}
