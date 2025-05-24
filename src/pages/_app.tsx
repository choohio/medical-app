import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { Layout } from '@/components';
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { SessionUpdater } from '@/components/sessionUpdater';
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth(); // Проверяем сессию при загрузке
    }, [checkAuth]);

    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider session={pageProps.session}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
                <QueryClientProvider client={queryClient}>
                    <Toaster />
                    <Layout>
                        <SessionUpdater />
                        <Component {...pageProps} />
                    </Layout>
                </QueryClientProvider>
            </ThemeProvider>
        </SessionProvider>
        
    );
}
