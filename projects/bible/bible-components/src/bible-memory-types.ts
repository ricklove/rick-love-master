export type MemoryPassage = {
  title: string;
  text: string;
  lang: string;
  passageRange?: {
    bookName: string;
    start: { chapterNumber: number; verseNumber: number };
    end: { chapterNumber: number; verseNumber: number };
  };
};
