export type MemoryPassage = {
  title: string;
  header?: string;
  text: string;
  lang: string;
  passageRange?: {
    bookName: string;
    start: { chapterNumber: number; verseNumber: number };
    end: { chapterNumber: number; verseNumber: number };
  };
};
