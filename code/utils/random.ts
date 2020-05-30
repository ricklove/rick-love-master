export const randomIndex = (length: number) => {
    const x = Math.floor(length * Math.random());
    return x >= length ? length - 1 : x;
};
export const randomItem = <T>(items: T[]) => items[randomIndex(items.length)];
