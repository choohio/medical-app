import { create } from 'zustand';
import { Doctor } from '@/types/doctor';

interface Store {
    selectedDoctor: Doctor | null;
    selectedDate: string | null;
    selectedTime: string | null;
    error: string | null;
    setDoctor: (doctor: Doctor) => void;
    setDate: (date: string) => void;
    setTime: (time: string) => void;
    setError: (error: string) => void;
}

export const useAppointmentStore = create<Store>((set) => ({
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null,
    error: null,
    setDoctor: (doctor) => set({ selectedDoctor: doctor, selectedDate: null, selectedTime: null }),
    setDate: (date) => set({ selectedDate: date, selectedTime: null }),
    setTime: (time) => set({ selectedTime: time }),
    setError: (error) => set({ error: error }),
}));
