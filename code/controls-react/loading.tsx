import React from 'react';

export const Loading = ({ loading }: { loading?: boolean }) => {
    if (!loading) { return <></>; }

    return (
        <>
            <LoaderSvg size={32} thickness={4} />
        </>
    );
};

const LoaderSvg = ({ size, thickness }: { size: number, thickness: number }) => {
    const circumference = 2 * Math.PI * size * 0.5;
    const dashLength = circumference * 0.7;
    return (
        <svg viewBox={`0 0 ${size} ${size}`} xmlns='http://www.w3.org/2000/svg'>
            <circle style={{ strokeDasharray: dashLength }} cx={size * 0.5} cy={size * 0.5} r={size * 0.5 - thickness} />
        </svg>
    );
};
