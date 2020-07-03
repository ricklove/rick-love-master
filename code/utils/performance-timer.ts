export const createPerformanceTimer = () => {
    const [seconds, nanoseconds] = process.hrtime();

    const getElapsedNanoSeconds = () => {
        const [s, ns] = process.hrtime();
        const ms = ((s - seconds) * 1000 * 1000 * 1000) + (ns - nanoseconds);
        return ms;
    };

    return {
        getElapsedNanoSeconds,
        getElapsedMicroSeconds: () => getElapsedNanoSeconds() / 1000,
        getElapsedMilliSeconds: () => getElapsedNanoSeconds() / (1000 * 1000),
        getElapsedSeconds: () => getElapsedNanoSeconds() / (1000 * 1000 * 1000),
    };
};
