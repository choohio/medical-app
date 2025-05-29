import { Doctor } from '@/types';

interface DoctorSelectorProps {
    doctors: Doctor[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
    isLoading?: boolean;
}

export function DoctorSelector({
    doctors,
    isLoading,
    value,
    onChange,
    error,
}: DoctorSelectorProps) {
    if (isLoading) {
        <p>Загрузка</p>;
    }

    if (!doctors) {
        return null;
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Специальность и врач
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full border rounded-md p-2 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            >
                <option value="">Выберите врача</option>
                {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                        {`${doc.category} — ${doc.first_name} ${doc.last_name}`}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
