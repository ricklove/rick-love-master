/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { loadable } from 'utils-react/loadable';

export type LazyComponentExamplePage_Data = {};

export const LazyComponentExamplePage = (props: { data: LazyComponentExamplePage_Data }) => {

    const [visible, setVisible] = useState(false);

    const HugeComponent = !visible ? null : loadable(async () => (await import(`./huge-component`)).HugeComponent);
    return (
        <div>
            <div style={{ padding: 4, background: `#CCCCCC` }} onClick={() => setVisible(true)} >Load</div>
            {HugeComponent && <HugeComponent />}
        </div>
    );
};
