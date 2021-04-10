export type TimeProvider = {
    now: () => number;
    isPaused: () => boolean;
};
