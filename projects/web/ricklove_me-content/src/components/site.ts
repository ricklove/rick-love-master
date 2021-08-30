import { ReactNode } from 'react';

export const siteMetadata = {
  title: `blog_rick_love`,
  author: `Rick Love`,
  description: `It's about development mostly`,
  siteRoot: `https://ricklove.me`,
};

export type SiteNavigation = {
  StaticPageLinkComponent: (props: { to: string; children: ReactNode }) => JSX.Element;
};
let _siteNavigation: SiteNavigation | null = null;
export const setupNavigation = (value: SiteNavigation) => {
  _siteNavigation = value;
};
export const getNavigation = (): SiteNavigation => {
  if (_siteNavigation === null) {
    throw new Error(`Navigation was not setup`);
  }
  return _siteNavigation;
};
