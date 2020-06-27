import { getAllDirectories, getFiles, getPathNormalized, getParentName, getDirectoryPath, deleteDirectory } from 'utils/files';

export const deleteEmptyDirectories = async (rootPath: string) => {
    const allDirs = await getAllDirectories(rootPath);
    const allFiles = await getFiles(rootPath, x => true);

    const dirs = new Set(allDirs);
    allDirs.forEach(x => dirs.delete(getDirectoryPath(x)));
    allFiles.forEach(x => dirs.delete(getDirectoryPath(x)));

    await Promise.all([...dirs].map(async (x) => await deleteDirectory(x)));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
// deleteEmptyDirectories(getPathNormalized(`../../code/`));
