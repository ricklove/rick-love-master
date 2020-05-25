export const getValuesAsItems = <T>(obj: T) => {
    return Object.keys(obj).map(k => k as keyof typeof obj).map(k => obj[k]).filter(x => x);
};

export const toKeyValueObject = <T>(items: { key: string, value: T }[]): { [key: string]: T } => {
    const v = {} as { [key: string]: T };
    items.forEach(x => { v[x.key] = x.value; });
    return v;
};
