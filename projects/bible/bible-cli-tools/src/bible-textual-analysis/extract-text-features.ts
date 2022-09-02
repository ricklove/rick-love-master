import { promises as fs } from 'fs';
import path from 'path';

export const extractBibleTextFeatures = async (sourceFilePath: string, destDirPath: string) => {
  const sourceText = await fs.readFile(sourceFilePath, { encoding: `utf-8` });

  const parseBooks = () => {
    // Example Format:
    // 1. Genesis
    // 1.1. Chapter 1
    // 1
    //
    // (The Creation of the World)
    // In the beginning, God created the heavens
    // and the earth.
    // 2
    //
    // The earth was without form and void, and
    // darkness was over the face of the deep. And
    // the Spirit of God was hovering over the face
    // of the waters.
    // 3
    //
    // And God said, "Let there be light," and there
    // was light.

    // 40.5. Chapter 5
    // 1
    //
    // (The Sermon on the Mount)
    // Seeing the crowds, he went up on the
    // mountain, and when he sat down, his
    // disciples came to him.
    // 2(The Beatitudes)
    // And he opened his mouth and taught them,
    // saying:

    const allLines = sourceText.split(`\n`).map((x) => x.trim());
    const iFirstLine = allLines.lastIndexOf(`1. Genesis`);
    const lines = allLines.slice(iFirstLine);
    console.log(`extractBibleTextFeatures.parseBooks`, { iFirstLine, firstLines: lines.slice(0, 10) });

    let curBook = { bookName: ``, bookNumber: 1 };
    let curChapter = 0;
    let curVerse = 0;
    let curSection = {
      heading: ``,
      start: {
        chapterNumber: 1,
        verseNumber: 1,
      },
      end: {
        chapterNumber: 1,
        verseNumber: 1,
      },
    };
    let curVerseLines = [] as string[];

    let verses = [] as {
      text: string;
      chapterNumber: number;
      verseNumber: number;
    }[];
    let sections = [] as {
      heading: string;
      start: {
        chapterNumber: number;
        verseNumber: number;
      };
      end: {
        chapterNumber: number;
        verseNumber: number;
      };
    }[];
    const books = [] as {
      bookName: string;
      bookNumber: number;
      verses: typeof verses;
      sections: typeof sections;
    }[];

    const completeVerse = () => {
      if (curVerse < 1) {
        return;
      }
      verses.push({
        text: curVerseLines.join(`\n`),
        chapterNumber: curChapter,
        verseNumber: curVerse,
      });

      curVerseLines = [];
    };

    const completeSection = () => {
      if (!curSection.heading) {
        return;
      }

      sections.push(curSection);
      curSection = {
        heading: ``,
        start: {
          chapterNumber: 1,
          verseNumber: 1,
        },
        end: {
          chapterNumber: 1,
          verseNumber: 1,
        },
      };
    };

    const completeBook = () => {
      if (!verses.length) {
        return;
      }
      books.push({
        bookName: curBook.bookName,
        bookNumber: curBook.bookNumber,
        sections,
        verses,
      });

      verses = [];
      sections = [];
      curSection = {
        heading: ``,
        start: {
          chapterNumber: 1,
          verseNumber: 1,
        },
        end: {
          chapterNumber: 1,
          verseNumber: 1,
        },
      };
    };

    for (const l of lines) {
      const mChapter = l.match(/^\d+\.\d+\. Chapter (\d+)$/);
      if (mChapter) {
        completeVerse();
        curChapter = Number(mChapter[1]);
        continue;
      }

      const mBook = l.match(/^(\d+)\. (.+)$/);
      if (mBook) {
        // console.log(`mBook`, { mBook, m0: mBook[0], m1: mBook[1], m2: mBook[2] });

        completeVerse();
        completeSection();
        completeBook();
        curBook = { bookNumber: Number(mBook[1]), bookName: mBook[2] };
        continue;
      }

      const mVerseWithSection = l.match(/^(\d+)\((.*)\)$/);
      if (mVerseWithSection) {
        completeVerse();
        curVerse = Number(mVerseWithSection[1]);
        completeSection();
        curSection = {
          heading: mVerseWithSection[2],
          start: { chapterNumber: curChapter, verseNumber: curVerse },
          end: { chapterNumber: curChapter, verseNumber: curVerse },
        };
        continue;
      }

      const mVerse = l.match(/^(\d+)$/);
      if (mVerse) {
        completeVerse();
        curVerse = Number(mVerse[1]);
        continue;
      }

      const mSection = l.match(/^\((.*)\)$/);
      if (mSection) {
        completeSection();
        curSection = {
          heading: mSection[1],
          start: { chapterNumber: curChapter, verseNumber: curVerse },
          end: { chapterNumber: curChapter, verseNumber: curVerse },
        };
        continue;
      }

      if (!l.trim()) {
        curVerseLines.push(``);
        continue;
      }

      curSection.end = { chapterNumber: curChapter, verseNumber: curVerse };
      curVerseLines.push(l);
    }

    completeVerse();
    completeSection();
    completeBook();

    return {
      books,
    };
  };

  const bookEntries = parseBooks();

  await fs.mkdir(destDirPath, { recursive: true });
  await fs.writeFile(path.join(destDirPath, `./books-all.json`), JSON.stringify(bookEntries, null, 2));
};
