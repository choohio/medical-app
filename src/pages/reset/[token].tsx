import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, Input } from '@headlessui/react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(1, { message: 'Придумайте пароль' })
            .min(6, 'Пароль слишком короткий'),
        confirmPassword: z.string().min(6, 'Повторите пароль')
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Введенные пароли не совпадают',
    });

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

async function resetPassword({ token, newPassword }: { token: string; newPassword: string }) {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password: newPassword }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Ошибка при сбросе пароля');
  }

  return res.json();
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Пароль успешно изменен!');
      router.push('/signin');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Произошла ошибка');
    },
  });

  useEffect(() => {
    reset(); 
  }, [token, reset]);

  const onSubmit = (data: ResetPasswordSchema) => {
    if (typeof token !== 'string') {
      toast.error('Неверный или отсутствующий токен сброса.');
      return;
    }
    mutation.mutate({ token, newPassword: data.password });
  };

    return (
        <div className="w-full">
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
                <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
                    <h1 className="mb-6 text-center text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        Изменение пароля
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <Field>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Придумайте пароль
                                </label>
                                <Input
                                    {...register('password')}
                                    id="password"
                                    type="password"
                                    placeholder="******"
                                    className="mt-1 w-full border dark:border-gray-700 rounded-md px-3 py-2 text-gray-800 dark:text-gray-100 dark:bg-gray-800"
                                />
                                {errors.password && (
                                    <span role="alert" className="text-red-500 text-sm">
                                        {errors.password.message}
                                    </span>
                                )}
                            </Field>
                            <Field>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Повторите пароль
                                </label>
                                <Input
                                    {...register('confirmPassword')}
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="******"
                                    className="mt-1 w-full border dark:border-gray-700 rounded-md px-3 py-2 text-gray-800 dark:text-gray-100 dark:bg-gray-800"
                                />
                                {errors.confirmPassword && (
                                    <span role="alert" className="text-red-500 text-sm">
                                        {errors.confirmPassword.message}
                                    </span>
                                )}
                            </Field>
                        </div>
                        {errors.root && (
                            <div className="text-red-500 text-sm">{errors.root.message}</div>
                        )}
                        <Button
                            type="submit"
                            disabled={mutation.isPending || typeof token !== 'string'}
                            className="mt-8 w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                        >
                            Изменить пароль
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}