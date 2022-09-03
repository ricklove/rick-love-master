import { BibleAnalysisVerseCountDocument } from '@ricklove/bible-types';

export type BibleHeatmapData = {
  imageData: ImageData;
  averageScoreRatio: number;
};

export const createBibleHeatmapData = (
  verseCounts: BibleAnalysisVerseCountDocument,
  verseState: {
    bookName: string;
    chapterNumber: number;
    verseNumber: number;
    scoreRatio: number;
  }[],
  options?: { width?: number },
): BibleHeatmapData => {
  const totalChapters = verseCounts.books
    .map((x) => x.chapters.length)
    .reduce((out, x) => {
      out += x;
      return out;
    }, 0);

  const totalVerses = verseCounts.books
    .flatMap((x) => x.chapters)
    .reduce((out, x) => {
      out += x;
      return out;
    }, 0);

  const DEFAULT_WIDTH = 160;
  const VERTICAL_HEIGHT = 12;
  const VERTICAL_GAP = 1;
  const EXTRA_GAP_PER_CHAPTER = 0;
  const EXTRA_VERTICALS_PER_BOOK = 2;

  const totalVerseVerticals = Math.ceil(
    verseCounts.books
      .flatMap((x) => x.chapters)
      .reduce((out, x) => {
        out += x + EXTRA_GAP_PER_CHAPTER;
        return out;
      }, 0) / VERTICAL_HEIGHT,
  );

  // Book name = 8
  const totalVerticals = totalVerseVerticals + verseCounts.books.length * EXTRA_VERTICALS_PER_BOOK;
  const w = options?.width ?? DEFAULT_WIDTH;
  const h = Math.ceil(totalVerticals / w) * (VERTICAL_HEIGHT + VERTICAL_GAP);
  const data = new Uint8ClampedArray(4 * w * h);

  // Set Background
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const iPixel = 4 * (y * w + x);

      data[iPixel + 0] = 0x00;
      data[iPixel + 1] = 0x00;
      data[iPixel + 2] = 0x00;
      data[iPixel + 3] = 0xff;
    }
  }

  const drawPixel = (
    iVertical: number,
    yInVertical: number,
    [r, g, b, a]: [r: number, g: number, b: number, a: number],
  ) => {
    const x = iVertical % w;
    const y = Math.floor(iVertical / w) * (VERTICAL_HEIGHT + VERTICAL_GAP) + yInVertical;
    const iPixel = 4 * (y * w + x);

    data[iPixel + 0] = r;
    data[iPixel + 1] = g;
    data[iPixel + 2] = b;
    data[iPixel + 3] = a;
  };

  let sumOverallScore = 0;
  let iVertical = 0;

  const verseStateMap = new Map(
    verseState.map((x) => [`${x.bookName}:${x.chapterNumber}:${x.verseNumber}`, x.scoreRatio]),
  );

  for (const b of verseCounts.books) {
    let sumBookScore = 0;

    if ((iVertical % w) + EXTRA_VERTICALS_PER_BOOK * 2 > w) {
      iVertical += w - (iVertical % w);
    }

    // TODO: Paint book name
    for (let v = 0; v <= EXTRA_VERTICALS_PER_BOOK; v++) {
      iVertical++;
      for (let v = 0; v < VERTICAL_HEIGHT; v++) {
        const yInVertical = v % VERTICAL_HEIGHT;
        drawPixel(iVertical, yInVertical, [0x00, 0x00, 0x00, 0xff]);
      }
    }

    let yInVertical = 0;

    for (let iChapter = 0; iChapter < b.chapters.length; iChapter++) {
      const chapterVerses = b.chapters[iChapter];

      // Draw chapter
      for (let iVerse = 0; iVerse < chapterVerses; iVerse++) {
        if (yInVertical >= VERTICAL_HEIGHT) {
          iVertical++;
          yInVertical -= VERTICAL_HEIGHT;
        }

        const scoreRatio = verseStateMap.get(`${b.bookName}:${iChapter + 1}:${iVerse + 1}`) ?? 0;
        sumBookScore += scoreRatio;

        // Boost any progress away from default
        const scoreRatioQuantized = scoreRatio > 0 ? 0.25 + 0.75 * (Math.round(scoreRatio * 5) / 5) : 0;

        drawPixel(iVertical, yInVertical, [
          Math.floor(0xff * Math.min(1, Math.max(0, 1 - scoreRatioQuantized * 2))),
          Math.floor(0xff * Math.min(1, Math.max(0, scoreRatioQuantized * 2 - 1))),
          Math.floor(0xff * Math.min(1, Math.max(0, 1 - Math.abs(1 - scoreRatioQuantized * 2)))),
          0xff,
        ]);
        yInVertical++;
      }
      yInVertical += EXTRA_GAP_PER_CHAPTER;
    }

    sumOverallScore += sumBookScore;
  }

  const averageVersePerChapter = Math.ceil(totalVerses / totalChapters);
  console.log(`createBibleHeatmapData`, { w, h, totalChapters, totalVerses, totalVerticals, averageVersePerChapter });

  const averageScoreRatio = sumOverallScore / totalVerses;

  return {
    imageData: new ImageData(data, w, h),
    averageScoreRatio,
  };
};
