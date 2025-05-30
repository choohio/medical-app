import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
    image: text('image'),
    hashedPassword: text('hashedPassword'),
    role: text('role'),
    created_at: text('created_at').default(new Date().toISOString()),
    updated_at: text('updated_at').default(new Date().toISOString()),
});

export const patientProfile = sqliteTable('patient_profile', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id')
        .notNull()
        .references(() => user.id),
    first_name: text('first_name'),
    last_name: text('last_name'),
    snils: text('snils'),
    gender: text('gender'),
    birthDate: text('birthday'),
});

export const doctorProfile = sqliteTable('doctor_profile', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id')
        .notNull()
        .references(() => user.id),
    first_name: text('first_name'),
    last_name: text('last_name'),
    category: text('category'),
});

export const doctorTimeSlots = sqliteTable('doctor_time_slots', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    doctor_profile_id: integer('doctor_profile_id')
        .notNull()
        .references(() => doctorProfile.id),
    date: integer({ mode: 'timestamp' }).notNull(),
    time: integer({ mode: 'timestamp' }).notNull(),
    duration: integer('duration').notNull().default(1800000),
    is_booked: integer({ mode: 'boolean' }).notNull().default(false),
});

export const news = sqliteTable('news', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    description: text('description'),
    date: text('date'),
});

export const passwordResetTokens = sqliteTable('password_reset_tokens', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id')
        .notNull()
        .references(() => user.id),
    token: text('token').notNull(),
    expires_at: text('expires_at').notNull(),
});

export const appointments = sqliteTable('appointments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    patient_id: text('patient_id')
        .notNull()
        .references(() => user.id),
    doctor_id: integer('doctor_id')
        .notNull()
        .references(() => doctorProfile.id),
    appointment_date: integer({ mode: 'timestamp' }).notNull(),
    appointment_time: integer({ mode: 'timestamp' }).notNull(),
    status: text('status').notNull(),
    appointment_type: text('appointment_type').notNull(),
    comment: text('comment'),
    diagnosis: text('diagnosis'),
    file_url: text('file_url'),
    created_at: text('created_at').default(new Date().toISOString()),
    updated_at: text('updated_at').default(new Date().toISOString()),
});
