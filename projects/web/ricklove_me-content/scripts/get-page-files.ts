import { getAllFiles } from '@ricklove/utils-files';

export const getPageFiles = async (sourcePath: string) => {
  const pageFiles = await getAllFiles(sourcePath);

  return pageFiles
    .filter((f) => f.endsWith(`.tsx`))
    .filter((f) => !f.includes(`_helpers`))
    .map((f) => {
      const relativePathRaw = f.replace(sourcePath, ``).replace(/\\/g, `/`).replace(/^\//, ``);
      const relativePath = relativePathRaw.replace(/.tsx?$/, ``);
      const pageName = relativePath.replace(/\W/g, `_`);

      return {
        pageName,
        relativePath,
        staticRelativePath: `${relativePath}.static`,
        absolutePath: f,
      };
    });
};
