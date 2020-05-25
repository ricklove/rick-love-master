export const getValuesAsItems = <T>(obj: T) => {
    return Object.keys(obj).map(k => k as keyof typeof obj).map(k => obj[k]).filter(x => x);
};
