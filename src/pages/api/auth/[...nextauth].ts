import NextAuth, { NextAuthOptions, Session, User, DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import YandexProvider from "next-auth/providers/yandex";
import { compare } from "bcrypt";
import { eq } from 'drizzle-orm';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import * as schema from '../../../../db/schema';
import { db } from '../../../../db/db';

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id to session user
      name?: string | null; // Ensure name is included and nullable
      email?: string | null; // Ensure email is included and nullable
      image?: string | null; // Ensure image is included and nullable
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string; // Ensure id is string in User type
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Add id to JWT token
  }
}

const adapter = DrizzleAdapter(db);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('MissingEmailOrPassword');
        }
    
        const { email, password } = credentials;
    
        const result = await db
          .select()
          .from(schema.user)
          .where(eq(schema.user.email, email));
    
        const user = result[0];
    
        if (!user || !user.hashedPassword) {
          throw new Error('InvalidCredentials');
        }
    
        const passwordValid = await compare(password as string, user.hashedPassword);
    
        if (!passwordValid) {
          throw new Error('InvalidPassword');
        }
        console.log(user)
    
        return user
      },
    }),
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID as string,
      clientSecret: process.env.YANDEX_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // сохраняем id в токен
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id; // берем id из токена
      }
      return session;
    },
  },
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
}

export default NextAuth(authOptions);
