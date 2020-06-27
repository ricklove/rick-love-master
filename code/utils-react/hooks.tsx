import { useEffect, useState, useRef } from 'react';
import { sameArrayContents } from 'utils/arrays';
import { ErrorState } from 'utils/error';

type TDoWork = (
    doWorkInner: (stopIfObsolete: (() => void)) => Promise<void>,
    getContext?: () => unknown[]) => void;


export function useMounted() {
    const mounted = useRef(true);
    useEffect(() => {
        // Unmount on unsub
        return () => {
            mounted.current = false;
        };
    }, [/* Init Only */]);
    return { mounted };
}

/** Automatically handle loading and error objects with asyncronous calls
 * @return The { loading, error, doWork } values
 * @example
 *
 *      const { loading, error, doWork } = ChatHooks.useAutoLoadingError();
 *      ...
 *          doWork(async (stopIfObsolete) => {
 *              ...
 *              const result = async DoAsyncWork());
 *              stopIfObsolete(); // Stop work if component has been unmounted, or if contextValues have changed since beginning of doWork
 *              ...
 *              setResult(result);
 *          }, () => [ contextValueA, contextValueB ]); // Optional context values to stop work if changed
 *    
 */
export function useAutoLoadingError() {
    const { mounted } = useMounted();
    const [loadingError, setLoadingError] = useState({ loading: false, error: null as null | ErrorState });

    const UNMOUNTED = `unmounted`;
    const CHANGED_CONTEXT = `changedContext`;

    const doWork: TDoWork = (
        doWorkInner: (stopIfObsolete: (() => void)) => Promise<void>,
        getContext?: () => unknown[]) => {

        let contextInit = undefined as undefined | unknown[];

        const stopIfObsolete = () => {
            if (!mounted.current) {
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw UNMOUNTED;
            }
            const c = getContext?.();

            if (!sameArrayContents(contextInit, c)) {
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw CHANGED_CONTEXT;
            }
        };

        const doCall = async () => {
            contextInit = getContext?.();
            setLoadingError({ loading: true, error: null });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let hadError = false;

            try {
                try {
                    await doWorkInner(stopIfObsolete);
                    stopIfObsolete();
                    setLoadingError({ loading: false, error: null });
                }
                catch (error) {
                    // Ignore unmounted or changed context
                    if (error !== UNMOUNTED && error !== CHANGED_CONTEXT) {
                        throw error;
                    }
                }
            } catch (error) {
                // console.log(`doWork catch`, { err: error });
                hadError = true;

                if (!mounted.current) {
                    // console.warn(`doWork Error when not Mounted`, { err: error });
                    return;
                }

                setLoadingError({ loading: false, error: { message: error.message ?? `Unknown Error in doWork`, error, retryCallback: doCall } });
            }
        };

        // Start Async
        (async () => await doCall())();
    };

    return { loading: loadingError.loading, error: loadingError.error, doWork };
}

export function useLoadData<T>(doWork: TDoWork, getData: () => Promise<T>, getDataDeps?: () => unknown[]) {
    const [data, setData] = useState(null as null | T);
    useEffect(() => {
        // console.log(`useLoadData.useEffect`);
        doWork(async (stopIfObsolete) => {
            // console.log(`useLoadData.useEffect.doWork`);
            const d = await getData();
            stopIfObsolete();
            setData(d);
        }, getDataDeps);
    }, getDataDeps?.() ?? []);
    return { data };
}
