import React from 'react';
import { D3Host, createD3Test } from './d3-host';

export const CodeSpaceComponent = () => {
    return (
        <>
            <span>D3!</span>
            <div>
                <D3Host createD3Svg={createD3Test} />
            </div>
        </>
    );
};
