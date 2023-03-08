export type Subscription<T> = (state: T) => void;
export type Subscribe<T> = (callback: (state: T) => void) => { unsubscribe: () => void };
export type Subscribable<T> = {
  subscribe: Subscribe<T>;
  onStateChange: (state: T) => void;
};

// No window or global declared here (no lib or node context)
declare function setTimeout(callback: () => void, timeout: number): void;

export const createSubscribable = <T>(initialState?: T) => {
  let lastState = initialState;
  const callbacks = [] as (null | Subscription<T>)[];
  const subscribe = (callback: Subscription<T>) => {
    const i = callbacks.length;
    callbacks.push(callback);

    // Send Initial State if it exists
    setTimeout(() => {
      if (!lastState) {
        return;
      }
      callback(lastState);
    }, 0);

    return {
      unsubscribe: () => {
        callbacks[i] = null;
      },
    };
  };
  const onStateChange = (state: T) => {
    lastState = state;
    callbacks.forEach((x) => x?.(state));
  };
  return {
    subscribe,
    onStateChange,
  };
};
