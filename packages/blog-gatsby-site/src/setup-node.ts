import { registerSiteProvider_Node } from 'gatsby-lite/register-site';
import { loadPageData } from 'blog-core/src/site/load-page-data';

export const setupSite_Node = () => {
    // eslint-disable-next-line no-console
    console.log(`setupSite_Node`);
    registerSiteProvider_Node({
        loadPageData,
    });
};
