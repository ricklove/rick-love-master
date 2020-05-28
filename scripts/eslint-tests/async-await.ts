/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
const requireAwaitExists = async () => { return true; };

const basicPromise = () => new Promise<boolean>((resolve) => { resolve(true); });
const requireAwaitOnPromise = async () => { return await basicPromise(); };

const voidPromise = () => new Promise<void>((resolve) => { resolve(); });
async function requireAwaitOnVoidPromise() {
    await basicPromise();
    await voidPromise();
    await voidPromise();
}

const voidAsync = async () => await voidPromise();
async function requireAwaitOnVoidAsync() {
    await basicPromise();
    await voidAsync();
    await voidAsync();
}

const numAsync = async () => await Promise.resolve(42);
async function requireAwaitOnNumAsync() {
    await basicPromise();
    await numAsync();
    await numAsync();
}

async function requireAwaitTryCatch() {
    try {
        await basicPromise();
    } catch{
        console.log(`error`);
    }
}
