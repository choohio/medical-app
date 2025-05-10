import { create } from 'zustand';
import { Profile } from '@/types';

interface ProfileState {
    profile: Profile | null;
    setProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
}));
