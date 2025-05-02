import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { db } from "../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email и пароль обязательны" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
      await db.execute(
        `INSERT INTO users (name, email, role, password_hash) VALUES ('${name}', '${email}', '${role}', '${passwordHash}')`
      );

      return res.status(201).json({ message: "Пользователь зарегистрирован!" });
    } catch (error: any) {
      console.error(error.message)
      return res.status(500).json({ error: "Ошибка при регистрации" });
    }
  } else {
    res.status(405).json({ error: "Метод не поддерживается" });
  }
}

export default handler;
