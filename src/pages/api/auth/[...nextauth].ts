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
      id: string; 
      name?: string | null; 
      email?: string | null; 
      image?: string | null; 
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; 
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
