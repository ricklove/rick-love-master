import React, { ReactNode, useEffect } from 'react';

export const LayoutGame = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
        setTimeout(async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const importCss = (await import(`./layout-game-css`)).LayoutGameCss;
        });
    }, []);
    return (
        <>
            <div>
                {children}
            </div>
        </>
    );
};
