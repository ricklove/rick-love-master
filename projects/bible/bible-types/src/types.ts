export type BibleData = {
  books: BibleBookData[];
};

export type BibleBookData = {
  bookName: string;
  bookNumber: number;
  verses: BibleVerseData[];
  sections: BibleSectionData[];
};

export type BibleVerseData = {
  text: string;
  chapterNumber: number;
  verseNumber: number;
};

export type BibleSectionData = {
  heading: string;
  start: [chapterNumber: number, verseNumber: number];
  end: [chapterNumber: number, verseNumber: number];
};

export type BibleAnalysisData = {
  books: BibleAnalysisBookData[];
};

export type BibleAnalysisBookData = {
  bookName: string;
  bookNumber: number;
  sections: BibleSectionData[];
  wordCounts: { [word: string]: number };
  chapterVerseCounts: { [chapterNumber: number]: number };
};

export type BibleAnalysisSectionsDocument = {
  books: {
    bookName: string;
    bookNumber: number;
    sections: {
      heading: string;
      /** `Chapter:Verse` */
      start: string;
      /** `Chapter:Verse` */
      end: string;
    }[];
  }[];
};
export type BibleAnalysisVerseCountDocument = {
  books: {
    bookName: string;
    bookNumber: number;
    chapters: number[];
  }[];
};

type BookName = string;
type ChapterNumber = number;
type VerseNumber = number;
export type BibleChapterVerseString = `${number}:${number}`;

export type BiblePassageRangeString =
  | `${BookName} ${ChapterNumber}:${VerseNumber}-${ChapterNumber}:${VerseNumber}`
  | `${BookName} ${ChapterNumber}:${VerseNumber}-${VerseNumber}`;
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

export const BiblePassageRange = {
  encode: (value: BiblePassageRange): BiblePassageRangeString => {
    const { bookName, start, end } = value;
    return `${bookName} ${start.chapterNumber}:${start.verseNumber}-${
      end.chapterNumber === start.chapterNumber ? (`` as const) : (`${end.chapterNumber}:` as const)
    }${end.verseNumber}`;
  },
  decode: (value: BiblePassageRangeString): BiblePassageRange => {
    const [, bookName, startChapter, startVerse, endChapter, endVerse] = [
      ...(value.match(/^([^:]*) (\d+):(\d+)(?:-(?:(\d+):)?(\d+))$/) ?? []),
    ];
    return {
      bookName,
      start: { chapterNumber: Number(startChapter), verseNumber: Number(startVerse) },
      end: { chapterNumber: Number(endChapter ?? startChapter), verseNumber: Number(endVerse ?? startVerse) },
    };
  },
};
