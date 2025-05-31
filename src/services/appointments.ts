import { useQuery } from '@tanstack/react-query';
import { Appointment, Doctor } from '@/types';
import axios from 'axios';

export type AppointmentData = {
    patient_id: string;
    doctor_id: string;
    appointment_time: string;
    appointment_date: string;
    appointment_type: string;
};

export const useDoctors = () =>
    useQuery({
        queryKey: ['doctors'],
        queryFn: async () => {
            const { data } = await axios.get('/api/doctors');
            return data;
        },
    });

export async function createAppointment(data: AppointmentData): Promise<Appointment> {
    const response = await axios.post('/api/appointment', data).catch((err) => {
        throw new Error(err.message || 'Ошибка при записи');
    });

    return response.data;
}

export interface GetAppointmentsResult extends Appointment {
    doctor: Doctor;
}

export const useGetAppointment = (appointmentId: string) =>
    useQuery<GetAppointmentsResult>({
        queryKey: ['useGetAppointment', appointmentId],
        enabled: !!appointmentId,
        queryFn: async () => {
            if (!appointmentId) return [];
            const { data } = await axios.get(`/api/appointment/${appointmentId}`);
            return data;
        },
    });

export const useGetAppointmentsByUserId = (userId?: string) =>
    useQuery<GetAppointmentsResult[]>({
        queryKey: ['useGetAppointmentsByUser', userId],
        enabled: !!userId,
        queryFn: async () => {
            if (!userId) return [];
            const { data } = await axios.get(`/api/appointment/user/${userId}`);
            return data;
        },
    });
