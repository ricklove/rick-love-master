import { css, Global } from '@emotion/react';
import React, { ReactNode } from 'react';

const styles = css`
body {
    userSelect: none
    webkitUserSelect: none
}
`;

export const LayoutGame = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Global styles={styles}/>
            <div>
                {children}
            </div>
        </>
    );
};
