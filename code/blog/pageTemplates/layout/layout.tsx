import './layout.css';
import './code.css';
import React, { ReactNode } from 'react';
import { Header } from './header';
import * as Store from '../../site/store';
import { ZoomWrapper } from '../../components/zoom-wrapper';
import { LayoutGame } from './layout-game';

export const Layout = ({ children, gameMode, zoom }: { children: ReactNode, gameMode?: boolean, zoom?: boolean }) => {
    const data = {
        title: Store.site.siteMetadata.title,
        author: Store.site.siteMetadata.author,
        future: Store.methodExample.getFuture(10),
    };

    if (gameMode) {
        return (
            <LayoutGame>
                {children}
            </LayoutGame>
        );
    }

    if (!zoom) {
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
    }

    return (
        <>
            <ZoomWrapper>
                {!gameMode && <Header siteTitle={`${data.title ?? ``}`} />}
                <div>
                    <main>{children}</main>
                    <footer>
                        {`© ${new Date().getFullYear()} ${data.author ?? ``}`}
                    </footer>
                </div>
            </ZoomWrapper>
        </>
    );
};
