import './layout.css';
import './code.css';
import React, { ReactNode } from 'react';
import { Header } from './header';
import * as Store from '../../site/store';
import { ZoomWrapper } from '../../components/zoom-wrapper';

export const Layout = ({ children, hideHeader }: { children: ReactNode, hideHeader?: boolean }) => {
    const data = {
        title: Store.site.siteMetadata.title,
        author: Store.site.siteMetadata.author,
        future: Store.methodExample.getFuture(10),
    };

    return (
        <>
            <ZoomWrapper>
                {!hideHeader && <Header siteTitle={`${data.title ?? ``}`} />}
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
