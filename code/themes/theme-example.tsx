import React, { } from 'react';

import { theme } from './theme';

export const ThemeExample = () => {
    return (
        <div>
            <div style={{ backgroundColor: theme.colors.background }}>
                <span style={{ color: theme.colors.text }}>This is the main theme text!</span>
            </div>
        </div>
    );
};
