import { registerSiteProvider } from 'gatsby-lite/register-site';
import { loadPageData } from './site/load-page-data';
import { createPage } from './site/create-page';

export const setupSite = () => {
    console.log(`setupSite`);
    registerSiteProvider({
        loadPageData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createPage: (sitePath, data) => createPage(sitePath, data as any),
    });
};
