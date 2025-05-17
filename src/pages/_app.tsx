import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuth } from '@/store';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { Layout } from '@/components';
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
                <QueryClientProvider client={queryClient}>
                    <Toaster />
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </QueryClientProvider>
            </ThemeProvider>
        </SessionProvider>
        
    );
}
