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
