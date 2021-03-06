import loadable, { DefaultComponent } from '@loadable/component';
import { useState, useRef } from 'react';

const loadComponent = async <T>(loadFn: (props: T) => Promise<DefaultComponent<T>>) => {
    const result = loadable(loadFn);
    const loadedComp = await result.load();
    return {
        LoadedComponent: loadedComp,
    };
};

export const useLoadable = <T>(loadFn: (props: T) => Promise<DefaultComponent<T>>) => {
    const loadState = useRef(`none` as 'none' | 'loading' | 'loaded');

    const [value, setValue] = useState({ LoadedComponent: null } as { LoadedComponent: null | React.ComponentType<T> });
    const load = async () => {
        // Only load once
        if (loadState.current !== `none`) { return; }

        loadState.current = `loading`;
        const result = await loadComponent(loadFn);
        setValue({ LoadedComponent: result.LoadedComponent });
        loadState.current = `loaded`;
    };
    return { ...value, load, loading: loadState.current === `loading` };
};
