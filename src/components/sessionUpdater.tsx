import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '../store/index';

export const SessionUpdater = () => {
  const { data: session } = useSession();
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  useEffect(() => {
    if (session?.user) {
      setUser({ name: session.user.name ?? undefined, email: session.user.email ?? undefined });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [session]);

  return null;
};
