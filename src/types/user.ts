type Role = 'doctor' | 'patient';

export type User = {
    userId: number;
    name: string;
    email: string;
};

export type RegisterData = {
    name: string;
    surname: string;
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
