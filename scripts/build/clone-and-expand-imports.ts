// Clone the files and expand the imports found in each

import { getFileInfo, getPathNormalized, getProjectRootDirectoryPath, copyFile } from 'utils/files';
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

    await copyFile(sourceFileFullPath, destFilePath);

    // Expand Imports
    const p = tsconfigPaths ?? loadTsConfigPaths(root);


};

cloneFileAndExpandExport(getPathNormalized(__dirname, `./build.ts`));
