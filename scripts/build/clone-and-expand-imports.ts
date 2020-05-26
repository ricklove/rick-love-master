// Clone the files and expand the imports found in each

import { getFileInfo, getPathNormalized, getProjectRootDirectoryPath, copyFile, readFile, writeFile } from 'utils/files';
import { TsConfigPath, loadTsConfigPaths } from './generate-tsconfig-paths';

const targetFromRootPath = `./build/src/`;

export const cloneFileAndExpandExport = async (sourceFilePath: string, rootRaw?: string, tsconfigPaths?: TsConfigPath[]) => {

    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const sourceFileFullPath = getPathNormalized(sourceFilePath);
    const relativePath = sourceFileFullPath.replace(`${root}/`, ``);
    const destFilePath = getPathNormalized(root, targetFromRootPath, relativePath);
    const fileInfo = await getFileInfo(sourceFilePath);
    const destFileInfo = await getFileInfo(destFilePath);

    // Skip if the destination is newer
    if (destFileInfo && destFileInfo.mtime > (fileInfo?.mtime ?? 0)) { return; }

    // await copyFile(sourceFileFullPath, destFilePath);

    // Load File
    const content = await readFile(sourceFileFullPath);

    // Expand Imports
    const toRoot = [...new Array(relativePath.split(`/`).length - 1)].map(x => `../`).join(``);

    const p = tsconfigPaths ?? await loadTsConfigPaths(root);
    let contentFinal = content;
    p.forEach(x => { contentFinal = content.split(x.name).join(toRoot + x.path); });

    // WriteFile
    await writeFile(destFilePath, contentFinal);
};

cloneFileAndExpandExport(getPathNormalized(__dirname, `./build.ts`));
