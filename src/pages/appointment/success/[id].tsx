'use client';

import Link from 'next/link';
import { useGetAppointment } from '@/services';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components';

const ruDateFormatter = new Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
});

export default function SuccessPage() {
    const router = useRouter();
    const { id } = router.query;
    const { data, isLoading } = useGetAppointment(id as string);
    const { data: session } = useSession();

    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-yellow-100 via-blue-100 to-green-100">
                <div className="bg-white rounded-xl shadow-md max-w-md text-center space-y-4">
                    <Skeleton width={448} height={300} />
                </div>
            </div>
        );
    }

    const formattedDate = ruDateFormatter.format(new Date(data.appointment_date));

    const addressUrl = `https://maps.google.com/?q=${data.doctor.address}`;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-yellow-100 via-blue-100 to-green-100 p-4">
            <div className="bg-white rounded-xl shadow-md p-6 max-w-md text-center space-y-4">
                <h1 className="text-green-600 text-xl font-semibold">
                    Запись успешно подтверждена!
                </h1>

                <p className="text-gray-700">Вы записаны на приём к:</p>

                <p className="font-medium">{`${data.doctor.category} ${data.doctor.first_name} ${data.doctor.last_name}`}</p>

                <p>
                    Будем вас ждать <b>{formattedDate}</b> в <b>{data.appointment_time}</b>
                </p>

                <p className="text-sm text-gray-600">
                    {data.appointment_type === 'online' ? (
                        'Вид приёма: онлайн'
                    ) : (
                        <>
                            По адресу:
                            <a
                                href={addressUrl}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                            >
                                {data.doctor.address}
                            </a>
                        </>
                    )}
                </p>

                <Link
                    href={`/history/${session?.user.id}`}
                    className="text-blue-600 hover:underline text-sm block pt-2"
                >
                    Посмотреть историю приёмов
                </Link>
            </div>
        </div>
    );
}
