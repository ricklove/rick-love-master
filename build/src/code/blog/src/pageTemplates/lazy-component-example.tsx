/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useLoadable } from 'utils-react/loadable';

export type LazyComponentExamplePage_Data = {};

export const LazyComponentExamplePage = (props: { data: LazyComponentExamplePage_Data }) => {

    const { LoadedComponent: HugeComponent, load } = useLoadable(async () => (await import(`./huge-component`)).HugeComponent);
    return (
        <div>
            <div style={{ padding: 4, background: `#CCCCCC` }} onClick={() => load()} >Load</div>
            {HugeComponent && <HugeComponent />}
        </div>
    );
};
