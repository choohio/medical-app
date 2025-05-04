import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, Input } from "@headlessui/react";
import { registerUser } from "../services/auth";
import { useRouter } from "next/router";
import Header from "@/components/header";
import toast from 'react-hot-toast';

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Введите имя" })
      .max(20, "Имя слишком длинное"),
    surname: z
      .string()
      .min(1, { message: "Введите фамилию" })
      .max(20, "Фамилия слишком длинная"),
    password: z
      .string()
      .min(1, { message: "Придумайте пароль" })
      .min(6, "Пароль слишком короткий"),
    confirmPassword: z.string().min(6, "Повторите пароль"),
    role: z.enum(["doctor", "patient"], { message: "Выберите роль" }),
    email: z
      .string()
      .min(1, { message: "Введите email" })
      .email("Некорректный email"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Введенные пароли не совпадают",
  });

type RegisterSchema = z.infer<typeof registerSchema>;

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ErrorWithMessage).message === "string"
  );
}

export default function Register() {
  const router = useRouter();

  const registerUserMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Пользователь зарегистрирован")
      router.push('/login')
    },
    onError: (error: unknown) => {
      if (isErrorWithMessage(error)) {
        const message = error.message;
        if (message === "Email уже зарегистрирован") {
          setError("email", { type: "server", message });
        } else {
          setError("root", { type: "server", message });
        }
      } else {
        setError("root", { type: "server", message: "Неизвестная ошибка" });
      }
    }
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "patient",
    },
  });

  const handleRegistrationSubmit = async (data: RegisterSchema) => {
    registerUserMutation.mutate(data);
    reset();
  };

  return (
    <div className="w-full">
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
          <h1 className="mb-6 text-center text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Регистрация</h1>
          <form onSubmit={handleSubmit(handleRegistrationSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Имя
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ярополк"
                  className="mt-1 w-full border dark:border-gray-700 rounded-md px-3 py-2 text-gray-800 dark:text-gray-100 dark:bg-gray-800"
                  {...register("name")}
                />
                {errors.name && (
                  <span role="alert" className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </Field>
              <Field>
                <label
                  htmlFor="surname"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Фамилия
                </label>
                <Input
                  id="surname"
                  type="text"
                  placeholder="Иванов"
                  className="mt-1 w-full border dark:border-gray-700 rounded-md px-3 py-2 text-gray-800 dark:text-gray-100 dark:bg-gray-800"
                  {...register("surname")}
                />
                {errors.surname && (
                  <span role="alert" className="text-red-500 text-sm">
                    {errors.surname.message}
                  </span>
                )}
              </Field>
            </div>
            <div className="my-4">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ваша роль
              </span>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="role-patient"
                    value="patient"
                    className="accent-blue-500 dark:accent-blue-400"
                    {...register("role")}
                  />
                  <label
                    htmlFor="role-patient"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Пациент
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="role-doctor"
                    value="doctor"
                    className="accent-blue-500 dark:accent-blue-400"
                    {...register("role")}
                  />
                  <label
                    htmlFor="role-doctor"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Врач
                  </label>
                </div>
              </div>
              {errors.role && (
                <p role="alert" className="text-red-500 text-sm">
                  {errors.role.message}
                </p>
              )}
            </div>
            <Field className="py-2">
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email адрес
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ivanov@yandex.ru"
                className="mt-1 w-full border dark:border-gray-700 rounded-md px-3 py-2 text-gray-800 dark:text-gray-100 dark:bg-gray-800"
                {...register("email")}
              />
              {errors.email && (
                <span role="alert" className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <Field>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Придумайте пароль
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  className="mt-1 w-full border dark:border-gray-700 rounded-md px-3 py-2 text-gray-800 dark:text-gray-100 dark:bg-gray-800"
                  {...register("password")}
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
                  id="confirmPassword"
                  type="password"
                  placeholder="******"
                  className="mt-1 w-full border dark:border-gray-700 rounded-md px-3 py-2 text-gray-800 dark:text-gray-100 dark:bg-gray-800"
                  {...register("confirmPassword")}
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
              disabled={registerUserMutation.isPending}
              className="mt-8 w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition"
            >
              Зарегистрироваться
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
