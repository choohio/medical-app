import React from 'react';

interface DateSelectorProps {
    dates?: string[];
    value: string | null;
    onSelect: (ts: string) => void;
}

const ruDateFormatter = new Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
});
const ruWeekdayFormatter = new Intl.DateTimeFormat('ru', {
    weekday: 'long',
});

export function DateSelector({ dates, value, onSelect }: DateSelectorProps) {
    if (!dates) {
        return null;
    }

    if (!dates.length) {
        return <p className="text-sm text-gray-500">У врача нет доступных дат</p>;
    }

    return (
        <>
            <h1 className="text-base mb-2 text-gray-600">Выберите дату</h1>
            <div className="flex flex-wrap gap-3">
                {dates.map((ts) => {
                    const isSelected = ts === value;
                    const dateStr = ruDateFormatter.format(new Date(ts));
                    const weekday = ruWeekdayFormatter.format(new Date(ts));

                    return (
                        <button
                            key={ts}
                            type="button"
                            onClick={() => onSelect(ts)}
                            className={`
              flex flex-col items-center justify-center
              w-[104px] h-[64px]
              rounded-lg
              transition
              cursor-pointer
              ${
                  isSelected
                      ? 'bg-blue-600 border border-blue-600 text-white'
                      : 'bg-white border border-gray-500 text-gray-900 hover:bg-gray-50'
              }
            `}
                        >
                            <span className="block text-base leading-tight">{dateStr}</span>
                            <span
                                className={`
              block text-sm leading-snug
              ${isSelected ? 'text-blue-200' : 'text-gray-500'}
            `}
                            >
                                {weekday}
                            </span>
                        </button>
                    );
                })}
            </div>
        </>
    );
}
