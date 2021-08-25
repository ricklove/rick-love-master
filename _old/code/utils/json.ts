export type JsonTyped<T> = string & { __json: T };

export const jsonParse = <T>(json: JsonTyped<T>): T => {
    return JSON.parse(json) as T;
};
export const jsonParse_smart = <T>(json: T | JsonTyped<T>): T => {
    if (typeof json === `string`) {
        return JSON.parse(json) as T;
    }
    return json as T;
};
export const jsonStringify = <T>(obj: T) => JSON.stringify(obj) as JsonTyped<T>;

export const jsonStringify_safe = (obj: unknown, shouldFormat?: boolean): string => {
    const visited = [] as unknown[];

    return JSON.stringify(obj, (_, val: unknown) => {
        if (val != null && typeof val == `object`) {
            if (visited.includes(val)) {
                return `[OBJ-DUPLICATED]`;
            }
            visited.push(val);
        }
        return val;
    }, shouldFormat ? 2 : 0);
};
