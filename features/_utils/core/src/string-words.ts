export const getWordRegex = ({ includeDigits = true }: { includeDigits?: boolean } = {}) =>
  includeDigits
    ? /(\d+|(?:[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]['\u2019a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*))/g
    : /(?:[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]['\u2019a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1E00-\u1EFF]*)/g;

export const getWordCounts = (text: string, { caseSensitive = false }: { caseSensitive?: boolean } = {}) => {
  text = caseSensitive ? text : text.toLocaleLowerCase();

  const words = [...text.toLocaleLowerCase().matchAll(getWordRegex())].map((x) => x[0]);

  const wordCountsMap = new Map<string, number>();
  words.forEach((w) => {
    wordCountsMap.set(w, (wordCountsMap.get(w) ?? 0) + 1);
  });

  const wordCounts = [...wordCountsMap.entries()].map(([word, count]) => ({
    word,
    count,
  }));

  // return wordCounts;
  return wordCounts.sort((a, b) => -(a.count - b.count));
};
