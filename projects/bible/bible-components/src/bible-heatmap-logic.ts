import { BibleAnalysisVerseCountDocument } from '@ricklove/bible-types';
import { getChar3x3Grid } from './letters-3x3';

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
    scoreRatioA: number;
    scoreRatioB?: number;
    scoreRatioC?: number;
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
  const EXTRA_GAP_BEFORE_BOOK = 2;
  const EXTRA_VERTICALS_PER_BOOK = 5;

  const totalVerseVerticals = Math.ceil(
    verseCounts.books
      .flatMap((x) => x.chapters)
      .reduce((out, x) => {
        out += x + EXTRA_GAP_PER_CHAPTER;
        return out;
      }, 0) / VERTICAL_HEIGHT,
  );

  // Book name = 8
  const totalVerticals =
    totalVerseVerticals + verseCounts.books.length * (EXTRA_GAP_BEFORE_BOOK + EXTRA_VERTICALS_PER_BOOK) * 1.05;
  const w = options?.width ?? DEFAULT_WIDTH;
  const h = Math.ceil(totalVerticals / w) * (VERTICAL_HEIGHT + VERTICAL_GAP);
  const data = new Uint8ClampedArray(4 * w * h);

  // Set Background
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const iPixel = 4 * (y * w + x);

      data[iPixel + 0] = 0xcc;
      data[iPixel + 1] = 0xcc;
      data[iPixel + 2] = 0xcc;
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

  const verseStateMap = new Map(verseState.map((x) => [`${x.bookName}:${x.chapterNumber}:${x.verseNumber}`, x]));

  for (const b of verseCounts.books) {
    let sumBookScore = 0;

    // Don't start close to edge
    if ((iVertical % w) + (EXTRA_GAP_BEFORE_BOOK + EXTRA_VERTICALS_PER_BOOK) * 2 > w) {
      iVertical += w - (iVertical % w);
    } else {
      iVertical += EXTRA_GAP_BEFORE_BOOK;
    }

    // Paint book name
    const bookEdgeColor = getDefaultBookColor(b);
    bookEdgeColor[0] += 0x88;
    bookEdgeColor[1] += 0x88;
    bookEdgeColor[2] += 0x88;

    for (let v = 0; v <= EXTRA_VERTICALS_PER_BOOK; v++) {
      iVertical++;
      for (let v = 0; v < VERTICAL_HEIGHT; v++) {
        const yInVertical = v % VERTICAL_HEIGHT;
        drawPixel(iVertical, yInVertical, bookEdgeColor);
      }
    }

    for (let l = 0; l < 3; l++) {
      const letterGrid = getChar3x3Grid(b.bookName.replace(/\s/g, ``)[l]);
      console.log(`draw letter grid`, { b, letterGrid });
      const iVerticalLetterStart = iVertical - EXTRA_VERTICALS_PER_BOOK + 1;
      const yInVerticalLetterStart = 1 + l * 4;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (letterGrid?.grid[i + j * 3]) {
            drawPixel(iVerticalLetterStart + i, yInVerticalLetterStart + j, [0x00, 0x00, 0x00, 0xff]);
          }
        }
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

        const {
          scoreRatioA = 0,
          scoreRatioB = 0,
          scoreRatioC = 0,
        } = verseStateMap.get(`${b.bookName}:${iChapter + 1}:${iVerse + 1}`) ?? {};

        if (scoreRatioA || scoreRatioB || scoreRatioC) {
          sumBookScore += Math.max(scoreRatioA, scoreRatioB, scoreRatioC);

          // Boost any progress away from default
          drawPixel(iVertical, yInVertical, [
            Math.floor(
              0xff * Math.min(1, Math.max(0, Math.round((scoreRatioB > 0 ? 0 : scoreRatioA * 0.75 + 0.25) * 5) / 5)),
            ),
            Math.floor(
              0xff * Math.min(1, Math.max(0, Math.round((scoreRatioC > 0 ? 0 : scoreRatioB * 0.75 + 0.25) * 5) / 5)),
            ),
            Math.floor(0xff * Math.min(1, Math.max(0, Math.round((scoreRatioC * 0.75 + 0.25) * 5) / 5))),
            0xff,
          ]);
        } else {
          drawPixel(iVertical, yInVertical, getDefaultBookColor(b));
        }
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

const getDefaultBookColor = ({
  bookNumber,
}: {
  bookName: string;
  bookNumber: number;
}): [number, number, number, number] => {
  if (bookNumber <= 5) {
    return [0x22, 0x00, 0x00, 0xff];
  }
  if (bookNumber <= 17) {
    return [0x00, 0x00, 0x22, 0xff];
  }
  if (bookNumber <= 22) {
    return [0x00, 0x22, 0x00, 0xff];
  }

  if (bookNumber <= 27) {
    return [0x22, 0x00, 0x22, 0xff];
  }
  if (bookNumber <= 39) {
    return [0x22, 0x22, 0x00, 0xff];
  }

  if (bookNumber <= 43) {
    return [0x33, 0x00, 0x00, 0xff];
  }
  if (bookNumber <= 44) {
    return [0x00, 0x00, 0x33, 0xff];
  }
  if (bookNumber <= 53) {
    return [0x00, 0x33, 0x00, 0xff];
  }

  if (bookNumber <= 57) {
    return [0x00, 0x33, 0x33, 0xff];
  }
  if (bookNumber <= 58) {
    return [0x33, 0x00, 0x33, 0xff];
  }
  if (bookNumber <= 65) {
    return [0x33, 0x33, 0x00, 0xff];
  }

  if (bookNumber <= 66) {
    return [0x33, 0x00, 0x00, 0xff];
  }

  return [0x00, 0x00, 0x00, 0xff];
};
