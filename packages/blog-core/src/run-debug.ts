import { delay } from 'utils/src/delay';

export const run = async () => {

    console.log(`run START`);

    await delay(1000);

    console.log(`run END`);
};

run();
