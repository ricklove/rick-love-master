import React from 'react';

export type NotFoundPageData = {};

export const NotFoundPage = (props: { data: NotFoundPageData }) => (
    <div>
        <h1>NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist... what exactly were you doing anyway?</p>
    </div>
);
