import { promises as fs } from 'fs';
import path from 'path';

export const loadRushJson = async (currentPath: string) => {
  return await loadFileInParentPath(currentPath, `rush.json`);
};
export const loadRushJsonProjects = async (currentPath: string) => {
  const result = await loadRushJson(currentPath);
  if (!result) {
    return null;
  }

  // showMessage(`DEBUG: Found rush.json at projects: ${result.filePath}`);

  const { content, filePath } = result;
  const rushJsonObj = parseJsonc(content) as {
    projects: {
      packageName: string;
      projectFolder: string;
    }[];
  };
  const rushProjects = rushJsonObj.projects;

  // showMessage(`DEBUG: parsed rush.json: ${rushProjects.map((x) => x.packageName).join(`, `)}`);
  return {
    rushJsonFilePath: filePath,
    rushProjects,
  };
};

const loadFileInParentPath = async (
  currentPath: string,
  filename: string,
): Promise<null | { content: string; filePath: string }> => {
  const dirPath = path.dirname(currentPath);
  const filePath = path.join(dirPath, filename);
  try {
    const content = await fs.readFile(filePath, { encoding: `utf-8` });
    return { content, filePath };
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

  return await loadFileInParentPath(dirPath, filename);
};

const parseJsonc = (content: string) => {
  const cleaned = content
    // Remove line comments
    .replace(/^\s*\/\/.*$/gm, ``)
    // Remove multi-line comments
    .replace(/\/\*([\s\S]*?)\*\//g, ``);
  return JSON.parse(cleaned);
};
