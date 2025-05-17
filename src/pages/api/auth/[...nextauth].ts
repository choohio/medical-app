import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import YandexProvider from "next-auth/providers/yandex";
import { compare } from "bcrypt";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {

        if (!credentials?.email) {
          throw new Error("EmailRequired"); 
        }

        const { email, password } = credentials;

        const result = await db.execute({
          sql: "SELECT * FROM users WHERE email = ?",
          args: [email],
        });

        const user = result.rows[0];

        if (!user) {
          throw new Error("UserNotFound");
        }

        const passwordValid = await compare(password, user['password_hash'] as string);
        if (!passwordValid) {
          throw new Error("InvalidPassword");
        }

        return {
          id: String(user.id),               
          email: String(user.email),            
          role: user.role ? String(user.role) : null, 
        };
      },
    }),
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID as string,
      clientSecret: process.env.YANDEX_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
}

export default NextAuth(authOptions);
