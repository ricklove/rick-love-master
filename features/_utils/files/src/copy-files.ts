import { promises as fs } from 'fs';
import path from 'path';
import { getAllFiles } from './get-all-files';

export const copyFiles = async ({ destPath, sourcePath }: { destPath: string; sourcePath: string }) => {
  const allFiles = await getAllFiles(sourcePath);

  for (const sourceFilePath of allFiles) {
    const relFilePath = path.relative(sourcePath, sourceFilePath);
    const destFilePath = path.resolve(destPath, relFilePath);

    // Try to skip if files same
    try {
      const sSource = await fs.stat(sourceFilePath);
      const sDest = await fs.stat(destFilePath);
      if (sSource.mtimeMs === sDest.mtimeMs && sSource.size === sDest.size) {
        continue;
      }
    } catch {
      // Ignore
    }

    await fs.mkdir(path.dirname(destFilePath), { recursive: true });
    await fs.copyFile(sourceFilePath, destFilePath);
  }
};
