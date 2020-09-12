
export type Subscription<T> = (state: T) => void;

export const createSubscribable = <T>(initialState?: T) => {
    let lastState = initialState;
    const callbacks = [] as (null | Subscription<T>)[];
    const subscribe = (callback: Subscription<T>) => {
        const i = callbacks.length;
        callbacks.push(callback);

        // Send Initial State if it exists
        setTimeout(() => {
            if (!lastState) { return; }
            callback(lastState);
        });

        return {
            unsubscribe: () => {
                callbacks[i] = null;
            },
        };
    };
    const onStateChange = (state: T) => {
        lastState = state;
        callbacks.forEach(x => x?.(state));
    };
    return {
        subscribe,
        onStateChange,
    };
};
