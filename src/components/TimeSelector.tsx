import React from 'react';
import { Timeslot } from '@/store/appointment';

interface TimeSelectorProps {
    times?: Timeslot[]; // таймстемпы в мс
    value: string | null; // текущий выбранный слот
    onSelect: (ts: string) => void; // коллбэк выбора
}

export function TimeSelector({ times, value, onSelect }: TimeSelectorProps) {
    if (!times) {
        return null;
    }

    if (!times.length) {
        return <p className="text-sm text-gray-500">У врача нет доступных таймслотов</p>;
    }

    return (
        <>
            <h1 className="text-base mb-2 text-gray-600">Выберите время</h1>
            <div className="flex flex-wrap gap-3">
                {times.map(({ time, is_booked }) => {
                    const isSelected = time === value;

                    return (
                        <button
                            key={time}
                            type="button"
                            onClick={() => onSelect(time)}
                            className={`
              h-[40px] px-4      
              rounded-lg
              transition
              ${is_booked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              ${
                  isSelected
                      ? 'bg-blue-600 border border-blue-600 text-white'
                      : 'bg-white border border-gray-500 text-gray-900 hover:bg-gray-50'
              }
            `}
                        >
                            <span className="text-base font-medium">{time}</span>
                        </button>
                    );
                })}
            </div>
        </>
    );
}
