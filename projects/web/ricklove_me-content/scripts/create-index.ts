import { writeFileIfChanged } from '@ricklove/utils-files';

export const createIndex = async (
  indexFilePath: string,
  pageFiles: {
    pageName: string;
    relativePath: string;
    staticRelativePath: string;
    absolutePath: string;
  }[],
) => {
  const indexContent = pageFiles
    .map(({ pageName, relativePath }) => {
      return `export { Page as Page_${pageName} } from './src/pages/${relativePath}';\n`;
    })
    .join(``);

  console.log(`createIndex - creating index file`, { indexFilePath });
  await writeFileIfChanged(indexFilePath, indexContent);
};

export const createStaticIndex = async (
  indexFilePath: string,
  pageFiles: {
    pageName: string;
    relativePath: string;
    staticRelativePath: string;
    absolutePath: string;
  }[],
) => {
  const indexContent = pageFiles
    .map(({ pageName, staticRelativePath }) => {
      return `export { page as page_${pageName} } from './src/pages/${staticRelativePath}';\n`;
    })
    .join(``);

  console.log(`createIndex - creating index file`, { indexFilePath });
  await writeFileIfChanged(indexFilePath, indexContent);
};
