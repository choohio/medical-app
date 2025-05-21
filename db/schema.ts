import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  hashedPassword: text("hashedPassword"),
  role: text("role")
})

export const patientProfile = sqliteTable('patient_profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: text('user_id').notNull().references(() => users.id),
  first_name: text('first_name'),
  last_name: text('last_name'),
  snils: text('snils'),
  gender: text('gender'),
  birthDate: text('birthday')
});

export const doctorProfile = sqliteTable('doctor_profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: text('user_id').notNull().references(() => users.id),
  first_name: text('first_name'),
  last_name: text('last_name'),
  category: text('category')
});

export const news = sqliteTable('news', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  date: text('date')
})
