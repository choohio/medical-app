import { useEffect } from 'react';
import { useProfile, useGetAppointmentsByUserId } from '@/services';
import { useProfileStore } from '@/store';
import { UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { formatDate } from '@/utils/formatDate';
import { Skeleton } from '@/components';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
    const { data: session } = useSession();
    console.log(session);
    const userId = session?.user?.id;
    console.log(userId);
    const { data: profile, isLoading } = useProfile(String(userId));
    const { data: appointments, isLoading: isLoadingAppointments } = useGetAppointmentsByUserId(userId);

    const setProfile = useProfileStore((state) => state.setProfile);

    useEffect(() => {
        if (profile) {
            setProfile(profile);
        }
    }, [profile, setProfile]);

    if (isLoading) return <div className="text-center mt-10">Загрузка...</div>;

    if (!profile) {
        return null;
    }

    const name = profile?.first_name
        ? `${profile?.first_name} ${profile?.last_name}`
        : 'Имя не указано';

    return (
        <main className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto mt-8">
                <h1 className="text-2xl font-semibold mb-6 dark:text-white">Личный кабинет</h1>

                <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-center dark:bg-gray-800">
                    <div className="flex-1 space-y-2 w-full">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <UserIcon
                                    height={80}
                                    width={80}
                                    className="rounded-full bg-gray-400 dark:bg-gray-600"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold dark:text-white">
                                        {name}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {session?.user.email}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {profile?.phone || '+7 ___ ___ __ __'}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/profile/edit/${userId}`}
                                className="text-blue-500 hover:underline text-sm dark:text-blue-400"
                            >
                                Редактировать
                            </Link>
                        </div>

                        {isLoadingAppointments && <Skeleton height={188} />}

                        {appointments?.length && !isLoadingAppointments ? (
                            <div className="bg-gray-100 rounded-xl p-4 mt-4 dark:bg-gray-700">
                                <h3 className="font-semibold mb-2 dark:text-white">
                                    Ближайшая запись
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-gray-200">
                                    {appointments[0].doctor.specialty}
                                </p>
                                <p className="text-sm text-gray-900 font-medium dark:text-white">
                                    {`${appointments[0].doctor.first_name} ${appointments[0].doctor.last_name}`}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Место встречи:
                                    {appointments[0].appointment_type === 'online'
                                        ? 'Онлайн'
                                        : appointments[0].doctor.address}
                                </p>

                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-gray-500 text-sm dark:text-gray-400">
                                        {formatDate(appointments[0].appointment_date)}
                                    </span>
                                    <span className="text-green-600 font-semibold text-lg dark:text-green-400">
                                        {appointments[0].appointment_time}
                                    </span>
                                </div>
                                <div className="text-right text-sm mt-1">
                                    <button className="text-blue-500 hover:underline dark:text-blue-400">
                                        Изменить время приёма
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/appointment"
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2 text-sm font-medium text-center dark:bg-blue-700 dark:hover:bg-blue-800"
                            >
                                Записаться на приём
                            </Link>
                            <button className="border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl px-6 py-2 text-sm font-medium dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200">
                                <Link href="history">Перейти к истории приёмов</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
