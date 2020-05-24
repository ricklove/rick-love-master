/* eslint-disable no-console */
import { SiteProvider_Node, SiteProvider_Browser } from './types';

console.log(`load register-site.ts`);

const siteProvider = {
    node: null as null | SiteProvider_Node<unknown>,
    browser: null as null | SiteProvider_Browser<unknown>,
};

export const getSiteProvider_Node = () => {
    const v = siteProvider.node;
    console.log(`getSiteProvider`, { v });

    if (!v) { throw new Error(`SiteProvider.loadPageData is null: Call registerSiteProvider in gatsby-config`); }
    return v;
};

export const getSiteProvider_Browser = () => {
    const v = siteProvider.browser;
    console.log(`getSiteProvider`, { v });

    if (!v) { throw new Error(`SiteProvider.createPage is null: Call registerSiteProvider in gatsby-config`); }
    return v;
};

// NODE
export const registerSiteProvider_Node = (value: SiteProvider_Node<unknown>) => {
    console.log(`registerSiteProvider`, { value });
    siteProvider.node = value;
};

// BROWSER
export const registerSiteProvider_Browser = (value: SiteProvider_Browser<unknown>) => {
    console.log(`registerSiteProvider`, { value });
    siteProvider.browser = value;
};
