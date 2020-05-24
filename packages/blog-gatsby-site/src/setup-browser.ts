import { registerSiteProvider_Browser } from 'gatsby-lite/register-site-provider-browser';
import { createStaticPage } from 'blog/src/site/create-page';

export const setupSite_Browser = () => {
    // eslint-disable-next-line no-console
    console.log(`setupSite_Browser`);
    registerSiteProvider_Browser({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createStaticPage: (sitePath, data) => createStaticPage(sitePath, data as any),
    });
};
