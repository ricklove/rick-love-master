import { SiteProvider } from './types';

console.log(`load register-site.ts`);

const siteProvider = {
    value: null as null | SiteProvider<unknown>,
};

export const getSiteProvider = () => {
    const v = siteProvider.value;
    console.log(`getSiteProvider`, { v });

    if (!v) { throw new Error(`SiteProvider is null: Call registerSiteProvider in gatsby-config`); }
    return v;
};

export const registerSiteProvider = (value: SiteProvider<unknown>) => {
    console.log(`registerSiteProvider`, { value });
    siteProvider.value = value;
};
