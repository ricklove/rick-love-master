import { promises as fs } from 'fs';
import path from 'path';

export const extractBibleTextFeatures = async (sourceFilePath: string, destDirPath: string) => {
  const sourceText = await fs.readFile(sourceFilePath, { encoding: `utf-8` });

  const books = `
1. Genesis
2. Exodus
3. Leviticus
4. Numbers
5. Deuteronomy
6. Joshua
7. Judges
8. Ruth
9. 1 Samuel
10. 2 Samuel
11. 1 Kings
12. 2 Kings
13. 1 Chronicles
14. 2 Chronicles
15. Ezra
16. Nehemiah
17. Esther
18. Job
19. Psalms
20. Proverbs
21. Ecclesiastes
22. Song of Songs
23. Isaiah
24. Jeremiah
25. Lamentations
26. Ezekiel
27. Daniel
28. Hosea
29. Joel
30. Amos
31. Obadiah
32. Jonah
33. Micah
34. Nahum
35. Habakkuk
36. Zephaniah
37. Haggai
38. Zechariah
39. Malachi
40. Matthew
41. Mark
42. Luke
43. John
44. Acts
45. Romans
46. 1 Corinthians
47. 2 Corinthians
48. Galatians
49. Ephesians
50. Philippians
51. Colossians
52. 1 Thessalonians
53. 2 Thessalonians
54. 1 Timothy
55. 2 Timothy
56. Titus
57. Philemon
58. Hebrews
59. James
60. 1 Peter
61. 2 Peter
62. 1 John
63. 2 John
64. 3 John
65. Jude
66. Revelation
  `
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x)
    .map((l) => l.split(`.`))
    .map(([number, name]) => ({
      number,
      name,
    }));

  const booksStartIndexes = books.map((b) => {
    const iBook = sourceText.lastIndexOf(`${b.number}. ${b.name}`);
    return {
      ...b,
      iStart: iBook,
    };
  });

  const bookEntries = booksStartIndexes
    .map((b, i) => {
      const iEndExclusive = booksStartIndexes[i + 1]?.iStart ?? sourceText.length;
      return {
        ...b,
        iEnd: iEndExclusive,
      };
    })
    .map((b) => {
      const bookText = sourceText.substring(b.iStart, b.iEnd);

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

      const lines = bookText.split(`\n`).slice(1);

      let nChapter = 0;
      let nVerse = 0;
      let sectionStart = { heading: ``, chapterNumber: 1, verseNumber: 1 };
      let verseLines = [] as string[];

      const verses = [] as {
        text: string;
        chapterNumber: number;
        verseNumber: number;
      }[];
      const sections = [] as {
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

      const completeVerse = () => {
        verses.push({
          text: verseLines.join(`\n`),
          chapterNumber: nChapter,
          verseNumber: nVerse,
        });

        verseLines = [];
      };

      const completeSection = () => {
        sections.push({
          heading: sectionStart.heading,
          start: {
            chapterNumber: sectionStart.chapterNumber,
            verseNumber: sectionStart.verseNumber,
          },
          end: {
            chapterNumber: nChapter,
            verseNumber: nVerse,
          },
        });
      };

      for (const l of lines) {
        const mChapter = l.match(/\d+\.\d+ Chapter (\d+)/);
        if (mChapter) {
          completeVerse();
          nChapter = Number(mChapter[1]);
          return;
        }

        const mVerse = l.match(/^(\d+)$/);
        if (mVerse) {
          completeVerse();
          nVerse = Number(mVerse[1]);
          return;
        }

        const mSection = l.match(/^\((.*)\)$/);
        if (mSection) {
          completeSection();
          sectionStart = { heading: mSection[1], chapterNumber: nChapter, verseNumber: nVerse };
          return;
        }

        verseLines.push(l);
      }

      completeVerse();
      completeSection();

      return {
        bookName: b.name,
        bookNumber: b.number,
        verses,
        sections,
      };
    });

  await fs.writeFile(path.join(destDirPath, `./books-all.json`), JSON.stringify(bookEntries, null, 2));
};
