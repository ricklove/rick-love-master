import path from 'path';
import { createIndex, createStaticIndex } from './create-index';
import { createWebPages } from './create-web-pages';
import { getPageFiles } from './get-page-files';

const sourcePath = path.join(__dirname, `../../ricklove_me-content/src/pages`);
const indexFilePath = path.join(sourcePath, `../../index.ts`);
const staticIndexFilePath = path.join(sourcePath, `../../index-static.ts`);
const destPath = path.join(__dirname, `../../ricklove_me/pages`);

export const build = async () => {
  const pageFiles = await getPageFiles(sourcePath);
  await createIndex(indexFilePath, pageFiles);
  await createStaticIndex(staticIndexFilePath, pageFiles);
  await createWebPages(destPath, pageFiles);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
build();
