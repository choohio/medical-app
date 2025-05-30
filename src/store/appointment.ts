import { create } from 'zustand';
import { Doctor } from '@/types';

export type Timeslot = { time: string; duration: number; is_booked: boolean };
type DoctorWithTimeslots = Doctor & { timeslots: { date: string; timeslots: Timeslot[] }[] };

interface Store {
    selectedDoctor: DoctorWithTimeslots | null;
    selectedDate: string | null;
    selectedTime: string | null;
    selectedCategory: string | null;
    error: string | null;
    setDoctor: (doctor: DoctorWithTimeslots | null) => void;
    setDate: (date: string | null) => void;
    setCategory: (category: string | null) => void;
    setTime: (time: string | null) => void;
    setError: (error: string) => void;
}

export const useAppointmentStore = create<Store>((set) => ({
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null,
    selectedCategory: null,
    error: null,
    setDoctor: (doctor) => set({ selectedDoctor: doctor, selectedDate: null, selectedTime: null }),
    setDate: (date) => set({ selectedDate: date, selectedTime: null }),
    setCategory: (category) =>
        set({
            selectedCategory: category,
            selectedDoctor: null,
            selectedDate: null,
            selectedTime: null,
        }),
    setTime: (time) => set({ selectedTime: time }),
    setError: (error) => set({ error: error }),
}));
