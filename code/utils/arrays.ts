import { getValuesAsItems } from './objects';

export const moveItem = <T>(obj: T, from: T[], to: T[]) => {
    const i = from.indexOf(obj);
    if (i < 0) { throw new Error(`moveItem Failed to find an item in the from array: ${JSON.stringify({ obj, from, to })}`); }
    from.splice(i, 1);
    to.push(obj);
};

export const distinct = <T>(items: T[]): T[] => {
    const set = new Set(items);
    return [...set];
};

export const shuffle = <T>(items: T[]): T[] => {
    return items.map(x => ({ x, value: Math.random() })).sort((a, b) => a.value - b.value).map(x => x.x);
};

export const distinct_key = <T>(items: T[], getKey: (item: T) => string): T[] => {
    const set = {} as { [key: string]: T };
    items.forEach(x => { set[getKey(x)] = x; });
    return getValuesAsItems(set);
};

export const groupItems = <T>(items: T[], getKey: (item: T) => string): { [key: string]: T[] } => {
    const groups = {} as { [key: string]: T[] };
    for (const x of items) {
        const g = groups[getKey(x)] ?? (groups[getKey(x)] = []);
        g.push(x);
    }
    return groups;
};

export const mergeItems = <T>(items: T[], getKey: (item: T) => string, getMerged: (item: T[], key: string) => T): T[] => {
    const groups = groupItems(items, getKey);
    const merged = getValuesAsItems(groups).map(g => getMerged(g, getKey(g[0])));
    return merged;
};

export function sameArrayContents<T>(a: undefined | null | T[], b?: undefined | null | T[]) {
    if (a === b) { return true; }
    if (a == null && b == null) { return true; }
    if (a == null || b == null) { return false; }
    if (a.length !== b.length) { return false; }
    for (const i in a) {
        if (a[i] !== b[i]) { return false; }
    }
    return true;
}
