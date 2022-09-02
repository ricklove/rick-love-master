import { BibleAnalysisVerseCountDocument } from '@ricklove/bible-types';

export type BibleHeatmapData = {
  imageData: ImageData;
};

export const createBibleHeatmapData = (
  verseCounts: BibleAnalysisVerseCountDocument,
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

  const VERTICAL_HEIGHT = 40;
  const EXTRA_VERTICALS_PER_CHAPTER = 1;

  const totalVerseVerticals = verseCounts.books
    .flatMap((x) => x.chapters)
    .reduce((out, x) => {
      out += Math.ceil(x / VERTICAL_HEIGHT) + EXTRA_VERTICALS_PER_CHAPTER;
      return out;
    }, 0);

  // Book name = 8
  const EXTRA_VERTICALS_PER_BOOK = 10;
  const totalVerticals = totalVerseVerticals + verseCounts.books.length * EXTRA_VERTICALS_PER_BOOK;
  const w = options?.width ?? 350;
  const h = Math.ceil(totalVerticals / w) * VERTICAL_HEIGHT;
  const data = new Uint8ClampedArray(4 * w * h);

  // Set Background
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const iPixel = 4 * (y * w + x);

      data[iPixel + 0] = 0xff;
      data[iPixel + 1] = 0xff;
      data[iPixel + 2] = 0xff;
      data[iPixel + 3] = 0xff;
    }
  }

  const drawPixel = (
    iVertical: number,
    yInVertical: number,
    [r, g, b, a]: [r: number, g: number, b: number, a: number],
  ) => {
    const x = iVertical % w;
    const y = Math.floor(iVertical / w) * VERTICAL_HEIGHT + yInVertical;
    const iPixel = 4 * (y * w + x);

    data[iPixel + 0] = r;
    data[iPixel + 1] = g;
    data[iPixel + 2] = b;
    data[iPixel + 3] = a;
  };

  let iVertical = 0;

  for (const b of verseCounts.books) {
    // TODO: Paint book name
    for (let v = 0; v < EXTRA_VERTICALS_PER_BOOK; v++) {
      iVertical++;
      for (let v = 0; v < VERTICAL_HEIGHT; v++) {
        const yInVertical = v % VERTICAL_HEIGHT;
        drawPixel(iVertical, yInVertical, [0xee, 0xee, 0xee, 0xff]);
      }
    }

    for (const chapterVerses of b.chapters) {
      // Draw chapter
      for (let v = 0; v < chapterVerses; v++) {
        if (v % VERTICAL_HEIGHT === 0) {
          iVertical++;
        }

        const yInVertical = v % VERTICAL_HEIGHT;
        drawPixel(iVertical, yInVertical, [0, 0, 0, 0xff]);
      }
      // Draw chapter right padding
      iVertical += EXTRA_VERTICALS_PER_CHAPTER;
    }
  }

  const averageVersePerChapter = Math.ceil(totalVerses / totalChapters);
  console.log(`createBibleHeatmapData`, { w, h, totalChapters, totalVerses, totalVerticals, averageVersePerChapter });

  return {
    imageData: new ImageData(data, w, h),
  };
};
