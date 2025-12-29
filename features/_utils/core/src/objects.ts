export const getValuesAsItems = <T extends Record<string, unknown>>(obj: T): T[keyof T][] => {
  return Object.keys(obj)
    .map((k) => k as keyof typeof obj)
    .map((k) => obj[k])
    .filter((x) => x);
};

export const toKeyValueObject = <T>(items: { key: string; value: T }[]): { [key: string]: T } => {
  const v = {} as { [key: string]: T };
  items.forEach((x) => {
    v[x.key] = x.value;
  });
  return v;
};

export const toMap = <T>(items: { key: string; value: T }[]): Map<string, T> => {

  const v = new Map(items.map((x) => [x.key, x.value]));
  return v;
};

export const toKeyValueArray = <T>(obj: { [key: string]: T }): { key: string; value: T }[] => {
  return Object.keys(obj)
    .map((k) => k as keyof typeof obj)
    .map((k) => ({ key: k as string, value: obj[k] }));
};
