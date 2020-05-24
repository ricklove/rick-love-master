/* eslint-disable import/no-default-export */
import React from 'react';
import { getSiteProvider } from '../register-site';
import { SitePageInfo } from '../types';

const GatsbyLiteTemplate = ({
    pageContext,
}: {
    pageContext: SitePageInfo<unknown>;
}) => {
    const { sitePath, data } = pageContext;

    const { createPage } = getSiteProvider();
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
export default GatsbyLiteTemplate;
