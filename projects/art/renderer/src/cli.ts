import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { AppError } from '@ricklove/utils-core';
import { findInParentPath, joinPathNormalized } from '@ricklove/utils-files';
import { createScreenshots } from './create-screenshot';
import { createStaticHtmlPages } from './create-static-html-page';

export const run = async () => {
  const monoRepoRoot = await findInParentPath(process.cwd(), `projects`);
  if (!monoRepoRoot) {
    throw new AppError(`Could not find mono repo root`);
  }

  const artworkDir = joinPathNormalized(monoRepoRoot.dirPath, `./projects/art/artwork/`);
  const artworkProjectPath = joinPathNormalized(artworkDir, `./circles`);

  const tokenIds = [...new Array(100)].map((_x, i) => `${i}`);
  const workingDirPath = joinPathNormalized(artworkProjectPath, `./.art-cache/`);
  const destHtmlDirPath = joinPathNormalized(artworkProjectPath, `./.art-output/html/`);
  const destPreviewDirPath = joinPathNormalized(artworkProjectPath, `./.art-output/preview/`);

  await createStaticHtmlPages({
    projectPath: artworkProjectPath,
    workingDirPath,
    destHtmlDirPath,
    tokenIds,
  });

  // Create preview images

  const shouldGenerateImages = false;
  if (shouldGenerateImages) {
    console.log(`# Generate preview images`, { workingDirPath });

    const imageSizes = [
      { suffix: `_thumb`, width: 60, height: 60 },
      { suffix: ``, width: 600, height: 600 },
    ];
    for (const imageSize of imageSizes) {
      for (const tokenId of tokenIds) {
        const { filePaths } = await createScreenshots({
          url: `file:///${joinPathNormalized(destHtmlDirPath, tokenId)}.html`,
          destDir: joinPathNormalized(workingDirPath, tokenId),
          framesPerSecond: 30,
          frames: 2,
          size: imageSize,
        });

        // Skip first image to make sure it was loaded
        const filePath = filePaths[1];
        const destFilePath = joinPathNormalized(destPreviewDirPath, tokenId + imageSize.suffix + `.png`);
        await fs.mkdir(dirname(destFilePath), { recursive: true });
        await fs.copyFile(filePath, destFilePath);
      }
    }
  }

  const shouldGenerateMovie = false;
  if (shouldGenerateMovie) {
    console.log(`# Generate preview movie`, { workingDirPath });

    const framesPerSecond = 10;
    const command = `ffmpeg -framerate ${framesPerSecond} -i %d.png -pix_fmt yuv420p -c:v libx264 -preset slow -crf 22 -movflags +faststart _output.mp4`;
    // const command = `ffmpeg -framerate 10 -i %06d.png -pix_fmt yuv420p -c:v libx264 -preset slow -crf 22 -movflags +faststart _output.mp4`;
    await exec(command, {
      cwd: destPreviewDirPath,
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
