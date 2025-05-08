'use client';

import Link from 'next/link';
import { DateTime } from 'luxon';
import { useGetAppointment } from '@/services/appointments';
import { CalendarDateRangeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

export default function SuccessPage() {
    const router = useRouter();
    const { id } = router.query;
    const { data, isLoading } = useGetAppointment(id as string);

    if (isLoading || !data) {
        return <p>загрузка</p>;
    }

    const formattedDate = DateTime.fromISO(`${data.appointment_date}T${data.appointment_time}`)
        .setLocale('ru')
        .toFormat('d MMMM yyyy г.');
    const formattedTime = DateTime.fromISO(
        `${data.appointment_date}T${data.appointment_time}`
    ).toFormat('HH:mm');

    const address = 'ул. Примерная, д. 25, «Клиника № 1»';
    const addressUrl = 'https://maps.google.com/?q=ул.+Примерная,+д.+25';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-yellow-100 via-blue-100 to-green-100 p-4">
            <div className="bg-white rounded-xl shadow-md p-6 max-w-md text-center space-y-4">
                <h1 className="text-green-600 text-xl font-semibold">
                    Запись успешно подтверждена!
                </h1>

                <p className="text-gray-700">
                    Вы записаны на приём к {data.doctor.specialty.toLowerCase()}
                </p>

                <p className="font-medium">{data.doctor?.name}</p>

                <p>
                    Будем вас ждать <b>{formattedDate}</b> в <b>{formattedTime}</b>
                </p>

                <p className="text-sm text-gray-600">
                    По адресу{' '}
                    <a href={addressUrl} className="text-blue-600 hover:underline" target="_blank">
                        {address}
                    </a>
                </p>

                <div className="flex justify-center gap-4 pt-2">
                    <a
                        href={`https://outlook.live.com/calendar/0/deeplink/compose?subject=Визит%20к%20врачу&body=Запись%20на%20приём%20в%20${address}&startdt=${data.appointment_date}T${data.appointment_time}`}
                        target="_blank"
                        className="hover:opacity-80"
                    >
                        <CalendarDateRangeIcon className="h-6" />
                    </a>
                </div>

                <Link
                    href="/appointments-history"
                    className="text-blue-600 hover:underline text-sm block pt-2"
                >
                    Посмотреть историю приёмов
                </Link>
            </div>
        </div>
    );
}
