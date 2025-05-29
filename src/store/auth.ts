import { create } from 'zustand';
import { Profile } from '@/types';

interface AuthState {
    user: null | { name?: string; email?: string };
    profile: null | Profile;
    isAuthenticated: boolean;
    userIsLoading: boolean;
    setUser: (user: AuthState['user']) => void;
    setIsAuthenticated: (isAuth: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    isAuthenticated: false,
    userIsLoading: true,
    setUser: (user) => set({ user }),
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setIsLoading: (isLoading) => set({ userIsLoading: isLoading }),
    checkAuth: async () => {
        set({ userIsLoading: true });
        try {
            // 1. Проверяем сессию через NextAuth
            const sessionRes = await fetch('/api/auth/session');
            const session = await sessionRes.json();

            if (session?.user) {
                set({ user: session.user, isAuthenticated: true });

                // 2. Загружаем профиль из таблицы `profile`
                const profileRes = await fetch(`/api/profile/${session.user.id}`);
                const profile = await profileRes.json();

                if (profile) {
                    set({ profile });
                } else {
                    set({ profile: null }); // Профиль не найден
                }
            } else {
                set({ user: null, profile: null, isAuthenticated: false });
            }
        } catch (error) {
            set({ user: null, profile: null, isAuthenticated: false });
        } finally {
            set({ userIsLoading: false });
        }
    },
}));
