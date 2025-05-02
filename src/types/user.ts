type Role = 'doctor' | 'patient'

export type User = {
  id: number;
  name: string;
  email: string;
}

export type RegisterData = {
  name: string;
  surname: string;
  password: string;
  role: Role;
  email: string;
}

export type LoginData = {
  email: string;
  password: string;
}