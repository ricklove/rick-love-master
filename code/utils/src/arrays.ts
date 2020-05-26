export const moveItem = <T>(obj: T, from: T[], to: T[]) => {
    const i = from.indexOf(obj);
    if (i < 0) { throw new Error(`moveItem Failed to find an item in the from array: ${JSON.stringify({ obj, from, to })}`); }
    from.splice(i, 1);
    to.push(obj);
};

export const distinct = <T>(items: T[]) => {
    const set = new Set(items);
    return [...set];
};
