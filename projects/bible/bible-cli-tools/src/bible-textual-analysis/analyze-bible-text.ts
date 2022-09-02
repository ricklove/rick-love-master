import { promises as fs } from 'fs';
import path from 'path';
import {
  BibleAnalysisData,
  BibleAnalysisSectionsDocument,
  BibleAnalysisVerseCountDocument,
  BibleData,
} from '@ricklove/bible-types';
import { getWordCounts } from '@ricklove/utils-core';

export const analyzeBibleTextCli = async (
  sourceFilePath: string,
  destDirPath: string,
  bibleParser: (sourceText: string) => BibleData,
) => {
  const sourceText = await fs.readFile(sourceFilePath, { encoding: `utf-8` });

  const bibleData = bibleParser(sourceText);
  const analysis = analyzeBibleText(bibleData);
  const sections: BibleAnalysisSectionsDocument = {
    books: analysis.books.map((b) => ({
      bookName: b.bookName,
      bookNumber: b.bookNumber,
      sections: b.sections.map((x) => ({
        heading: x.heading,
        start: `${x.start[0]}:${x.start[1]}`,
        end: `${x.end[0]}:${x.end[1]}`,
      })),
    })),
  };
  const verseCounts: BibleAnalysisVerseCountDocument = {
    books: analysis.books.map((b) => ({
      bookName: b.bookName,
      bookNumber: b.bookNumber,
      chapters: Object.entries(b.chapterVerseCounts).map(([chapterNumber, verseCount]) => verseCount),
    })),
  };

  const INDENT_JSON = 2;
  // const INDENT_JSON = undefined;
  await fs.mkdir(destDirPath, { recursive: true });
  await fs.writeFile(path.join(destDirPath, `./bible-all.json`), JSON.stringify(bibleData, null, INDENT_JSON));
  await fs.writeFile(path.join(destDirPath, `./bible-analysis.json`), JSON.stringify(analysis, null, INDENT_JSON));
  await fs.writeFile(
    path.join(destDirPath, `./bible-verse-counts.json`),
    JSON.stringify(verseCounts, null, INDENT_JSON),
  );
  await fs.writeFile(path.join(destDirPath, `./bible-sections.json`), JSON.stringify(sections, null, INDENT_JSON));
};

const analyzeBibleText = (bibleData: BibleData): BibleAnalysisData => {
  return {
    books: bibleData.books.map((b) => ({
      bookName: b.bookName,
      bookNumber: b.bookNumber,
      sections: b.sections,
      wordCounts: Object.fromEntries(
        getWordCounts(b.verses.map((v) => v.text).join(`\n`)).map((x) => [x.word, x.count]),
      ),
      chapterVerseCounts: Object.fromEntries(
        [...new Set(b.verses.map((x) => x.chapterNumber))].map((c) => [
          c,
          b.verses.filter((v) => v.chapterNumber === c).length,
        ]),
      ),
    })),
  };
};
