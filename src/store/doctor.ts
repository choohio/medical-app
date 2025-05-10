import { create } from 'zustand';
import { Doctor } from '@/types';

interface DoctorsStore {
    doctors: Doctor[];
    setDoctors: (doctors: Doctor[]) => void;
}

export const useDoctorsStore = create<DoctorsStore>((set) => ({
    doctors: [],
    setDoctors: (doctors) => set({ doctors }),
}));
