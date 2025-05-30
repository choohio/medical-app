'use client';
import { Doctor, Appointment } from '@/types';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { DoctorSelector, DateSelector, TimeSelector, CategorySelector } from '@/components';
import { useAppointmentStore } from '@/store';
import { useDoctors, createAppointment, AppointmentData } from '@/services';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { DefaultError } from '@tanstack/query-core';
import { isErrorWithMessage } from '@/utils/isErrorWithMessage';
import { useSession } from 'next-auth/react';
import _ from 'lodash';

const appointmentSchema = z.object({
    doctorId: z.number().min(1, 'Выберите врача'),
    date: z.string().min(1, 'Выберите дату'),
    category: z.string().min(1, 'Выберите специальность врача'),
    time: z.string().min(1, 'Выберите время'),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const AppointmentPage: FC = () => {
    const router = useRouter();
    const {
        selectedDoctor,
        selectedDate,
        selectedTime,
        setTime,
        setDate,
        setDoctor,
        setCategory,
        selectedCategory,
        setError,
    } = useAppointmentStore();

    const { data: doctors, isLoading } = useDoctors();

    const { data: session } = useSession();
    const userId = session?.user?.id;

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
        if (!data?.doctorId || !data.date || !data.time || !userId) return;

        await createAppointmentMutation.mutateAsync({
            doctor_id: data.doctorId,
            appointment_date: data.date,
            appointment_time: data.time,
            patient_id: userId,
            appointment_type: 'online',
        });

        reset();
        setCategory('');
        setDoctor(null);
        setDate('');
        setTime('');
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            doctorId: 0,
            category: '',
            date: '',
            time: '',
        },
    });

    const categories = _.uniq(doctors?.map((doc: Doctor) => doc.category));
    const filteredDoctors: Doctor[] = doctors?.filter(
        (doc: Doctor) => doc.category === selectedCategory
    );

    return (
        <div className="max-w-xl mx-auto py-8">
            <button
                onClick={() => router.push('/profile')}
                className="flex items-center text-sm text-black hover:text-gray-500 mb-4 cursor-pointer"
            >
                <ArrowLeftIcon className="w-6 h-6 mr-2" />
                <h1 className="text-2xl font-semibold ">Запись на приём</h1>
            </button>

            <div className="bg-white p-8 rounded-xl shadow">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
                    <h1 className="text-base mb-2 text-gray-600">Выберите специальность и врача</h1>
                    <div className="flex gap-4">
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <CategorySelector
                                    categories={categories}
                                    value={field.value}
                                    onChange={(value) => {
                                        reset();
                                        field.onChange(value);
                                        setCategory(value);
                                    }}
                                    error={errors.doctorId?.message}
                                    isLoading={isLoading}
                                />
                            )}
                        />
                        <Controller
                            name="doctorId"
                            control={control}
                            render={({ field }) => (
                                <DoctorSelector
                                    doctors={filteredDoctors}
                                    value={field.value}
                                    onChange={(value) => {
                                        setValue('date', '');
                                        setValue('time', '');
                                        field.onChange(value);
                                        setDoctor(doctors.find((doc: Doctor) => doc.id === value));
                                    }}
                                    error={errors.doctorId?.message}
                                    isLoading={isLoading}
                                />
                            )}
                        />
                    </div>

                    {selectedDoctor && (
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <DateSelector
                                    dates={selectedDoctor?.timeslots.map(
                                        (timeslot) => timeslot.date
                                    )}
                                    value={field.value}
                                    onSelect={(value) => {
                                        field.onChange(value);
                                        setDate(value);
                                    }}
                                />
                            )}
                        />
                    )}

                    {selectedDate && (
                        <Controller
                            name="time"
                            control={control}
                            render={({ field }) => (
                                <TimeSelector
                                    times={
                                        selectedDoctor?.timeslots.find(
                                            (timeslot) => timeslot.date === selectedDate
                                        )?.timeslots
                                    }
                                    value={field.value}
                                    onSelect={(value) => {
                                        field.onChange(value);
                                        setTime(value);
                                    }}
                                />
                            )}
                        />
                    )}

                    <button
                        type="submit"
                        disabled={!selectedDoctor?.id || !selectedDate || !selectedTime}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 self-start"
                    >
                        Подтвердить запись
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentPage;
