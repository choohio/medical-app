import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../store/auth";
import { loginUser } from "../services/auth";
import Header from "@/components/header";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const setUser = useAuth((s) => s.setUser);

  const loginSchema = z.object({
    password: z.string().min(1, { message: "Введите пароль" }),
    email: z.string().min(1, { message: "Введите email" }),
  });

  type LoginSchema = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data.user);
      router.push("/profile");
    },
    onError: (err: Error) => {
      alert(err.message);
    },
  });

  const handleLoginSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data);
    reset();
  };

  return (
    <div>
      <Header />
      <main>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-yellow-100">
          <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Вход в аккаунт
            </h2>
            <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="ivanov@yandex.ru"
                  className="mt-1 w-full border rounded-md px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Пароль
                </label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="******"
                  className="mt-1 w-full border rounded-md px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right text-sm mt-1">
                  <a href="#" className="text-blue-600 hover:underline">
                    Забыли пароль?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Войти
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Войти с помощью</p>
              <button className="mt-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-4 py-2 rounded-full">
                <span className="text-lg">ВК</span>
              </button>
            </div>
            <div className="mt-6 text-center text-sm">
              <p>
                У вас ещё нет аккаунта?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
