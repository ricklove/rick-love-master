import './console-simulator.css';
import React from 'react';

export const ConsoleSimulatorPlaceholder = ({ initialPrompt, onClick }: { initialPrompt: string; onClick: () => void }) => {
    return (
        <div className='console-simulator' style={{ display: `inline-block` }} onClick={onClick}>
            <div style={{ display: `inline-block` }}>
                <span>{initialPrompt} </span>
                <span className='console-simulator-cursor' style={{ backgroundColor: `#000000` }}>&nbsp;</span>
                <div style={{ display: `inline-block`, width: 100 }} />
            </div>
        </div>
    );
};
