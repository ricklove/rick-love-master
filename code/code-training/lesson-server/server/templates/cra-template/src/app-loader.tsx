import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export const AppLoader = (props: {}) => {
    const search = window.location.search;
    const FILES_HASH_CODE = 'filesHashCode';
    const filesHashCode = search.substr(1).split(';').find(x => x.includes(FILES_HASH_CODE))?.split('=')[1];

    const [app, setApp] = useState(null as null | { App?: () => JSX.Element });
    useEffect(() => {
        (async () => {
            try {
                const r = (await import(`./project/${filesHashCode}/app`) as { App?: () => JSX.Element });
                setApp(r);
            } catch {
                setApp({});
            }
        })();
    }, [filesHashCode]);

    return (
        <>
            {app?.App && (
                <app.App />
            )}
            {app && !app.App && (<span style={{ color: '#FF0000' }}>App not found!</span>)}
            {!app && (<span>Loading...</span>)}
            <div>
                <span>{filesHashCode}</span>
            </div>
        </>
    );
};
