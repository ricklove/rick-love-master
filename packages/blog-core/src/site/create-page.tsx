/* eslint-disable unicorn/consistent-function-scoping */
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
// import { PostIndexPage, PostIndexPageData } from '../pageTemplates/post-index';
// import { PostPage, PostPageData } from '../pageTemplates/post';
import { NotFoundPage } from '../pageTemplates/404';

export type PageData = {
    // postPage?: PostPageData;
    // postIndexPage?: PostIndexPageData;
    notFoundPage?: {};
};

export const createPage = (sitePath: string, data: PageData): { Component: () => JSX.Element } => {
    // Generate Page here => No Node context available, all data must be passed in

    // eslint-disable-next-line no-console
    console.log(`getStaticPage START`, { sitePath, data });

    // const { postPage, postIndexPage, notFoundPage } = data;
    const { notFoundPage } = data;

    // if (postPage) {
    //     return {
    //         Component: () => <PostPage data={postPage} />,
    //     };
    // }
    // if (postIndexPage) {
    //     return {
    //         Component: () => <PostIndexPage data={postIndexPage} />,
    //     };
    // }

    return {
        Component: () => <NotFoundPage data={notFoundPage ?? {}} />,
    };
};
