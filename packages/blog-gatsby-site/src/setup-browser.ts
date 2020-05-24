import { registerSiteProvider_Browser } from 'gatsby-lite/register-site';
import { createPage } from 'blog-core/src/site/create-page';

export const setupSite_Browser = () => {
    // eslint-disable-next-line no-console
    console.log(`setupSite_Browser`);
    registerSiteProvider_Browser({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createPage: (sitePath, data) => createPage(sitePath, data as any),
    });
};
