import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { NextPage } from 'next';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const ForgotPassword: NextPage = () => {
    const router = useRouter();

    const resetSchema = z.object({
        email: z.string().min(1, { message: 'Введите email' }),
    });

    type resetSchema = z.infer<typeof resetSchema>;

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm<resetSchema>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            email: '',
        },
    });

    const resetPassword = async (email: resetSchema) => {
        const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(email),
        });

        const data = await res.json();
        return data;
    };

    const mutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success('Инструкция по восстановлению пароля отправлена на вашу почту');
            router.push('/');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Произошла ошибка');
        },
    });

    const onSubmit = (data: resetSchema) => {
        mutation.mutate(data)
    };

    return (
        <div>
            <main>
                <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-green-100 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 mt-10 mb-10">
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                            Сброс пароля
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
                            {errors.root && (
                                <span role="alert" className="text-red-500 text-sm">
                                    {errors.root.message}
                                </span>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                            >
                                Сбросить пароль
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;
