import { promises as fs } from 'fs';
import path from 'path';
import { getAllFiles } from './get-all-files';

export const copyFiles = async ({ destPath, sourcePath }: { destPath: string; sourcePath: string }) => {
  const allFiles = await getAllFiles(sourcePath);

  for (const sourceFilePath of allFiles) {
    const relFilePath = path.relative(sourcePath, sourceFilePath);
    const destFilePath = path.resolve(destPath, relFilePath);

    await fs.copyFile(sourceFilePath, destFilePath);
  }
};
