import { ReactNode } from 'react';
import { siteMetadata } from './site';

// This is a module version that supports rollup 
// const config = {

// };


export const site = { siteMetadata };

export const methodExample = {
    getFuture: (seconds: number) => Date.now() + seconds * 1000,
};


export type SiteNavigation = {
    StaticPageLinkComponent: (props: { to: string, children: ReactNode }) => JSX.Element;
};
let _siteNavigation: SiteNavigation | null = null;
export const setupNavigation = (value: SiteNavigation) => {
    _siteNavigation = value;
};
export const getNavigation = (): SiteNavigation => {
    if (_siteNavigation === null) { throw new Error(`Navigation was not setup`); }
    return _siteNavigation;
};
