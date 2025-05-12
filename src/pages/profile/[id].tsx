import { useEffect } from 'react';
import { useProfile } from '@/services';
import { useRouter } from 'next/router';
import { useProfileStore } from '@/store';
import { UserIcon } from '@heroicons/react/24/outline';
// eslint-disable-next-line react-hooks/exhaustive-deps
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/store';

export default function ProfilePage() {
    const router = useRouter();
    const user = useAuth((state) => state.user);
    const { id } = router.query;

    const { data, isLoading } = useProfile(id as string);
    const setProfile = useProfileStore((s) => s.setProfile);

    useEffect(() => {
        setProfile(data);
    }, [data]);

    if (isLoading) return <div className="text-center mt-10">Загрузка...</div>;

    if (!data) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto mt-8">
                <h1 className="text-2xl font-semibold mb-6">Личный кабинет</h1>

                <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 space-y-2 w-full">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <UserIcon
                                    height={80}
                                    width={80}
                                    className="rounded-full bg-gray-400"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {user?.full_name || 'Имя не указано'}
                                    </h2>
                                    <p className="text-gray-600">{user?.email}</p>
                                    <p className="text-gray-600">
                                        {user?.phone || '+7 ___ ___ __ __'}
                                    </p>
                                </div>
                            </div>
                            <button className="text-blue-500 hover:underline text-sm">
                                Редактировать
                            </button>
                        </div>

                        <div className="bg-gray-100 rounded-xl p-4 mt-4">
                            <h3 className="font-semibold mb-2">Ближайшая запись</h3>
                            <p className="text-sm text-gray-700">Врач-терапевт</p>
                            <p className="text-sm text-gray-900 font-medium">
                                Добрынина Любава Алексеевна
                            </p>
                            <p className="text-sm text-gray-600">Подготовьтесь к сдаче анализов.</p>

                            <div className="flex justify-between items-center mt-3">
                                <span className="text-gray-500 text-sm">15 ноября 2024</span>
                                <span className="text-green-600 font-semibold text-lg">14:30</span>
                            </div>
                            <div className="text-right text-sm mt-1">
                                <button className="text-blue-500 hover:underline">
                                    Изменить время приёма
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <Link
  href="/appointment/new"
  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2 text-sm font-medium text-center"
>
  Записаться на приём
</Link>
                            <button className="border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl px-6 py-2 text-sm font-medium">
                                <Link
  href="/appointment/history">
                                Перейти к истории приёмов</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
