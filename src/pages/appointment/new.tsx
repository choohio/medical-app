import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const schema = z.object({
  specialty: z.string().nonempty('Выберите специальность'),
  doctor: z.string().nonempty('Выберите врача'),
  date: z.string().nonempty('Выберите дату'),
  time: z.string().nonempty('Выберите время'),
});

type AppointmentForm = z.infer<typeof schema>;

const specialties = ['Терапевт', 'Травматолог-ортопед', 'Кардиолог'];
const doctors: Record<string, string[]> = {
  'Травматолог-ортопед': ['Ярополк Иванов', 'Ольга Смирнова'],
  Терапевт: ['Добрынина Любава'],
  Кардиолог: ['Михаил Седов'],
};
const availableDates = ['2 декабря', '3 декабря'];
const availableSlots: Record<string, string[]> = {
  '2 декабря': ['08:00', '08:30', '09:00', '10:00', '15:00'],
  '3 декабря': ['09:00', '10:00', '11:00'],
};

export default function NewAppointmentPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AppointmentForm>({ resolver: zodResolver(schema) });

  const selectedSpecialty = watch('specialty');
  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const onSubmit = (data: AppointmentForm) => {
    console.log('Форма подтверждена:', data);
    // router.push('/appointment/confirm')
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-800 px-4 py-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/profile/1" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition">
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <h1 className="font-roboto font-bold text-[30px] leading-[36px] tracking-normal text-gray-800 dark:text-gray-50">
            Запись на приём
          </h1>
        </div>

        <div className="bg-gray-200 dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-md transition-colors duration-300">
          <h2 className="font-inter font-normal text-[16px] leading-[24px] tracking-normal text-gray-600 dark:text-gray-200 mb-4">
            Выберите специальность и врача
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

<div className="flex flex-col sm:flex-row gap-4">
  {/* Специальность */}
  <label className="w-full sm:w-1/2">
    <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Специальность*</span>
    <select
      {...register('specialty')}
      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">-- Выберите --</option>
      {specialties.map((spec) => (
        <option key={spec} value={spec}>
          {spec}
        </option>
      ))}
    </select>
    {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty.message}</p>}
  </label>

  {/* Врач */}
  <label className="w-full sm:w-1/2">
    <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Врач*</span>
    <select
      {...register('doctor')}
      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">-- Выберите --</option>
      {(doctors[selectedSpecialty] || []).map((doc: string) => (
        <option key={doc} value={doc}>
          {doc}
        </option>
      ))}
    </select>
    {errors.doctor && <p className="text-red-500 text-sm mt-1">{errors.doctor.message}</p>}
  </label>
</div>


            {/* Дата */}
            <div>
              <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Дата приёма*</span>
              <div className="flex flex-wrap gap-2">
                {availableDates.map((date) => (
                  <label
                    key={date}
                    className={`px-4 py-2 rounded-lg border text-sm cursor-pointer transition-all
                      ${
                        selectedDate === date
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <input type="radio" value={date} {...register('date')} className="hidden" />
                    {date}
                  </label>
                ))}
              </div>
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
            </div>

            {/* Время */}
            <div>
              <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Время приёма*</span>
              <div className="flex flex-wrap gap-2">
                {(availableSlots[selectedDate] || []).map((time: string) => (
                  <label
                    key={time}
                    className={`px-4 py-2 rounded-lg border text-sm cursor-pointer transition-all
                      ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <input type="radio" value={time} {...register('time')} className="hidden" />
                    {time}
                  </label>
                ))}
              </div>
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
            </div>

            {/* Кнопка */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition"
            >
              Подтвердить запись
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
