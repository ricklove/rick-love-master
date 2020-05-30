import React, { } from 'react';

import { mainTheme } from './colors';

export const ThemeExample = () => {
    return (
        <div>
            <div style={{ backgroundColor: mainTheme.colors.background }}>
                <span style={{ color: mainTheme.colors.text }}>This is the main theme text!</span>
            </div>
        </div>
    );
};
