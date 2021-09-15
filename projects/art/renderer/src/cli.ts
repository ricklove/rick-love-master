import { AppError } from '@ricklove/utils-core';
import { findInParentPath, joinPathNormalized } from '@ricklove/utils-files';
import { createStaticHtmlPage } from './create-static-html-page';

export const run = async () => {
  const monoRepoRoot = await findInParentPath(process.cwd(), `projects`);
  if (!monoRepoRoot) {
    throw new AppError(`Could not find mono repo root`);
  }

  const artworkDir = joinPathNormalized(monoRepoRoot.dirPath, `./projects/art/artwork/`);
  const artworkProjectPath = joinPathNormalized(artworkDir, `./circles`);

  await createStaticHtmlPage(
    artworkProjectPath,
    joinPathNormalized(artworkProjectPath, `./.art-cache/`),
    joinPathNormalized(artworkProjectPath, `./.art-build/index.html`),
  );
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
