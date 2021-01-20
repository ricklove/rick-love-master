import React, { useEffect, useRef } from 'react';

export const P5Viewer = (props: {
    renderArt: (hostElement: HTMLDivElement) => { remove: () => void };
}) => {

    const hostElementRef = useRef(null as null | HTMLDivElement);

    useEffect(() => {
        if (!hostElementRef.current) { return () => { }; }

        hostElementRef.current.innerHTML = ``;
        const { remove } = props.renderArt(hostElementRef.current);
        return () => {
            remove();
        };
    }, [hostElementRef.current, props.renderArt]);

    return (
        <>
            <div style={{}} ref={hostElementRef} />
        </>
    );
};
