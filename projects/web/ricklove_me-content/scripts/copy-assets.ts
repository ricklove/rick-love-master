import fsRaw from 'fs';
import path from 'path';
import { getAllFiles } from '@ricklove/utils-files';
const fs = fsRaw.promises;

export const copyAssetsToLib = async (
  sourcePath: string,
  libSourcePath: string,
  options: { extensions: string[] } = { extensions: `png jpg gif css`.split(` `) },
) => {
  const allFiles = await getAllFiles(sourcePath);
  const assetFiles = allFiles.filter((x) => options.extensions.some((ext) => x.endsWith(`.${ext}`)));
  await Promise.all(
    assetFiles.map(async (fileSourcePath) => {
      const fileDestPath = fileSourcePath.replace(sourcePath, libSourcePath);

      await fs.mkdir(path.dirname(fileDestPath), { recursive: true });
      await fs.copyFile(fileSourcePath, fileDestPath);
    }),
  );
};
