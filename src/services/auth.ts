import { User, RegisterData, LoginData } from '@/types';
import axios from 'axios';

type LoginResponse = {
    message: string;
    user: User;
};

export async function registerUser(data: RegisterData) {
    try {
        const response = await axios.post('/api/signup', data);
        return response.data;
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.data?.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error(err.message || 'Ошибка при регистрации');
    }
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
    const response = await axios.post('/api/login', data).catch((err) => {
        throw new Error(err.message || 'Ошибка входа');
    });

    return response.data;
}
