import React, { useEffect, useRef } from 'react';

export const P5Viewer = (props: { art: { renderArt: (hostElement: HTMLDivElement) => void } }) => {

    const hostElementRef = useRef(null as null | HTMLDivElement);

    useEffect(() => {
        if (!hostElementRef.current) { return; }

        props.art.renderArt(hostElementRef.current);
    }, [hostElementRef.current]);

    return (
        <>
            <div style={{ width: 400, height: 400, background: `#888888` }} ref={hostElementRef} />
        </>
    );
};
