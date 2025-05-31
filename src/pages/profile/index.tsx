import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { useProfile, useGetAppointmentsByUserId } from '@/services';
import { ViewMode } from './_widgets/ViewMode';
import { EditMode } from './_widgets/EditMode';
import { useProfileStore } from '@/store';

export default function ProfilePage() {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const [isEditing, setIsEditing] = useState(false);
    const { data: profile, isLoading } = useProfile(String(userId));
    const { data: appointments, isLoading: isLoadingAppointments } =
        useGetAppointmentsByUserId(userId);

    const setProfile = useProfileStore((state) => state.setProfile);

    useEffect(() => {
        if (profile) {
            setProfile(profile);
        }
    }, [profile, setProfile]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <p className="text-gray-400">Загрузка...</p>
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    return isEditing ? (
        <EditMode
            profile={profile}
            setIsEditing={setIsEditing}
            isLoading={isLoadingAppointments || isLoading}
        />
    ) : (
        <ViewMode
            profile={profile}
            appointments={appointments}
            setIsEditing={setIsEditing}
            isLoading={isLoadingAppointments || isLoading}
        />
    );
}
