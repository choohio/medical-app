import React from 'react';
import clsx from 'clsx';

type SkeletonProps = {
    width?: number;
    height?: number;
    rounded?: string;
    className?: string;
};

export const Skeleton: React.FC<SkeletonProps> = ({
    width: propsWidth,
    height = 16,
    rounded = 'rounded-md',
    className = '',
}) => {
    const width = propsWidth ? `${propsWidth}px` : '100%';

    return (
        <div
            className={clsx('animate-pulse bg-gray-200 dark:bg-gray-700', rounded, className)}
            style={{ width, height: `${height}px` }}
        />
    );
};
