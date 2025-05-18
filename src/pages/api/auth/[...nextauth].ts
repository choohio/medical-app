import NextAuth, { NextAuthOptions, Session, User, Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import YandexProvider from "next-auth/providers/yandex";
import { compare } from "bcrypt";
import { db } from "@/lib/db";

interface YandexProfile extends Profile {
  id: string;
  default_email?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  default_avatar_id?: string;
  sex?: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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
      clientSecret: process.env.YANDEX_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log(profile)
      if (account?.provider === 'yandex' && profile) {
        const yandexProfile = profile as YandexProfile;
        console.log(yandexProfile)
        const email = user.email || yandexProfile.default_email;
        if (!email) {
          console.error('Email not found in Yandex profile');
          return false;
        }

        // Начинаем транзакцию
        const tx = await db.transaction();

        try {
          // Проверяем, есть ли пользователь
          const existingUser = await tx.execute({
            sql: 'SELECT id FROM users WHERE email = ? LIMIT 1',
            args: [email],
          });

          let userId: string;

          if (existingUser.rows.length === 0) {
            // Создаём нового пользователя
            const role = 'patient';
            const createdAt = new Date().toISOString();

            const insertUserResult = await tx.execute({
              sql: `INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, ?, ?)`,
              args: [email, null, role, createdAt],
            });

            if (insertUserResult.lastInsertRowid === undefined || insertUserResult.lastInsertRowid === null) {
                throw new Error("Failed to get new user ID after insertion");
            }
            userId = String(insertUserResult.lastInsertRowid);

            // Вставляем профиль с привязкой по user_id
            const firstName = yandexProfile.first_name || '';
            const lastName = yandexProfile.last_name || '';
            const gender = yandexProfile.sex || '';

            await tx.execute({
              sql: `INSERT INTO patient_profiles (user_id, first_name, last_name, gender) VALUES (?, ?, ?, ?)`,
              args: [userId, firstName, lastName, gender],
            });

            await tx.commit();
          } else {
            // User already exists, get their ID
            userId = String(existingUser.rows[0].id);
            await tx.rollback(); // We don't need the transaction if the user exists
          }

          (user as any).id = userId;

          return true;
        } catch (error) {
          await tx.rollback();
          console.error('Ошибка в signIn:', error);
          return false;
        }
      } else if (account?.provider === 'credentials') {

          return true;
      }
      return false;
    },
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
