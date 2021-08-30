import fsRaw from 'fs';
const fs = fsRaw.promises;

export const createIndex = async (
  indexFilePath: string,
  pageFiles: {
    pageName: string;
    relativePath: string;
    absolutePath: string;
  }[],
) => {
  const indexContent = pageFiles
    .map(({ pageName, relativePath }) => {
      // export { page as page_posts } from './src/pages/posts';
      return `export { page as page_${pageName} } from './src/pages/${relativePath}';\n`;
    })
    .join(``);

  const oldIndexFileContent = fsRaw.existsSync(indexFilePath)
    ? await fs.readFile(indexFilePath, { encoding: `utf-8` })
    : null;
  if (oldIndexFileContent === indexContent) {
    return;
  }

  console.log(`createIndex - creating index file`, { indexFilePath });
  await fs.writeFile(indexFilePath, indexContent);
};
