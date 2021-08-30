import React, { ReactNode } from 'react';
import { siteMetadata } from '../site';
import { Header } from './header';
import { LayoutGame } from './layout-game';

export const Layout = ({ children, gameMode }: { children: ReactNode; gameMode?: boolean; zoom?: boolean }) => {
    const data = {
        title: siteMetadata.title,
        author: siteMetadata.author,
    };

    if (gameMode) {
        return (
            <LayoutGame>
                {children}
            </LayoutGame>
        );
    }

    return (
        <>
            {!gameMode && <Header siteTitle={`${data.title ?? ``}`} />}
            <div>
                <main>{children}</main>
                <footer>
                    {`© ${new Date().getFullYear()} ${data.author ?? ``}`}
                </footer>
            </div>
        </>
    );
};
