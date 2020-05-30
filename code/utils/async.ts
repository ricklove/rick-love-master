export const somePromise = async <T>(items: T[], isTrue: (item: T) => Promise<boolean>) => {
    for (const x of items) {
        // eslint-disable-next-line no-await-in-loop
        if (await isTrue(x)) { return true; }
    }
    return false;
};
