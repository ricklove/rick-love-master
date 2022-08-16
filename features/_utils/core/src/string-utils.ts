export const replaceAll = (text: string, pattern: string, replacement: string) => {
  while (text.includes(pattern)) {
    text = text.replace(pattern, replacement);
  }

  return text;
};
