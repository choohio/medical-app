import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuth } from "@/store/auth";

function AuthInitializer() {
  const setUser = useAuth((s) => s.setUser);
  const logout = useAuth((s) => s.logout);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
    fetchUser();
  }, [logout, setUser]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
