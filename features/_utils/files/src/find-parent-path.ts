import { promises as fs } from 'fs';
import path from 'path';

export const findInParentPath = async (
  currentPath: string,
  dirOrFilename: string,
): Promise<null | { dirPath: string; itemPath: string }> => {
  const dirPath = path.dirname(currentPath);
  const itemPath = path.join(dirPath, dirOrFilename);
  try {
    const result = await fs.stat(itemPath);
    if (result) {
      return { dirPath, itemPath };
    }
  } catch {
    // Failed to find file
  }

  try {
    if (path.dirname(dirPath).length >= dirPath.length) {
      // No parent dir
      // showMessage(`DEBUG: No parent dir: ${dirPath} parent: ${path.dirname(dirPath)}`);

      return null;
    }
  } catch {
    // showMessage(`DEBUG: No parent dir (ERROR): ${dirPath}`);
    return null;
  }

  return await findInParentPath(dirPath, dirOrFilename);
};
