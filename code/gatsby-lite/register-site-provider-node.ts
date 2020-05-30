/* eslint-disable no-console */
import { SiteProvider_Node } from './types';

console.log(`register-site-provider-node.ts`);

const siteProvider = {
    node: null as null | SiteProvider_Node<unknown>,
};

export const getSiteProvider_Node = () => {
    const v = siteProvider.node;
    console.log(`getSiteProvider`, { v });

    if (!v) { throw new Error(`SiteProvider.loadPageData is null: Call registerSiteProvider in gatsby-config`); }
    return v;
};

export const registerSiteProvider_Node = (value: SiteProvider_Node<unknown>) => {
    console.log(`registerSiteProvider`, { value });
    siteProvider.node = value;
};
