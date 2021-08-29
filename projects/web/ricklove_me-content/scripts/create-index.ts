import fsRaw from 'fs';
import path from 'path';
const fs = fsRaw.promises;

const sourcePath = path.resolve(__dirname, `../../ricklove_me-content/src/pages`);

export const createIndex = async () => {
  const pageFiles = await fs.readdir(sourcePath);
  const indexContent = pageFiles
    .map((f) => {
      const pageName = path.parse(f).name;
      // export { page as page_posts } from './src/pages/posts';
      return `export { page as page_${pageName} } from './src/pages/${pageName}';\n`;
    })
    .join(``);

  const indexFilePath = path.resolve(sourcePath, `../../index.ts`);

  const oldIndexFileContent = fsRaw.existsSync(indexFilePath)
    ? await fs.readFile(indexFilePath, { encoding: `utf-8` })
    : null;
  if (oldIndexFileContent === indexContent) {
    return;
  }

  console.log(`createIndex - creating index file`, { indexFilePath });
  await fs.writeFile(indexFilePath, indexContent);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
createIndex();
