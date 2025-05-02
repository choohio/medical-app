import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), 
      path: "/",
    })
  );
  res.status(200).json({ message: "Logged out" });
}
