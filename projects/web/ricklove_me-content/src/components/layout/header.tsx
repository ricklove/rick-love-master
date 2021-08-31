import { css, Global } from '@emotion/react';
import React from 'react';
import { getNavigation } from '../site';
import { ConsoleSimulatorLoader } from './console-simulator-loader';

const styles = css`
header {
    background-color: #333333;
}

header h1 {
    margin: 0;
    padding: 0;
    font-size: 1rem;
}

header a, header a:visited {
    display: inline-block;
    /* color: #3ca4ff; */
    /* transition: transform 2s; */
}

/* header a:hover, header a:focus, header a:active {
     display: inline-block;
     color: #0075df;
     transform: translate(8px, 0);
     transition: transform 1s;
} */

/* No moving header */

header :hover, header :focus, header :active {
    transform: none;
}
`;

export const Header = ({ siteTitle }: { siteTitle: string }) => {
    const Link = getNavigation().StaticPageLinkComponent;

    return (
        <header>
            <Global styles={styles}/>
            <div>
                <h1>
                    <Link to='/'><a>&nbsp;&gt;&nbsp;</a></Link>
                    <ConsoleSimulatorLoader initialPrompt={siteTitle} />
                </h1>
            </div>
        </header>
    );
};
