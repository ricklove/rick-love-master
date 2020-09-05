export const createSubscribable = <T>(initialState: T) => {
    let lastState = initialState;
    const callbacks = [] as (null | ((state: T) => void))[];
    const subscribe = (callback: (state: T) => void) => {
        const i = callbacks.length;
        callbacks.push(callback);
        setTimeout(() => { callback(lastState); });
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
