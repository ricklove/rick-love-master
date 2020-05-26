import React from 'react';
import { registerSiteProvider_Browser } from 'gatsby-lite/register-site-provider-browser';

export const setupSite_Browser = () => {
    registerSiteProvider_Browser({
        // Placeholder
        createStaticPage: (sitePath, data) => ({ Component: () => <></> }),
    });
};
