import { User, RegisterData, LoginData } from '@/types';
import axios from 'axios';

type LoginResponse = {
    message: string;
    user: User;
};

export async function registerUser(data: RegisterData) {
    const response = await axios.post('/api/register', data).catch((err) => {
        throw new Error(err.message || 'Ошибка при регистрации');
    });

    return response.data;
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
    const response = await axios.post('/api/login', data).catch((err) => {
        throw new Error(err.message || 'Ошибка входа');
    });

    return response.data;
}
