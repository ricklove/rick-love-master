export const requireAwaitExists = async () => { return await Promise.resolve(true); };

export const basicPromise = () => new Promise<boolean>((resolve) => { resolve(true); });
export const requireAwaitOnPromise = async () => { return await basicPromise(); };