import { useProfile, useUpdateProfile } from '@/services';
import { useState, useEffect } from 'react';
import {
    UserIcon,
    PhoneIcon,
    CalendarIcon,
    HomeIcon,
    IdentificationIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export default function EditProfilePage() {
    const router = useRouter();
    const { id } = router.query;

    const { data } = useProfile(id as string);
    const updateProfile = useUpdateProfile(id as string);

    const [form, setForm] = useState({
        full_name: '',
        gender: '',
        birth_date: '',
        phone: '',
        address: '',
        snils: '',
    });

    useEffect(() => {
        if (data) {
            setForm(data);
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProfile.mutateAsync(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 space-y-6"
        >
            <div className="flex items-center space-x-4 mb-6">
                <UserIcon className="h-10 w-10 text-blue-500" />
                <h1 className="text-2xl font-semibold">Редактировать профиль</h1>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ФИО</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="text"
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Введите ФИО"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Пол</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="text"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Введите пол"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IdentificationIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Дата рождения</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="date"
                            name="birth_date"
                            value={form.birth_date}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Введите дату рождения"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Телефон</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Введите номер телефона"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Адрес</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Введите адрес"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HomeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">СНИЛС</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="text"
                            name="snils"
                            value={form.snils}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Введите СНИЛС"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IdentificationIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 text-right">
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Сохранить
                </button>
            </div>
        </form>
    );
}
