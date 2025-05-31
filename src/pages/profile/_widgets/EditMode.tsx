import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { PatientProfile } from '@/types';
import { useUpdateProfile } from '@/services';
import { useSession } from 'next-auth/react';
import { useProfileStore } from '@/store';
import { UserIcon, CameraIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type EditModeProps = {
    profile: PatientProfile;
    setIsEditing: (isEditing: boolean) => void;
    isLoading: boolean;
};

interface EditableProfile {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export const EditMode = ({ profile, setIsEditing, isLoading }: EditModeProps) => {
    const { data: session } = useSession();
    const setProfile = useProfileStore((state) => state.setProfile);
    const { mutate: updateProfile } = useUpdateProfile(session?.user.id);

    const [form, setForm] = useState<EditableProfile>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (profile) {
            setForm({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                email: session?.user.email || '',
                phone: profile.phone || '',
                password: '',
                newPassword: '',
                confirmPassword: '',
            });
        }
    }, [profile, session?.user.email]);

    // Обработчик изменения любого поля формы
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Обработчик сабмита формы редактирования
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // Подготовим payload для API
        const payload = {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
        };
        // Если пользователь заполнил текущий пароль и новые пароли, добавим их
        if (form.password && form.newPassword && form.newPassword === form.confirmPassword) {
            payload.currentPassword = form.password;
            payload.newPassword = form.newPassword;
        }

        // Вызываем мутацию (внутри useUpdateProfile должен отправлять запрос к бэкенду)
        updateProfile(
            { userId: session?.user.id, data: payload },
            {
                onSuccess: (updated) => {
                    // После успешного апдейта обновляем стейт и выходим из режима редактирования
                    setProfile(updated);
                    setIsEditing(false);
                },
                onError: (err) => {
                    // Можно показывать в UI ошибку, например через локальный setError
                    console.error('Ошибка при сохранении профиля:', err);
                },
            }
        );
    };

    return (
        <div className="max-w-3xl mx-auto pt-8">
            <div
                className="flex items-center mb-6 cursor-pointer text-black dark:text-white hover:text-gray-500  dark:hover:text-gray-300"
                onClick={() => setIsEditing(false)}
            >
                <ArrowLeftIcon className="w-6 h-6 mr-2" />
                <h1 className="text-3xl font-bold">Настройки профиля</h1>
            </div>

            <form
                className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-6 space-y-8"
                onSubmit={handleSubmit}
            >
                <div className="flex items-start justify-between">
                    <div className="relative">
                        {/* Текущий аватар */}
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt="Аватар"
                                className="h-24 w-24 rounded-full border-4 border-gray-700 object-cover"
                            />
                        ) : (
                            <UserIcon className="h-24 w-24 text-gray-300 bg-gray-400 dark:text-gray-600 dark:bg-gray-700  rounded-full p-4" />
                        )}
                        {/* Иконка загрузки новой фотографии */}
                        <button
                            type="button"
                            className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 hover:bg-blue-700 transition"
                        >
                            <CameraIcon className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Блокы полей */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Имя */}
                    <div className="flex flex-col">
                        <label htmlFor="first_name" className="text-gray-400 text-sm mb-1">
                            Имя
                        </label>
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            value={form.first_name}
                            onChange={handleChange}
                            className="rounded-lg dark:bg-gray-700  border border-gray-400 dark:border-gray-600 px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Фамилия */}
                    <div className="flex flex-col">
                        <label htmlFor="last_name" className="text-gray-400 text-sm mb-1">
                            Фамилия
                        </label>
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            value={form.last_name}
                            onChange={handleChange}
                            className="rounded-lg dark:bg-gray-700  border border-gray-400 dark:border-gray-600 px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Email */}
                    <div className="flex flex-col md:col-span-2">
                        <label htmlFor="email" className="text-gray-400 text-sm mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="rounded-lg dark:bg-gray-700  border border-gray-400 dark:border-gray-600 px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Телефон */}
                    <div className="flex flex-col md:col-span-2">
                        <label htmlFor="phone" className="text-gray-400 text-sm mb-1">
                            Номер телефона
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+7 (___) ___-__-__"
                            className="rounded-lg dark:bg-gray-700  border border-gray-400 dark:border-gray-600 px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Смена пароля */}
                <div className="pt-4 border-t dark:border-gray-700 border-gray-400 space-y-4">
                    <h2 className="text-lg font-semibold dark:text-white text-gray-900">
                        Смена пароля
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Текущий пароль */}
                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-gray-400 text-sm mb-1">
                                Текущий пароль
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                className="rounded-lg dark:bg-gray-700  border border-gray-400 dark:border-gray-600 px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Новый пароль */}
                        <div className="flex flex-col">
                            <label htmlFor="newPassword" className="text-gray-400 text-sm mb-1">
                                Новый пароль
                            </label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={form.newPassword}
                                onChange={handleChange}
                                className="rounded-lg dark:bg-gray-700  border border-gray-400 dark:border-gray-600 px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Подтверждение нового пароля */}
                        <div className="flex flex-col md:col-span-2">
                            <label htmlFor="confirmPassword" className="text-gray-400 text-sm mb-1">
                                Повторите пароль
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="rounded-lg dark:bg-gray-700  border border-gray-400 dark:border-gray-600 px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Нижняя кнопка «Редактировать» */}
                <div className="pt-6">
                    <button
                        type="submit"
                        className={`w-full inline-flex justify-center ${'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-3 rounded-xl transition`}
                    >
                        Сохранить
                    </button>
                </div>
            </form>
        </div>
    );
};
