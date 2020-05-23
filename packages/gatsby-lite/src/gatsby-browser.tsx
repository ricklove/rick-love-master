import React, { ReactNode } from 'react';

export const wrapPageElement = (props: { element: ReactNode, props: unknown }) => {
    return (
        <>
            {props.element}
        </>
    );
};
