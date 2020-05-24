/* eslint-disable no-console */
import { SiteProvider_Browser } from './types';

console.log(`register-site-provider-browser.ts`);

const siteProvider = {
    browser: null as null | SiteProvider_Browser<unknown>,
};

export const getSiteProvider_Browser = () => {
    const v = siteProvider.browser;
    console.log(`getSiteProvider`, { v });

    if (!v) { throw new Error(`SiteProvider.createPage is null: Call registerSiteProvider in gatsby-config`); }
    return v;
};

export const registerSiteProvider_Browser = (value: SiteProvider_Browser<unknown>) => {
    console.log(`registerSiteProvider`, { value });
    siteProvider.browser = value;
};
