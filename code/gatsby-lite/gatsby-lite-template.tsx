/* eslint-disable import/no-default-export */
import React from 'react';
import { getSiteProvider_Browser } from './register-site-provider-browser';
import { SitePageInfo } from './types';

export const GatsbyLiteTemplate = ({
    pageContext,
}: {
    pageContext: SitePageInfo<unknown>;
}) => {
    const { sitePath, data } = pageContext;

    const { createStaticPage: createPage } = getSiteProvider_Browser();
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
