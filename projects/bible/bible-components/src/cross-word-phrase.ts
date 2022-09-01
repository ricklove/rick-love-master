export const generateCrosswordPhrase = <T>(items: T[], getWord: (item: T) => string) => {
  const itemData = items.map((x) => ({
    part: x,
    word: getWord(x),
  }));
  // TODO:
};
