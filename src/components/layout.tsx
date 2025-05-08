import { ReactNode } from 'react';
import Header from './Header';
import { Inter } from 'next/font/google';

const inter = Inter({
    variable: '--font-inter',
});

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <main className={inter.className}>{children}</main>
        </>
    );
}
