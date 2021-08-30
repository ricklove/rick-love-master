import React from 'react';
import { getNavigation } from '../site';
import { ConsoleSimulatorLoader } from './console-simulator-loader';

export const Header = ({ siteTitle }: { siteTitle: string }) => {
    const Link = getNavigation().StaticPageLinkComponent;

    return (
        <header>
            <div>
                <h1>
                    <Link to='/'><a>&nbsp;&gt;&nbsp;</a></Link>
                    <ConsoleSimulatorLoader initialPrompt={siteTitle} />
                </h1>
            </div>
        </header>
    );
};
