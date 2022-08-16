import fsRaw from 'fs';
import { joinPathNormalized } from './join-path-normalized';
const fs = fsRaw.promises;

export const getAllFiles = async (dirPath: string): Promise<string[]> => {
  const dirItems = await fs.readdir(dirPath, { withFileTypes: true });
  const dirFiles = dirItems.filter((x) => x.isFile()).map((x) => joinPathNormalized(dirPath, x.name));
  const subDirFiles = await Promise.all(
    dirItems.filter((x) => x.isDirectory()).map(async (d) => await getAllFiles(joinPathNormalized(dirPath, d.name))),
  );
  const subFiles = subDirFiles.flatMap((x) => x);
  return [...dirFiles, ...subFiles];
};
