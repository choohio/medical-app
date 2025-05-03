import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/store/auth';

interface NavItem {
  id: number
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 1, label: 'Главная', href: '/' },
  { id: 2, label: 'Новости', href: '/#news' },
  { id: 3, label: 'Контакты', href: '/#contacts' },
  { id: 4, label: 'FAQ', href: '/#faq' },
];

export default function Header() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const logout = useAuth((s) => s.logout);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push('/')
    logout();
  }

  return (
    <header className="w-full border-b bg-white/80 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
        <div className="flex-1">
          <Link href="/" className="flex items-center">
          <svg width="62" height="40" viewBox="0 0 62 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.48374 1.58984H9.94265L19.453 28.7732L28.9634 1.58984H35.4223L22.0467 38.6141H16.8593L3.48374 1.58984ZM0 1.58984H6.43348L7.6032 28.0866V38.6141H0V1.58984ZM32.4725 1.58984H38.9315V38.6141H31.3028V28.0866L32.4725 1.58984Z" fill="#1F2937"/>
            <path d="M51.8561 31.2018C51.8561 31.9986 51.9578 32.6089 52.1612 33.0327C52.3816 33.4565 52.7037 33.7531 53.1275 33.9227C53.5513 34.0752 54.0853 34.1515 54.7295 34.1515C55.1872 34.1515 55.5941 34.1346 55.9501 34.1007C56.3231 34.0498 56.6367 33.999 56.891 33.9481L56.9164 39.339C56.2892 39.5424 55.6111 39.7035 54.8821 39.8221C54.1531 39.9408 53.3479 40.0001 52.4664 40.0001C50.8559 40.0001 49.4488 39.7374 48.2452 39.2118C47.0585 38.6694 46.1431 37.8048 45.4989 36.6181C44.8547 35.4314 44.5326 33.8718 44.5326 31.9392V18.6515H51.8561V31.2018Z" fill="#1F2937"/>
            <path d="M61.3015 17.3505V10.3501H51.8565V0H44.5326V10.3501H34.8245V17.3505H44.5326V28.1984H51.8565V17.3505H61.3015Z" fill="#10B981"/>
            </svg>
          </Link>
        </div>
        <nav className="flex-1 flex justify-center">
          <ul className="flex items-center gap-6">
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
        <div className="flex-1 flex justify-end items-center gap-4">
        {user ? (
          <>
            <Link href="/profile">
              <span className="text-sm text-gray-600">{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="mr-4 cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </button>
          </>
        ) : (
          <>
            
          </>
        )}
      </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle high contrast"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
} 
