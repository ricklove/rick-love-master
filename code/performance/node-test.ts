/* eslint-disable no-console */
import { delay } from 'utils/delay';
import { createPerformanceTimer } from 'utils/performance-timer';

export const run = async () => {
    await delay(500);
    console.log(`start`);
    const timer = createPerformanceTimer();

    // Run 16 times
    await Promise.all([...new Array(16)].map(async () => simpleLoop()));

    const ms = timer.getElapsedMilliSeconds();
    console.log(`end: ${ms}ms`);
};

const simpleLoop = () => {
    let i = 0;
    const max = 1 * 1000 * 1000 * 1000;
    while (i < max) {
        i++;
    }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
