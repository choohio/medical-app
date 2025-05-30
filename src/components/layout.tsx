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
            <main className={cx(inter.className, 'h-screen bg-gray-100')}>{children}</main>
        </>
    );
}
