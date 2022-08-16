You are a software engineer writing some code. You are using Typescript with react native:

export const groupWords = () => {
    const w = wordList.split(`\n`).map(x => x.trim()).filter(x => x);

    const text = w.map((x, i) => `${x}${(i + 1) % 8 === 0 ? `:\n` : `, `}`).join(``);
    return text;
};