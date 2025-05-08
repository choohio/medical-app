import { useQuery } from '@tanstack/react-query';
import { Appointment } from '@/types/appointment';
import axios from 'axios';

export type AppointmentData = {
    patient_id: number;
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

export const useGetAppointment = (appointmentId: string) =>
    useQuery({
        queryKey: ['useGetAppointment', appointmentId],
        enabled: !!appointmentId,
        queryFn: async () => {
            if (!appointmentId) return [];
            const { data } = await axios.get(`/api/appointment/${appointmentId}`);
            return data;
        },
    });

/**
 * Fetches a list of available dates for a given doctor.
 *
 * @param doctorId The doctor to fetch available dates for.
 * @returns A list of available dates.
 *
 * @remarks
 * The hook is enabled only if `doctorId` is not null.
 */
export const useAvailableDates = (doctorId: string | null) =>
    useQuery({
        queryKey: ['availableDates', doctorId],
        enabled: !!doctorId,
        queryFn: async () => {
            if (!doctorId) return [];
            const { data } = await axios.get(`/api/doctors/${doctorId}/available-dates`);
            return data;
        },
    });

export const useAvailableTimes = (doctorId: string | null, date: string | null) =>
    useQuery({
        queryKey: ['availableTimes', doctorId, date],
        queryFn: async () => {
            if (!doctorId || !date) return [];
            const { data } = await axios.get(`/api/doctors/${doctorId}/available-times`, {
                params: { date },
            });
            return data;
        },
        enabled: !!doctorId && !!date,
    });
