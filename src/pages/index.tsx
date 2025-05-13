import { NextPage } from 'next';
import { useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getNews } from '@/services';
import { NewsItem } from '@/types';
import { useNewsStore, useAuth } from '@/store';
import clsx from 'clsx';

const Home: NextPage = () => {
    const user = useAuth((state) => state.user);
    const { news, setNews } = useNewsStore();

    const { data, isLoading } = useQuery<NewsItem[], Error>({
        queryKey: ['news'],
        queryFn: () => getNews(),
    });

    useEffect(() => {
        if (data) {
            setNews(data);
        }
    }, [data]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <section className={clsx(user ? 'pt-10 pb-2' : 'pt-32 pb-20', 'px-4')}>
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Med<span className="text-blue-500">Connect</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
                        Медицинская помощь на расстоянии одного клика.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                        Простой и безопасный способ записи на прием, планирования визитов и
                        взаимодействия с медицинскими специалистами. Система гарантирует
                        конфиденциальность ваших данных и удобство использования.
                    </p>
                    {user ? (
                        <></>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="px-8 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Зарегистрироваться
                            </Link>
                            <Link
                                href="/login"
                                className="px-8 py-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Войти
                            </Link>
                        </div>
                    )}
                </div>
            </section>
            <section
                id="news"
                className="py-20 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg"
            >
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">Новости и обновления</h2>
                    {isLoading ? (
                        <div>Загрузка...</div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {news.map((item: NewsItem) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.date}
                                    </div>
                                    <h3 className="text-xl font-semibold mt-2 mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {item.description}
                                    </p>
                                    <Link
                                        href={`/news/${item.id}`}
                                        className="inline-block mt-4 text-blue-500 hover:text-blue-600"
                                    >
                                        Читать далее
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <section id="faq" className="py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Часто задаваемые вопросы (FAQ)
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-3">
                                Как зарегистрироваться в системе?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Для регистрации на платформе нужно указать ваше имя, электронную
                                почту и выбрать роль: пациент или врач. После этого вам будет
                                предложено создать пароль для доступа к личному кабинету.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-3">Как изменить мои данные?</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Вы можете изменить свои данные, зайдя в личный кабинет и перейдя в
                                раздел редактирования профиля. Все изменения сохраняются сразу после
                                подтверждения.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-3">
                                Как отменить или перенести приём?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Для отмены или переноса приёма зайдите в раздел «История приёмов»,
                                выберите нужный приём и воспользуйтесь функцией изменения или отмены
                                записи.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section
                id="contacts"
                className="py-20 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg"
            >
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">Контактная информация</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Наш адрес</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                                Москва, ул. Льва Толстого, д. 16
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                <strong>Телефон:</strong> +7 495 123-45-67
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                <strong>Email:</strong> info@medconnect.ru
                            </p>
                        </div>
                        <div className="h-64 md:h-auto">
                            <div className="w-full h-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"><iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A62b667767d2c095afa43ae9ba0af648239d91c6b61100101e30a040ac4360d4e&amp;source=constructor" width="100%" height="240"></iframe></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
