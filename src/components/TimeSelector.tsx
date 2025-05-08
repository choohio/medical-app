interface TimeSelectorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    availableTimes: string[]; // "HH:mm" строки,
    isLoading?: boolean;
}

export const TimeSelector = ({
    value,
    onChange,
    error,
    availableTimes,
    isLoading = false,
}: TimeSelectorProps) => {
    if (isLoading) {
        <p>Загрузка</p>;
    }

    if (!availableTimes) {
        return null;
    }

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Выберите время</label>

            <div className="grid grid-cols-4 gap-2">
                {availableTimes.map((time) => (
                    <button
                        key={time}
                        type="button"
                        onClick={() => onChange(time)}
                        className={`rounded-md border px-2 py-1 text-sm shadow-sm ${
                            value === time
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-900 border-gray-300 hover:border-blue-400'
                        }`}
                    >
                        {time}
                    </button>
                ))}
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};
