import React, { useEffect, useState } from 'react';
import { GameAction } from '../types';

export const CountDownTimer = (props: { time: number; color?: string; messageAfterTime?: string; onTimeElapsed: () => void }) => {
    const [time, setTime] = useState(10);
    useEffect(() => {
        const timeStart = Date.now();
        const id = setInterval(() => {
            const timeRemaining = ((props.time * 1000) - (Date.now() - timeStart)) / 1000;
            setTime(timeRemaining);
            if (timeRemaining <= 0) {
                setTime(0);
                clearInterval(id);
                props.onTimeElapsed();
            }
        }, 10);
        return () => clearInterval(id);
    }, []);

    const timeStr = new Date(time * 1000).toISOString().slice(14, 23);
    return (
        <>
            <div>
                <div style={{ display: `inline-block`, backgroundColor: `#555555`, borderRadius: 4, padding: 8 }}>
                    <div style={{ display: `inline-block`, backgroundColor: `#111111`, padding: 4 }}>
                        <span style={{ color: props.color ?? `#FF0000` }}>{time > 0 ? timeStr : props.messageAfterTime ?? timeStr}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export const triggerTimedMessage = async (
    onMessage: (message: GameAction) => void,
    immediateResult: GameAction,
    time: number, color: 'danger' | 'warning' | 'normal',
    getResultAfterTime: () => Promise<GameAction>,
): Promise<GameAction> => {

    const colorActual = color === `danger` ? `#FF0000`
        : (color === `warning` ? `#FFFF00`
            : `#7777FF`);

    return await new Promise(resolve => {
        const onTimeElapsed = async () => {
            resolve({ output: ``, ...await getResultAfterTime(), addDivider: true });
        };
        const Component = () => (
            <CountDownTimer time={time} color={colorActual} onTimeElapsed={onTimeElapsed} />
        );
        onMessage({
            output: ``,
            ...immediateResult,
            Component,
        });
    });
};
