import React, { useEffect, useRef } from 'react';

export const Utterances = (props: { repo: string }) => {

    const divRef = useRef(null as null | HTMLDivElement);
    useEffect(() => {
        if (!divRef.current) { return; }

        const div = divRef.current;
        const s = document.createElement(`script`);
        s.async = true;
        s.src = `https://utteranc.es/client.js`;
        s.setAttribute(`repo`, props.repo);
        s.setAttribute(`issue-term`, `pathname`);
        s.setAttribute(`label`, `Comment`);
        s.setAttribute(`theme`, `github-dark`);
        s.setAttribute(`crossorigin`, `anonymous`);
        div.append(s);

    }, []);

    return (
        <>
            <div ref={divRef} />
        </>
    );
};
