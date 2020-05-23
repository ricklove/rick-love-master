import { SiteProvider } from './types';

const siteProvider = {
    value: null as null | SiteProvider<unknown>,
};

export const getSiteProvider = () => {
    const v = siteProvider.value;
    if (!v) { throw new Error(`SiteProvider is null: Call registerSiteProvider in gatsby-config`); }
    return v;
};

export const registerSiteProvider = (value: SiteProvider<unknown>) => {
    siteProvider.value = value;
};
