import fsRaw from 'fs';
import path from 'path';
const fs = fsRaw.promises;

const sourcePath = path.resolve(__dirname, `../../ricklove_me-content/src/pages`);
const destPath = path.resolve(__dirname, `../../ricklove_me/pages`);

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

export const createPages = async () => {
  const pageFiles = await fs.readdir(sourcePath);

  await fs.rmdir(destPath, { recursive: true });
  await fs.mkdir(destPath, { recursive: true });

  for (const f of pageFiles) {
    const pageName = path.parse(f).name;
    const destFilePath = path.resolve(destPath, f);
    const content = `
import { page_${pageName} } from '@ricklove/ricklove_me-content';
const { Page, getStaticProps, getStaticPaths } = page_${pageName};
export { getStaticProps, getStaticPaths };
export default Page;
`.trim();

    console.log(`createPages - create page`, { pageName, destFilePath });

    await fs.writeFile(destFilePath, content);
  }
};

const run = async () => {
  await createIndex();
  await createPages();
};

void run();
