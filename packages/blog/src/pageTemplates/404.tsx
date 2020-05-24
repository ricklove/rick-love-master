import React from 'react';
import { Layout } from './layout/layout';
import { SEO } from './layout/seo';

export type NotFoundPageData = {};

export const NotFoundPage = (props: { data: NotFoundPageData }) => (
    <Layout>
        <SEO title='404: Not found' />
        <h1>NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist... what exactly were you doing anyway?</p>
    </Layout>
);
