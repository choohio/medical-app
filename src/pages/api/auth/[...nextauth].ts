import NextAuth, { NextAuthOptions, Session, User, Account, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import YandexProvider from "next-auth/providers/yandex";
import { compare } from "bcrypt";
import { eq } from 'drizzle-orm';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import * as schema from '../../../../db/schema';
import { db } from '../../../../db/db';

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
          .from(schema.users)
          .where(eq(schema.users.email, email));
    
        const user = result[0];
    
        if (!user || !user.hashedPassword) {
          throw new Error('InvalidCredentials');
        }
    
        const passwordValid = await compare(password as string, user.hashedPassword);
    
        if (!passwordValid) {
          throw new Error('InvalidPassword');
        }
        console.log(user)
    
        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image ?? null,
        };
      },
    }),
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID as string,
      clientSecret: process.env.YANDEX_CLIENT_SECRET as string,
    })
  ],
  callbacks: {

  },
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
}

export default NextAuth(authOptions);
