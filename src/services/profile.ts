import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PatientProfile } from '@/types';

export const useProfile = (userId: string) => {
    return useQuery<PatientProfile>({
        queryKey: ['profile', userId],
        enabled: !!userId,
        queryFn: async () => {
            const { data } = await axios.get(`/api/profile/${userId}`);
            return data;
        },
    });
};

export const useUpdateProfile = (userId?: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updated: Partial<PatientProfile>) =>
            axios.put(`/api/profile/${userId}`, updated),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', userId] }),
    });
};
