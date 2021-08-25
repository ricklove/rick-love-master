export const randomIndex = (length: number) => {
    const x = Math.floor(length * Math.random());
    return x >= length ? length - 1 : x;
};
export const randomItem = <T>(items: T[]) => items[randomIndex(items.length)];

export const randomOrder = <T>(items: T[]): T[] => items
    .map(x => ({ x, i: Math.random() }))
    .sort((a, b) => a.i - b.i)
    .map(x => x.x);

