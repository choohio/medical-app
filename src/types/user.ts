type Role = 'doctor' | 'patient';

export type User = {
    userId: number;
    firstName: string;
    email: string;
};

export type RegisterData = {
    firstName: string;
    lastName: string;
    password: string;
    role: Role;
    email: string;
};

export type LoginData = {
    email: string;
    password: string;
};

export type DBUser = {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: string;
    password_hash: string;
};
