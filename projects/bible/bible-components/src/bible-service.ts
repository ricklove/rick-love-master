/* eslint-disable @typescript-eslint/naming-convention */

export type BibleServiceConfig = {
  /** NOTE: This is not secure, and should be replaced with a server-side access */
  esvApiKey: string;
};
export type BiblePassage = {
  passageReference: string;
  sections: {
    header: string;
    verses: {
      chapterRef: number;
      verseRef: number;
      text: string;
    }[];
  }[];
  copyright: {
    short: string;
    long: string;
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

      const result = (await response.json()) as {
        canonical: string;
        passage_meta: {
          /** verseCode: 40005001 [book{2}, chapter{3}, verse{3}] */
          chapter_start: [firstVerseCode: number, lastVerseCode: number];
          chapter_end: [firstVerseCode: number, lastVerseCode: number];
        }[];
        passages: string[];
      };
      const passage = result.passages[0];
      const passageSkipRef = `\n` + passage.split(`\n`).slice(2).join(`\n`) + `\n`;

      const chapterStartCode = result.passage_meta[0].chapter_start[0];
      let lastChapterRef = Math.floor(chapterStartCode / 1000) % 1000;
      let lastVerseRef = 0;

      const sections = passageSkipRef
        .split(`\n___\n`)
        .map((x) => {
          const [header, blank, ...paragraphLines] = x.split(`\n`);
          const sectionText = paragraphLines.join(`\n`);
          const mVerseNumbers = [...sectionText.matchAll(/\[\d+\]/g)];
          const verses = mVerseNumbers.map((m, i) => {
            const verseRef = Number.parseInt(m?.[0]?.match(/\d+/)?.[0] ?? `0`);
            if (verseRef < lastVerseRef) {
              lastChapterRef++;
              lastVerseRef = verseRef;
            }

            const mNext = mVerseNumbers[i + 1];
            const iStart = i === 0 ? 0 : m.index ?? 0;
            const iEndAfter = mNext?.index ?? sectionText.length;
            const verseText = sectionText.substring(iStart, iEndAfter).replace(`[${verseRef}]`, `${verseRef}`);
            return {
              chapterRef: lastChapterRef,
              verseRef,
              text: verseText,
            };
          });
          return {
            header,
            verses,
          };
        })
        .filter((s) => s.header || s.verses.length);

      return {
        passageReference: result.canonical,
        sections,
        copyright: {
          short: `(ESV)`,
          long: `
Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated into any other language.

Users may not copy or download more than 500 verses of the ESV Bible or more than one half of any book of the ESV Bible.`.trim(),
        },
      };
    },
  };
};
