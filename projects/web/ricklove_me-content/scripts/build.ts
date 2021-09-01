import path from 'path';
import { joinPathNormalized } from '@ricklove/utils-files';
import { copyAssetsToLib } from './copy-assets';
import { createIndex, createStaticIndex } from './create-index';
import { copyNextJsPublicFiles, createNextJsAppJs, createNextJsWebPages } from './create-nextjs-pages';
import { getPageFiles } from './get-page-files';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.resolve(`./scripts`);
const sourcePath = joinPathNormalized(__dirname, `../src`);
const sourcePagesPath = joinPathNormalized(sourcePath, `./pages`);
const indexFilePath = joinPathNormalized(sourcePath, `../index.ts`);
const staticIndexFilePath = joinPathNormalized(sourcePath, `../index-static.ts`);
const libSourcePath = joinPathNormalized(sourcePath, `../lib/src/`);
const destWebPagesPath = joinPathNormalized(__dirname, `../../ricklove_me/pages`);
const sourcePublicPath = joinPathNormalized(sourcePath, `../public`);
const destPublicPath = joinPathNormalized(__dirname, `../../ricklove_me/public`);

export const build = async () => {
  const pageFiles = await getPageFiles(sourcePagesPath);
  await createIndex(indexFilePath, pageFiles);
  await createStaticIndex(staticIndexFilePath, pageFiles);
  await copyAssetsToLib(sourcePath, libSourcePath);
  await createNextJsWebPages(destWebPagesPath, pageFiles);
  await createNextJsAppJs(destWebPagesPath);
  await copyNextJsPublicFiles(destPublicPath, sourcePublicPath);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
build();
