import { MemoryPassage } from './bible-memory-types';
import { BiblePassage } from './bible-service';

export const createMemoryPassagesFromBible = ({
  passage,
  startSection,
  startVerse,
}: {
  passage: BiblePassage;
  startSection?: BiblePassage['sections'][number];
  startVerse?: { chapterNumber: number; verseNumber: number };
}): MemoryPassage[] => {
  if (startSection) {
    const sectionsToMemorize = passage.sections.slice(startSection?.index);
    const sectionItems: MemoryPassage[] = sectionsToMemorize.map((s) => ({
      title: `${s.passageReference}`,
      //title: `${s.passageReference} - ${s.header}`,
      header: `${s.passageReference} - ${s.header}`,
      text: `${s.passageReference} - ${s.header}\n\n${s.verses.map((v) => v.text).join(``)}`,
      lang: `en-US`,
      passageRange: {
        bookName: s.bookName,
        start: { ...s.verses[0], text: undefined },
        end: { ...s.verses[s.verses.length - 1], text: undefined },
      },
    }));

    return sectionItems;
  }

  const allVerses = passage.sections.flatMap((s) => s.verses);
  const versesToMemorize = !startVerse
    ? allVerses
    : allVerses.slice(
        allVerses.findIndex(
          (v) => v.chapterNumber === startVerse.chapterNumber && v.verseNumber === startVerse.verseNumber,
        ),
      );
  const verseItems: MemoryPassage[] = versesToMemorize.map((v) => ({
    title: `${v.chapterNumber}:${v.verseNumber}`,
    text: `${v.text}`,
    lang: `en-US`,
    passageRange: {
      bookName: passage.bookName,
      start: { ...v, text: undefined },
      end: { ...v, text: undefined },
    },
  }));

  return verseItems;
};
