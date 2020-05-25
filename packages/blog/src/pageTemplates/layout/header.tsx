import './header.css';
import React from 'react';
import { ConsoleSimulator } from 'console-simulator/src/console-simulator';
import { createConsoleCommands } from 'console-simulator/src/console-simulator-commands';
import { site, getNavigation } from '../../site/store';

const initDir = site.siteMetadata.title;
const consoleCommands = createConsoleCommands(initDir);

export const Header = ({ siteTitle }: { siteTitle: string }) => {
    const Link = getNavigation().StaticPageLinkComponent;

    return (
        <header>
            <div>
                <h1>
                    <Link to='/'>&nbsp;&gt;&nbsp;</Link>
                    <ConsoleSimulator initialPrompt={`${initDir}>`} onCommand={consoleCommands.onCommand} />
                </h1>
            </div>
        </header>
    );
};
