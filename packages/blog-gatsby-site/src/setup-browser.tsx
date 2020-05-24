import React from 'react';
import { registerSiteProvider_Browser } from 'gatsby-lite/register-site-provider-browser';
import { createStaticPage } from 'blog/src/site/create-page';
import { Link } from 'gatsby';
import { SiteNavigation } from 'blog/src/site/store';

export const setupSite_Browser = () => {
    // eslint-disable-next-line no-console
    console.log(`setupSite_Browser`);

    const navigation: SiteNavigation = {
        StaticPageLinkComponent: (props) => (<Link {...props} />),
    };

    registerSiteProvider_Browser({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createStaticPage: (sitePath, data) => createStaticPage(sitePath, data as any, navigation),
    });
};
