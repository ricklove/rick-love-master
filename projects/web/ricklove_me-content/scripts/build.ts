import { joinPathNormalized } from '@ricklove/utils-files';
import { copyAssetsToLib } from './copy-assets';
import { createIndex, createStaticIndex } from './create-index';
import { createNextJsAppJs, createNextJsWebPages } from './create-nextjs-pages';
import { getPageFiles } from './get-page-files';

const sourcePath = joinPathNormalized(__dirname, `../src`);
const sourcePagesPath = joinPathNormalized(sourcePath, `./pages`);
const indexFilePath = joinPathNormalized(sourcePath, `../index.ts`);
const staticIndexFilePath = joinPathNormalized(sourcePath, `../index-static.ts`);
const libSourcePath = joinPathNormalized(sourcePath, `../lib/src/`);
const destWebPagesPath = joinPathNormalized(__dirname, `../../ricklove_me/pages`);

export const build = async () => {
  const pageFiles = await getPageFiles(sourcePagesPath);
  await createIndex(indexFilePath, pageFiles);
  await createStaticIndex(staticIndexFilePath, pageFiles);
  await copyAssetsToLib(sourcePath, libSourcePath);
  await createNextJsWebPages(destWebPagesPath, pageFiles);
  await createNextJsAppJs(destWebPagesPath);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
build();
