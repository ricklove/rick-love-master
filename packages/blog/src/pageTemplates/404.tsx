/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { loadable } from 'utils-react/loadable';

export type NotFoundPageData = {};

export const NotFoundPage_Normal = (props: { data: NotFoundPageData }) => (
    <div>
        <h1>NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist... what exactly were you doing anyway?</p>
    </div>
);

export const NotFoundPage = (props: { data: NotFoundPageData }) => {

    const [visible, setVisible] = useState(false);

    const HugeComponent = !visible ? null : loadable(async () => (await import(`./huge-component`)).HugeComponent);
    return (
        <div>
            <h1>NOT FOUND</h1>
            <p>You just hit a route that doesn&#39;t exist... what exactly were you doing anyway?</p>
            <div onClick={() => setVisible(true)}>Since you entered a random url, her is some random content:</div>
            {HugeComponent && <HugeComponent />}
        </div>
    );
};
