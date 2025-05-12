import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type Visit = {
  id: number;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  symptoms?: string;
  diagnosis?: string;
  file?: string;
};

const visits: Visit[] = [
  {
    id: 1,
    date: '15 ноября 2024',
    time: '14:00',
    doctor: 'Добромир Ярополкович',
    specialty: 'кардиолог',
    symptoms: 'Боли в области груди, одышка при физической нагрузке.',
    diagnosis: 'Гипертензия II степени',
    file: 'Результаты ЭКГ.pdf',
  },
  {
    id: 2,
    date: '14 ноября 2024',
    time: '14:00',
    doctor: 'Златоглав Мирославич',
    specialty: 'травматолог',
  },
  {
    id: 3,
    date: '15 мая 2024',
    time: '11:00',
    doctor: 'Радослава Мстиславовна',
    specialty: 'терапевт',
    symptoms: 'Общая слабость, ощущение тяжести в голове, повышение температуры.',
    diagnosis: 'ОРВИ.',
    file: 'Результаты анализа крови.pdf',
  },
  {
    id: 4,
    date: '1 марта 2024',
    time: '10:00',
    doctor: 'Велеслав Борисович',
    specialty: 'кардиолог',
    symptoms: 'Острая боль в правом подреберье, приступы тошноты.',
    diagnosis: 'Острый холецистит.',
    file: 'УЗИ органов брюшной полости.jpg',
  },
];

export default function AppointmentHistoryPage() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggle = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-800 px-4 py-6 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/profile/1" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition">
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <h1 className="font-roboto font-bold text-[30px] leading-[36px] text-gray-800 dark:text-white">
            История приёмов
          </h1>
        </div>

        <div className="space-y-6">
          {visits.map((visit) => (
            <div
              key={visit.id}
              className="bg-gray-200 dark:bg-gray-900 rounded-2xl shadow px-6 py-6 transition-colors duration-300"
            >
              {/* Дата и время */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{visit.date}</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{visit.time}</span>
              </div>

              {/* Врач */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Доктор:</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {visit.doctor}, {visit.specialty}
                </p>
              </div>

              {/* Раскрывающаяся часть */}
              {expanded[visit.id] && (
                <div className="space-y-4 mt-3 text-sm text-gray-800 dark:text-gray-200">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">Описание результатов:</p>

                  {visit.symptoms && (
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Симптомы и жалобы</p>
                      <p>{visit.symptoms}</p>
                    </div>
                  )}

                  {visit.diagnosis && (
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Диагноз</p>
                      <p>{visit.diagnosis}</p>
                    </div>
                  )}

                  {visit.file && (
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Дополнительные документы:</p>
                      <a
                        href="#"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {visit.file}
                      </a>
                    </div>
                  )}

                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Результаты обследования
                  </p>
                </div>
              )}

              {/* Кнопка */}
              <div className="mt-4 text-right">
                <button
                  onClick={() => toggle(visit.id)}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {expanded[visit.id] ? 'Свернуть' : 'Показать полностью'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
