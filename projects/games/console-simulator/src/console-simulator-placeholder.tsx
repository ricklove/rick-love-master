import React from 'react';
import { ConsoleSimulatorCss } from './console-simulator-css';

export const ConsoleSimulatorPlaceholder = ({ initialPrompt, onClick }: { initialPrompt: string; onClick: () => void }) => {
    return (
        <>
            <ConsoleSimulatorCss/>
            <div className='console-simulator' style={{ display: `inline-block` }} onClick={onClick}>
                <div style={{ display: `inline-block` }}>
                    <span>{initialPrompt} </span>
                    <span className='console-simulator-cursor' style={{ backgroundColor: `#000000` }}>&nbsp;</span>
                    <div style={{ display: `inline-block`, width: 100 }} />
                </div>
            </div>
        </>
    );
};
