import React from 'react';
import { getSiteProvider } from './register-site';
import { SitePageInfo } from './types';

const { createPage } = getSiteProvider();

const CustomComponentTemplate = ({
    pageContext,
}: {
    pageContext: SitePageInfo<unknown>;
}) => {
    const { sitePath, data } = pageContext;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = createPage(sitePath, data as any);
    if (!page) {
        // eslint-disable-next-line no-console
        console.error(`CustomComponent not Found`, { sitePath });
        return null;
    }

    const { Component } = page;
    return (<Component />);
};
export default CustomComponentTemplate;
