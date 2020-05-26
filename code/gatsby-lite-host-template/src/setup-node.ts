import { registerSiteProvider_Node } from 'gatsby-lite/register-site-provider-node';
import { loadStaticPageData } from 'blog/site/load-page-data';

export const setupSite_Node = () => {
    // eslint-disable-next-line no-console
    console.log(`setupSite_Node`);
    registerSiteProvider_Node({
        loadStaticPageData,
    });
};
