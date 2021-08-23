import { useEffect, useRef, useState } from 'react';

export const useAsyncWorker = () => {
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const [{ loading, error }, setLoadingError] = useState({ loading: false, error: null as null | { message: string, innerError: unknown } });

    const doWork = (work: (checkMounted: () => boolean) => Promise<void>, options?: { messageIfError?: string }) => {
        (async () => {
            if (!isMounted.current) { return; }
            setLoadingError({ loading: true, error: null });

            try {
                await work(() => isMounted.current);
                if (!isMounted.current) { return; }
                setLoadingError({ loading: false, error: null });
            } catch (err) {
                setLoadingError({ loading: false, error: { message: options?.messageIfError ?? `Error`, innerError: err } });
            }
        })();
    };

    return {
        loading,
        error,
        doWork,
    };
};
