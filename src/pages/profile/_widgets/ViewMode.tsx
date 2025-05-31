import Link from 'next/link';
import { UserIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { PatientProfile } from '@/types';
import { GetAppointmentsResult } from '@/services/appointments';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components';

type ViewModeProps = {
    profile: PatientProfile;
    appointments?: GetAppointmentsResult[];
    setIsEditing: (isEditing: boolean) => void;
    isLoading: boolean;
};

export const ViewMode = ({ profile, appointments, setIsEditing, isLoading }: ViewModeProps) => {
    const { data: session } = useSession();

    const name = profile.first_name
        ? `${profile.first_name} ${profile.last_name}`
        : 'Имя не указано';

    // Предполагаем, что appointments отсортирован по дате
    const nextAppointment =
        Array.isArray(appointments) && appointments.length > 0 ? appointments[0] : null;

    const formatFullDate = (dateValue: string | Date) => {
        // Если у нас строка, конвертируем её в Date
        const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;

        // Приводим к «21 января 1970»
        return new Intl.DateTimeFormat('ru', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    // Функция форматирования времени (чч:мм)
    const formatTime = (timeValue: string | Date) => {
        const date = typeof timeValue === 'string' ? new Date(timeValue) : timeValue;

        return new Intl.DateTimeFormat('ru', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC', // если вы хотите вывести «03:28» ровно по переданному ISO без смещения локального TZ
        }).format(date);
        // Примечание: если вы хотите, чтобы время отображалось в локальном часовом поясе,
        // уберите параметр timeZone: 'UTC'
    };

    return (
        <div className="max-w-3xl mx-auto pt-8">
            {/* Заголовок страницы */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Личный кабинет
            </h1>

            {/* Основная карточка */}
            <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-6 space-y-8">
                {/* Блок с информацией о пользователе */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Аватар */}
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt="Аватар"
                                className="h-20 w-20 rounded-full border-2 border-gray-700 object-cover"
                            />
                        ) : (
                            <UserIcon className="h-20 w-20 text-gray-300 bg-gray-400 dark:text-gray-600 dark:bg-gray-700 rounded-full p-4" />
                        )}
                        {/* Имя, email, телефон */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {name}
                            </h2>
                            <p className="mt-1 text-gray-500 dark:text-gray-300">
                                {session?.user.email}
                            </p>
                            <p className="mt-1 text-gray-500 dark:text-gray-300">
                                {profile.phone || '+7 ___ ___ __ __'}
                            </p>
                        </div>
                    </div>
                    {/* Кнопка редактирования профиля */}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-500 dark:hover:text-white hover:text-gray-900 self-start"
                    >
                        <PencilSquareIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Блок "Ближайшая запись" */}
                {isLoading ? (
                    <Skeleton height={180} />
                ) : nextAppointment ? (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex">
                        <div className="space-y-2 flex flex-col justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Ближайшая запись
                            </h3>
                            <p className="text-gray-500 dark:text-gray-300 text-sm">
                                Врач-терапевт
                            </p>
                            <p className="text-gray-900 dark:text-white font-medium">
                                {nextAppointment.doctor.first_name}{' '}
                                {nextAppointment.doctor.last_name}
                            </p>
                            <p className="mt-3 text-gray-500 dark:text-gray-300 text-sm">
                                Комментарии врача:
                            </p>
                            <p className="text-gray-900 dark:text-white">
                                {nextAppointment.comment || 'Комментариев нет.'}
                            </p>
                        </div>
                        <div className="flex flex-col justify-between grow-1 items-end">
                            {/* Левая часть: инфо о враче и комментарии */}
                            <div className="text-right">
                                {/* Здесь используем formatFullDate для даты из ISO-строки */}
                                <p className="text-gray-900 dark:text-white text-m">
                                    {formatFullDate(nextAppointment.appointment_date)}
                                </p>
                                {/* А здесь – formatTime для времени из ISO-строки */}
                                <p className="mt-1 text-green-400 text-3xl font-bold">
                                    {formatTime(nextAppointment.appointment_time)}
                                </p>
                            </div>
                            {/* Ссылка изменить время приёма */}
                            <div className="mt-4 text-right">
                                <Link
                                    href={`/appointment/edit/${nextAppointment.id}`}
                                    className="text-blue-400 dark:hover:text-white hover:text-gray-900 text-sm"
                                >
                                    Изменить время приёма
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-700 rounded-xl p-6 text-center">
                        <p className="text-gray-400 mb-4">У вас пока нет предстоящих записей</p>
                        <Link
                            href="/appointment"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition"
                        >
                            Записаться на приём
                        </Link>
                    </div>
                )}

                {/* Ссылка на уведомления */}
                {nextAppointment && (
                    <Link
                        href="/notifications"
                        className="text-blue-400 dark:hover:text-white hover:text-gray-900 text-sm"
                    >
                        Перейти к уведомлениям
                    </Link>
                )}

                {/* Нижний блок кнопок */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Link
                        href="/appointment"
                        className="flex-1 inline-flex justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
                    >
                        Записаться на приём
                    </Link>
                    <Link
                        href="/appointment/history"
                        className="flex-1 inline-flex justify-center border border-gray-600 hover:bg-gray-700 hover:text-white text-gray-900 dark:text-white px-6 py-3 rounded-xl transition"
                    >
                        Перейти к истории приёмов
                    </Link>
                </div>
            </div>
        </div>
    );
};
