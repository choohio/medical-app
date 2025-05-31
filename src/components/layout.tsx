import { ReactNode } from 'react';
import { Header } from './header';
import { Inter } from 'next/font/google';
import { cx } from '@/utils/cx';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <main
                className={cx(
                    inter.className,
                    'h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
                )}
            >
                {children}
            </main>
        </>
    );
}
