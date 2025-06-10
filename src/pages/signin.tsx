import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { NextPage } from 'next';
import { useState } from 'react';

const Login: NextPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const loginSchema = z.object({
        password: z.string().min(1, { message: 'Введите пароль' }),
        email: z.string().min(1, { message: 'Введите email' }),
    });

    type LoginSchema = z.infer<typeof loginSchema>;

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchema) => {
        setIsLoading(true);

        const result = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        if (result?.error) {
            // Устанавливаем ошибку для всей формы
            setError('root', {
                type: 'manual',
                message: getErrorMessage(result.error),
            });
            setIsLoading(false);
        } else {
            router.push('/profile');
        }
    };

    const getErrorMessage = (errorCode: string) => {
        const errorMessages: Record<string, string> = {
            EmailRequired: 'Email обязателен',
            UserNotFound: 'Пользователь не найден',
            InvalidPassword: 'Неверный пароль',
            CredentialsSignin: 'Ошибка авторизации',
        };

        return errorMessages[errorCode] || errorMessages.Default;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <svg
                    className="animate-spin h-10 w-10 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            </div>
        );
    }

    return (
        <div>
            <main>
                <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-green-100 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 mt-10 mb-10">
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                            Вход в аккаунт
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Email
                                </label>
                                <input
                                    {...register('email', { required: true })}
                                    id="email"
                                    type="email"
                                    placeholder="ivanov@yandex.ru"
                                    className="mt-1 w-full border dark:border-gray-700 rounded-md px-3 py-2 text-gray-800 dark:text-gray-100 dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                />
                                {errors.email && (
                                    <span role="alert" className="text-red-500 text-sm">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Пароль
                                </label>
                                <input
                                    {...register('password', { required: true })}
                                    id="password"
                                    type="password"
                                    placeholder="******"
                                    className="mt-1 w-full border dark:border-gray-700 rounded-md px-3 py-2 text-gray-800 dark:text-gray-100 dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                />
                                {errors.password && (
                                    <span role="alert" className="text-red-500 text-sm">
                                        {errors.password.message}
                                    </span>
                                )}
                                <div className="text-right text-sm mt-1">
                                    <Link
                                        href="/forgot-password"
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Забыли пароль?
                                    </Link>
                                </div>
                            </div>
                            {errors.root && (
                                <span role="alert" className="text-red-500 text-sm">
                                    {errors.root.message}
                                </span>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                            >
                                Войти
                            </button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Войти с помощью
                            </p>
                            <div className="flex justify-center space-x-4 mt-3">
                                <button
                                    onClick={() => signIn('yandex')}
                                    className="bg-black text-white flex items-center justify-center gap-2 p-3 rounded-lg"
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2.04 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10z"
                                            fill="#FC3F1D"
                                        />
                                        <path
                                            d="M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.616 2.1 1.881 2.959l1.045.704-3.003 4.487H7.49l2.695-4.014c-1.55-1.111-2.42-2.19-2.42-4.015 0-2.288 1.595-3.85 4.62-3.85h3.003v11.868H13.32V7.666z"
                                            fill="#fff"
                                        />
                                    </svg>{' '}
                                    Яндекс ID
                                </button>
                            </div>
                        </div>
                        <div className="mt-6 text-center text-sm">
                            <p>
                                У вас ещё нет аккаунта?{' '}
                                <Link
                                    href="/signup"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Зарегистрироваться
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
