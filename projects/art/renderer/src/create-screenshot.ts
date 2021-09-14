import { promises as fs } from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { GlobalArtController, GlobalArtControllerType } from '@ricklove/art-common';

export const createScreenshots = async ({
  url,
  destDir,
  size,
  frames,
  framesPerSecond,
}: {
  url: string;
  destDir: string;
  size: { width: number; height: number };
  frames: number;
  framesPerSecond: number;
}) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport(size);
  await page.goto(url);

  const destPath = path.resolve(destDir);
  await fs.mkdir(destPath, { recursive: true });

  for (let i = 0; i < frames; i++) {
    await page.screenshot({ path: path.join(destPath, `${i}.png`.padStart(10, `0`)) });

    const evaluateArgs = {
      globalArtControllerKey: GlobalArtController.key,
      framesPerSecond,
    };
    await page.evaluate(({ framesPerSecond, globalArtControllerKey }: typeof evaluateArgs) => {
      const c = (window as unknown as { [globalArtControllerKey]?: GlobalArtControllerType })[globalArtControllerKey];
      if (!c) {
        return;
      }
      c.nextFrame(framesPerSecond);
    }, evaluateArgs);
  }

  // // Get the "viewport" of the page, as reported by the page.
  // const dimensions = await page.evaluate(() => {
  //   return {
  //     width: document.documentElement.clientWidth,
  //     height: document.documentElement.clientHeight,
  //     deviceScaleFactor: window.devicePixelRatio,
  //   };
  // });
  // console.log(`Dimensions:`, dimensions);

  await browser.close();
};
