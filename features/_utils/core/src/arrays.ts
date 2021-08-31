export const groupItems = <T>(items: T[], getKey: (item: T) => string): { [key: string]: T[] } => {
  const groups = {} as { [key: string]: T[] };
  for (const x of items) {
    const g = groups[getKey(x)] ?? (groups[getKey(x)] = []);
    g.push(x);
  }
  return groups;
};

export const moveItem = <T>(obj: T, from: T[], to: T[]) => {
  const i = from.indexOf(obj);
  if (i < 0) {
    throw new Error(`moveItem Failed to find an item in the from array: ${JSON.stringify({ obj, from, to })}`);
  }
  from.splice(i, 1);
  to.push(obj);
};
