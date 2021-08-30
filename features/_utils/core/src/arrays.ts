export const groupItems = <T>(items: T[], getKey: (item: T) => string): { [key: string]: T[] } => {
  const groups = {} as { [key: string]: T[] };
  for (const x of items) {
    const g = groups[getKey(x)] ?? (groups[getKey(x)] = []);
    g.push(x);
  }
  return groups;
};
