/* eslint-disable @typescript-eslint/naming-convention */

export type BibleServiceConfig = {
  /** NOTE: This is not secure, and should be replaced with a server-side access */
  esvApiKey: string;
};
export type BiblePassage = {
  bookName: string;
  passageReference: string;
  sections: {
    key: string;
    index: number;
    bookName: string;
    passageReference: string;
    header: string;
    verses: {
      chapterNumber: number;
      verseNumber: number;
      text: string;
    }[];
  }[];
  copyright: {
    url: string;
    short: string;
    long: string;
  };
};
export type BiblePassageRange = {
  bookName: string;
  start: {
    chapterNumber: number;
    verseNumber: number;
  };
  end: {
    chapterNumber: number;
    verseNumber: number;
  };
};

export const createBibleService = (config: BibleServiceConfig) => {
  return {
    getPassage: async (passageReference: string, version = `esv`): Promise<BiblePassage> => {
      const response = await fetch(
        `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(
          passageReference,
        )}&include-footnotes=false&include-short-copyright=false&include-passage-horizontal-lines=true&include-heading-horizontal-lines=true&horizontal-line-length=3`,
        {
          headers: {
            Authorization: `Token ${config.esvApiKey}`,
          },
        },
      );
      console.log(`getPassage - response`, { response });

      const result = (await response.json()) as {
        canonical: string;
        passage_meta: {
          /** verseCode: 40005001 [book{2}, chapter{3}, verse{3}] */
          chapter_start: [firstVerseCode: number, lastVerseCode: number];
          chapter_end: [firstVerseCode: number, lastVerseCode: number];
        }[];
        passages: string[];
      };
      console.log(`getPassage - result`, { result });

      const passage = result.passages[0];
      const passageSkipRef = `\n` + passage.split(`\n`).slice(2).join(`\n`) + `\n`;

      const bookName = result.canonical.replace(/[^a-zA-Z]+$/g, ``);

      const chapterStartCode = result.passage_meta[0].chapter_start[0];
      let lastChapterRef = Math.floor(chapterStartCode / 1000) % 1000;
      let lastVerseRef = 0;

      const sections = passageSkipRef
        .split(`\n___\n`)
        .filter((x) => x.trim())
        .map((x, iSection) => {
          const [header, blank, ...paragraphLines] = x.split(`\n`);
          const sectionText = paragraphLines.join(`\n`);
          const mVerseNumbers = [...sectionText.matchAll(/\[\d+\]/g)];
          const verses = mVerseNumbers.map((m, i) => {
            const verseNumber = Number.parseInt(m?.[0]?.match(/\d+/)?.[0] ?? `0`);
            if (verseNumber < lastVerseRef) {
              lastChapterRef++;
            }
            lastVerseRef = verseNumber;

            const mNext = mVerseNumbers[i + 1];
            const iStart = i === 0 ? 0 : m.index ?? 0;
            const iEndAfter = mNext?.index ?? sectionText.length;
            const verseText = sectionText.substring(iStart, iEndAfter).replace(`[${verseNumber}]`, `${verseNumber}`);
            return {
              chapterNumber: lastChapterRef,
              verseNumber,
              text: verseText,
            };
          });

          const vFirst = verses[0];
          const vLast = verses[verses.length - 1];

          return {
            key: `[${iSection}]${header}`,
            index: iSection,
            bookName,
            passageReference: `${bookName} ${vFirst.chapterNumber}:${vFirst.verseNumber}${
              vLast === vFirst
                ? ``
                : `-${vLast.chapterNumber !== vFirst.chapterNumber ? `${vLast.chapterNumber}:` : ``}${
                    vLast.verseNumber
                  }`
            }`,
            header,
            verses,
          };
        });

      console.log(`getPassage - sections`, { sections });

      return {
        bookName,
        passageReference: result.canonical,
        sections,
        copyright: {
          url: `https://www.esv.org/${result.canonical}/`,
          short: `(ESV)`,
          long: `
Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated into any other language.

Users may not copy or download more than 500 verses of the ESV Bible or more than one half of any book of the ESV Bible.`.trim(),
        },
      };
    },
  };
};
