import { create } from 'zustand';
import { User } from '@/types';

type AuthStore = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
};

export const useAuth = create<AuthStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => {
        set({ user: null });
    },
}));
