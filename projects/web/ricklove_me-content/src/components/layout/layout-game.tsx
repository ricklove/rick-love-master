import React, { ReactNode, useEffect } from 'react';

export const LayoutGame = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(async () => {
            // eslint-disable-next-line unused-imports/no-unused-vars
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
