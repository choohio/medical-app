'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useProfile } from '@/services';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import {
    Bars3Icon,
    XMarkIcon,
    UserIcon,
    BellIcon,
    HomeIcon,
    InformationCircleIcon,
    PhoneIcon,
    EyeIcon,
    EyeSlashIcon,
    SunIcon,
    MoonIcon,
} from '@heroicons/react/24/outline';
import { useSession, signOut } from 'next-auth/react';
import { useAuthStore } from '@/store';

const navItems = [
    { id: 1, label: 'Главная', href: '/' },
    { id: 2, label: 'Новости', href: '/#news' },
    { id: 3, label: 'Контакты', href: '/#contacts' },
    { id: 4, label: 'FAQ', href: '/#faq' },
];

export function Header() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [zoomEnabled, setZoomEnabled] = useState(false);
    const [mounted, setMounted] = useState(false);

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    };

    const toggleZoom = () => {
        setZoomEnabled((prev) => {
            const newZoom = !prev;
            document.body.style.zoom = newZoom ? '150%' : '100%';
            return newZoom;
        });
    };

    const { data: session } = useSession();
    const userId = session?.user?.id;
    const { user, isAuthenticated, userIsLoading } = useAuthStore();

    const { data: profile, isLoading } = useProfile(String(userId));

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            setZoomEnabled(document.body.style.zoom === '150%');
        }
    }, []);

    const router = useRouter();

    const handleLogout = async () => {
        signOut({ callbackUrl: '/' });
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setIsAuthenticated(false);
    };

    return (
        <header className="w-full border-b bg-white/80 dark:bg-gray-900/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
                {/* Бургер меню */}
                <div className="md:hidden mr-2">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="rounded p-2 text-gray-600 dark:text-gray-300"
                        aria-label="Открыть меню"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>

                {/* Логотип */}
                <div className="flex-1">
                    <Link href="/" className="flex items-center">
                        <svg
                            width="62"
                            height="40"
                            viewBox="0 0 62 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                className="dark:text-white fill-current"
                                d="M3.48374 1.58984H9.94265L19.453 28.7732L28.9634 1.58984H35.4223L22.0467 38.6141H16.8593L3.48374 1.58984ZM0 1.58984H6.43348L7.6032 28.0866V38.6141H0V1.58984ZM32.4725 1.58984H38.9315V38.6141H31.3028V28.0866L32.4725 1.58984Z"
                            />
                            <path
                                className="dark:text-white fill-current"
                                d="M51.8561 31.2018C51.8561 31.9986 51.9578 32.6089 52.1612 33.0327C52.3816 33.4565 52.7037 33.7531 53.1275 33.9227C53.5513 34.0752 54.0853 34.1515 54.7295 34.1515C55.1872 34.1515 55.5941 34.1346 55.9501 34.1007C56.3231 34.0498 56.6367 33.999 56.891 33.9481L56.9164 39.339C56.2892 39.5424 55.6111 39.7035 54.8821 39.8221C54.1531 39.9408 53.3479 40.0001 52.4664 40.0001C50.8559 40.0001 49.4488 39.7374 48.2452 39.2118C47.0585 38.6694 46.1431 37.8048 45.4989 36.6181C44.8547 35.4314 44.5326 33.8718 44.5326 31.9392V18.6515H51.8561V31.2018Z"
                            />
                            <path
                                d="M61.3015 17.3505V10.3501H51.8565V0H44.5326V10.3501H34.8245V17.3505H44.5326V28.1984H51.8565V17.3505H61.3015Z"
                                fill="#10B981"
                            />
                        </svg>
                    </Link>
                </div>

                {/* Навигация */}
                <nav className="flex-1 flex justify-center">
                    <ul className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className={`text-sm transition-colors hover:text-blue-500 ${
                                        router.pathname === item.href
                                            ? 'font-medium text-blue-500'
                                            : 'text-gray-600 dark:text-gray-300'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Пользователь */}
                <div className="flex-1 flex justify-end items-center gap-4">
                    {session?.user && (
                        <>
                            <Link href="/profile">
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {profile?.first_name} {profile?.last_name}
                                </span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="mr-4 cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                                    />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Переключатели */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        aria-label="Toggle theme"
                    >
                        {mounted &&
                            (resolvedTheme === 'dark' ? (
                                <SunIcon key="sun" className="h-5 w-5" />
                            ) : (
                                <MoonIcon key="moon" className="h-5 w-5" />
                            ))}
                    </button>
                    <button
                        type="button"
                        onClick={toggleZoom}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        aria-label="Toggle accessibility"
                    >
                        {mounted &&
                            (zoomEnabled ? (
                                <EyeSlashIcon key="eye-off" className="h-5 w-5" />
                            ) : (
                                <EyeIcon key="eye" className="h-5 w-5" />
                            ))}
                    </button>
                </div>
            </div>

            {/* Мобильное меню */}
            <Dialog
                as="div"
                className="md:hidden z-50 relative"
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
            >
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <Dialog.Panel className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 p-6 shadow-lg">
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            aria-label="Закрыть меню"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="space-y-4">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                            <HomeIcon className="h-5 w-5" /> Главная
                        </Link>
                        <Link
                            href="/#about"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                            <InformationCircleIcon className="h-5 w-5" /> О системе
                        </Link>
                        <Link
                            href="/#contacts"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                            <PhoneIcon className="h-5 w-5" /> Контакты
                        </Link>
                        <Link
                            href="/profile"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                            <UserIcon className="h-5 w-5" /> Профиль
                        </Link>
                        <Link
                            href="/notifications"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                            <BellIcon className="h-5 w-5" /> Уведомления
                        </Link>
                    </nav>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
}
