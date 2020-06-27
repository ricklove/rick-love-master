/* eslint-disable unicorn/consistent-function-scoping */
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
import { PostIndexPage, PostIndexPageData } from '../pageTemplates/post-index';
import { PostPage, PostPageData } from '../pageTemplates/post';
import { NotFoundPage } from '../pageTemplates/404';
import { LazyComponentExamplePage } from '../pageTemplates/lazy-component-example';
import { SiteNavigation, setupNavigation } from './store';
import { ComponentTestsPage, ComponentTestsPageData } from '../pageTemplates/component-tests';

export type PageData = {
    postPage?: PostPageData;
    postIndexPage?: PostIndexPageData;
    notFoundPage?: {};
    lazyComponentExamplePage?: {};
    componentTestsPage?: ComponentTestsPageData;
};

export const createStaticPage = (sitePath: string, data: PageData, navigation: SiteNavigation): { Component: () => JSX.Element } => {
    // Generate Page here => No Node context available, all data must be passed in

    // eslint-disable-next-line no-console
    // console.log(`getStaticPage START`, { sitePath, data });
    // console.log(`getStaticPage START`, { sitePath, data });

    // Set Navigation
    setupNavigation(navigation);

    const { postPage, postIndexPage, notFoundPage, lazyComponentExamplePage, componentTestsPage } = data;

    if (postPage) {
        return {
            Component: () => <PostPage data={postPage} />,
        };
    }
    if (postIndexPage) {
        return {
            Component: () => <PostIndexPage data={postIndexPage} />,
        };
    }
    if (lazyComponentExamplePage) {
        return {
            Component: () => <LazyComponentExamplePage data={lazyComponentExamplePage} />,
        };
    }
    if (componentTestsPage) {
        return {
            Component: () => <ComponentTestsPage data={componentTestsPage} />,
        };
    }

    // Dynamic Pages Here
    return {
        Component: () => <NotFoundPage data={notFoundPage ?? {}} />,
    };
};
