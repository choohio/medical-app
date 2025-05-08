'use client';
import { Doctor } from '@/types/doctor';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import DoctorSelector from '@/components/DoctorSelector';
import { DateSelector } from '@/components/DateSelector';
import { TimeSelector } from '@/components/TimeSelector';
import { useAppointmentStore } from '@/store/appointment';
import { useAvailableTimes, useAvailableDates, useDoctors } from '@/services/appointments';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/store/auth';
import { createAppointment, AppointmentData } from '@/services/appointments';
import { Appointment } from '@/types/appointment';
import { DefaultError } from '@tanstack/query-core';
import { isErrorWithMessage } from '@/utils/isErrorWithMessage';

const appointmentSchema = z.object({
    doctorId: z.string().min(1, 'Выберите врача'),
    date: z.string().min(1, 'Выберите дату'),
    time: z.string().min(1, 'Выберите время'),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const AppointmentPage: FC = () => {
    const router = useRouter();
    const { selectedDoctor, selectedDate, selectedTime, setTime, setDate, setDoctor, setError } =
        useAppointmentStore();

    const { data: doctors, isLoading: isLoadingDoctors } = useDoctors();

    const { data: availableTimes, isLoading: isLoadingTimes } = useAvailableTimes(
        selectedDoctor?.id || null,
        selectedDate
    );

    const { data: availableDates, isLoading: isLoadingDates } = useAvailableDates(
        selectedDoctor?.id || null
    );

    const user = useAuth((s) => s.user);

    const createAppointmentMutation = useMutation<Appointment, DefaultError, AppointmentData>({
        mutationFn: createAppointment,
        onSuccess: (data) => {
            router.push(`/appointment/success/${data.id}`);
        },
        onError: (error: unknown) => {
            if (isErrorWithMessage(error)) {
                setError(error.message);
            } else {
                setError('Ошибка при записи');
            }
        },
    });

    const onSubmit = async (data: AppointmentFormValues) => {
        if (!data?.doctorId || !data.date || !data.time || !user?.userId) return;

        await createAppointmentMutation.mutateAsync({
            doctor_id: data.doctorId,
            appointment_date: data.date,
            appointment_time: data.time,
            patient_id: user.userId,
            appointment_type: 'online',
        });
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            doctorId: '',
            date: '',
            time: '',
        },
    });

    return (
        <div className="max-w-xl mx-auto py-8">
            <button
                onClick={() => router.back()}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Назад
            </button>

            <h1 className="text-2xl font-semibold mb-6">Запись на приём</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Controller
                    name="doctorId"
                    control={control}
                    render={({ field }) => (
                        <DoctorSelector
                            doctors={doctors}
                            value={field.value}
                            onChange={(value) => {
                                field.onChange(value);
                                setDoctor(doctors.find((doc: Doctor) => doc.id === value));
                            }}
                            error={errors.doctorId?.message}
                            isLoading={isLoadingDoctors}
                        />
                    )}
                />

                <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                        <DateSelector
                            isLoading={isLoadingDates}
                            availableDates={availableDates?.dates}
                            value={field.value}
                            onChange={(value) => {
                                field.onChange(value);
                                setDate(value);
                            }}
                            error={errors.date?.message}
                        />
                    )}
                />

                <Controller
                    name="time"
                    control={control}
                    render={({ field }) => (
                        <TimeSelector
                            availableTimes={availableTimes?.times}
                            isLoading={isLoadingTimes}
                            value={field.value}
                            onChange={(value) => {
                                field.onChange(value);
                                setTime(value);
                            }}
                            error={errors.time?.message}
                        />
                    )}
                />

                <button
                    type="submit"
                    disabled={!selectedDoctor?.id || !selectedDate || !selectedTime}
                    className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Подтвердить запись
                </button>
            </form>
        </div>
    );
};

export default AppointmentPage;
