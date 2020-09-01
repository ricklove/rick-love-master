import './layout-game.css';
import React, { ReactNode } from 'react';

export const LayoutGame = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <div>
                {children}
            </div>
        </>
    );
};
