import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Страницы не существует</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Похоже, опечатка в адресе</p>
      <Link href="/" className="mt-6 text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
        Вернуться на главную
      </Link>
    </div>
  );
}
