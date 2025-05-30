import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Skeleton } from './Skeleton';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface CategorySelectorProps {
    categories: string[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
    isLoading?: boolean;
}

export function CategorySelector({
    categories,
    isLoading,
    value,
    onChange,
    error,
}: CategorySelectorProps) {
    if (isLoading) {
        return <Skeleton height={42} />;
    }

    if (categories.length === 0) {
        return <p className="text-sm text-gray-500">Врачи не найдены</p>;
    }

    const selectedCategory = categories.find((c) => c === value);
    const displayValue = selectedCategory ? selectedCategory : 'Выберите специализацию';

    return (
        <div className="w-full">
            <Listbox value={value} onChange={onChange}>
                <div className="relative mt-1">
                    <Listbox.Button
                        className={[
                            'relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm',
                            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
                            error ? 'border-red-500' : 'border border-gray-300',
                        ].join(' ')}
                    >
                        <span className="block truncate">{displayValue}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>

                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options
                            className={[
                                'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg',
                                'ring-1 ring-black ring-opacity-5 focus:outline-none',
                            ].join(' ')}
                        >
                            {categories.map((category) => (
                                <Listbox.Option
                                    key={category}
                                    className={({ active }) =>
                                        [
                                            active ? 'bg-gray-100' : '',
                                            'relative cursor-pointer select-none py-2 pl-3 pr-9',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')
                                    }
                                    value={category}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={[
                                                    selected ? 'font-semibold' : 'font-normal',
                                                    'block truncate',
                                                ].join(' ')}
                                            >
                                                {category}
                                            </span>

                                            {selected && (
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                                                    <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
