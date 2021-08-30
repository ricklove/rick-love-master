import path from 'path';
import { copyAssetsToLib } from './copy-assets';
import { createIndex, createStaticIndex } from './create-index';
import { createNextJsAppJs, createNextJsWebPages } from './create-nextjs-pages';
import { getPageFiles } from './get-page-files';

const sourcePath = path.join(__dirname, `../src`);
const sourcePagesPath = path.join(sourcePath, `./pages`);
const indexFilePath = path.join(sourcePath, `../index.ts`);
const staticIndexFilePath = path.join(sourcePath, `../index-static.ts`);
const libSourcePath = path.join(sourcePath, `../lib/src/`);
const destWebPagesPath = path.join(__dirname, `../../ricklove_me/pages`);

export const build = async () => {
  const pageFiles = await getPageFiles(sourcePagesPath);
  await createIndex(indexFilePath, pageFiles);
  await createStaticIndex(staticIndexFilePath, pageFiles);
  await copyAssetsToLib(sourcePath, libSourcePath);
  await createNextJsWebPages(destWebPagesPath, pageFiles);
  await createNextJsAppJs(destWebPagesPath, sourcePath);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
build();
