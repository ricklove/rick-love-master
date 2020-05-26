import { registerSiteProvider_Node } from 'gatsby-lite/register-site-provider-node';

export const setupSite_Node = () => {
    registerSiteProvider_Node({
        // Placeholder
        loadStaticPageData: async () => ({ pages: [] }),
    });
};
