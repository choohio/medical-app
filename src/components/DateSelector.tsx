import { formatDate } from '@/utils/formatDate';

interface DateSelectorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    availableDates: string[];
    isLoading?: boolean;
}

export const DateSelector = ({
    value,
    onChange,
    error,
    availableDates,
    isLoading = false,
}: DateSelectorProps) => {
    if (isLoading) {
        <p>Загрузка</p>;
    }

    if (!availableDates) {
        return null;
    }

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Выберите дату</label>

            <div className="grid grid-cols-3 gap-2">
                {availableDates.map((date) => (
                    <button
                        key={date}
                        type="button"
                        onClick={() => onChange(date)}
                        className={`rounded-md border px-2 py-1 text-sm shadow-sm ${
                            value === date
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-900 border-gray-300 hover:border-blue-400'
                        }`}
                    >
                        {formatDate(date)}
                    </button>
                ))}
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};
