/* eslint-disable no-underscore-dangle */
import fsRaw, { promises as fs, Dirent } from 'fs';
import path from 'path';
import { delay } from './delay';


export const getDirectoryPath = path.dirname;
export const getDirectoryName = (fullPath: string) => {
    const isDir = fsRaw.statSync(fullPath).isDirectory();
    const dirFullPath = isDir ? fullPath : getDirectoryPath(fullPath);
    const grandDirFullPath = getDirectoryPath(dirFullPath);
    return dirFullPath.replace(grandDirFullPath, ``).replace(/\\/g, ``).replace(/\//g, ``);
};
export const getParentName = (fullPath: string) => {
    const dirFullPath = getDirectoryPath(fullPath);
    const grandDirFullPath = getDirectoryPath(dirFullPath);
    return dirFullPath.replace(grandDirFullPath, ``).replace(/\\/g, ``).replace(/\//g, ``);
};
export const getFileName = path.basename;
export const getPathNormalized = (...x: string[]) => path.resolve(path.join(...x)).replace(/\\/g, `/`);

export const getFileInfo = async (fullPath: string) => {
    try {
        const info = await fs.stat(fullPath);
        return info;
    } catch {
        return null;
    }
};
export const ensureDirectoryExists = async (dirPath: string) => await fs.mkdir(dirPath, { recursive: true });


export const getProjectRootDirectoryPath = async (dirStart: string, options: { search: string } = { search: `.git` }) => {
    const { search } = options;
    let dir = dirStart;
    let hasGit = await getFileInfo(getPathNormalized(dir, search));
    while (!hasGit) {
        const parentDir = getDirectoryPath(dir);
        if (parentDir === dir) {
            throw new Error(`No parent with ${options.search} was found in ${dirStart}`);
        }

        dir = parentDir;
        // eslint-disable-next-line no-await-in-loop
        hasGit = await getFileInfo(getPathNormalized(dir, search));
    }

    return dir;
};

export const deleteFile = async (filePath: string) => {
    try { await fs.unlink(filePath); }
    // eslint-disable-next-line no-empty
    catch { }
};
export const deleteDirectory = async (filePath: string) => {
    try { await fs.rmdir(filePath); }
    // eslint-disable-next-line no-empty
    catch { }
};;

export const readFile = async (filePath: string) => await fs.readFile(filePath, { encoding: `utf-8` });
export const readFileAsJson = async <T>(filePath: string) => JSON.parse(await readFile(filePath)) as T;
export const writeFile = async (filePath: string, data: string | Buffer, options?: { readonly?: boolean, overwrite?: boolean }) => {
    await fs.mkdir(getDirectoryPath(filePath), { recursive: true });
    if (await getFileInfo(filePath)) {
        if (!options?.overwrite) {
            throw new Error(`File already exists, cannot copy without 'overwrite'`);
        }
        await fs.unlink(filePath);
    }
    await fs.writeFile(filePath, data, { encoding: `utf-8`, mode: options?.readonly ? 0o444 : 0o666 });
};
export const copyFile = async (sourceFilePath: string, destFilePath: string, options?: { overwrite?: boolean, readonly?: boolean, disableCreateDirectory?: boolean }) => {
    if (!options?.disableCreateDirectory) { await ensureDirectoryExists(getDirectoryPath(destFilePath)); }

    if (await getFileInfo(destFilePath)) {
        if (!options?.overwrite) {
            throw new Error(`File already exists, cannot copy without 'overwrite'`);
        }
        await fs.unlink(destFilePath);
    }
    await fs.copyFile(sourceFilePath, destFilePath);
    if (options?.readonly) {
        await fs.chmod(destFilePath, 0o444);
    }
};
export const moveFile = async (sourceFilePath: string, destFilePath: string, options?: { removeEmptyDirectory?: boolean }) => {
    await ensureDirectoryExists(getParentName(destFilePath));
    await fs.rename(sourceFilePath, destFilePath);
};
export const renameFile = moveFile;
export const renameDirectory = (sourcePath: string, destPath: string) => moveFile(sourcePath, destPath, { removeEmptyDirectory: true });

export async function getDirectoryContents(dir: string) {
    const items = await fs.readdir(dir, { withFileTypes: true });
    return items;
}

export async function getAllDirectories(dir: string) {
    const dirs = [] as string[];
    await processDirectoryItems(dir, { onDirectory: async (fullPath) => { dirs.push(fullPath); } });
    dirs.sort();
    return dirs.map(x => getPathNormalized(x));
}

export async function getFiles(dir: string, isMatch: (filePath: string) => boolean): Promise<string[]> {
    const files = [] as string[];
    await processDirectoryItems(dir, {
        onFile: async (fullPath) => {
            if (isMatch(fullPath)) {
                files.push(fullPath);
            }
        },
    });
    return files.map(x => getPathNormalized(x));
}

export async function processDirectoryItems(dir: string, options: {
    onDirectory?: (fullPath: string, name: string, info: Dirent) => Promise<void>;
    shouldSkipDirectory?: (fullPath: string, name: string, info: Dirent) => boolean;
    onFile?: (fullPath: string, name: string, info: Dirent) => Promise<void>;
    batchSize?: number;
}) {
    const { onDirectory, onFile, shouldSkipDirectory, batchSize = 100 } = options;
    const items = await fs.readdir(dir, { withFileTypes: true });

    const remainingItems = [...items];
    while (remainingItems.length > 0) {
        const batchItems = remainingItems.splice(0, batchSize);

        // eslint-disable-next-line no-await-in-loop
        await Promise.all(batchItems.map(async (item) => {
            const fullPath = getPathNormalized(dir, item.name);
            if (item.isDirectory()) {
                await onDirectory?.(fullPath, item.name, item);
                const shouldSkip = shouldSkipDirectory?.(fullPath, item.name, item) ?? false;
                if (!shouldSkip) {
                    await processDirectoryItems(fullPath, options);
                }
            }
            else { await onFile?.(fullPath, item.name, item); }
        }));
    }


}

export async function processDirectoryFiles(dir: string, onFile: (filePath: string) => Promise<void>) {
    await processDirectoryItems(dir, { onFile });
}

export async function copyDirectory(fromDir: string, toDir: string, options?: { removeExtraFiles: boolean }) {
    const fromFullDir = getPathNormalized(fromDir);
    const toFullDir = getPathNormalized(toDir);

    const copiedFiles = new Set<string>();
    await processDirectoryFiles(fromFullDir, async (x) => {
        const destFullPath = x.replace(fromFullDir, toFullDir);
        await copyFile(x, destFullPath, { overwrite: true, readonly: true });

        copiedFiles.add(destFullPath);
    });

    if (options?.removeExtraFiles) {
        await processDirectoryItems(toFullDir, {
            onFile: async (x) => {
                try {
                    if (copiedFiles.has(x)) { return; }
                    await deleteFile(x);
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error(`Could not delete file`, { path: x, err: error });
                }
            },
        });

        // Remove unused directories
        await processDirectoryItems(toFullDir, {
            onDirectory: async (x) => {
                try {
                    if ((await getDirectoryContents(x)).length > 0) { return; }
                    await deleteDirectory(x);
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error(`Could not delete directory`, { path: x, err: error });
                }
            },
        });
    }
};

export const watchFileChanges = async (options: { pathRoot: string, runOnStart: boolean }, onFilesChanged: (changedFiles: string[]) => Promise<void>) => {

    const state = {
        isRunning: false,
        changedFiles: {} as { [path: string]: boolean },
        gitIgnoreFileGroups: [] as { sourcePath: string, destintionFilePaths: string[] }[],
    };

    const run = async (filename: string) => {
        // Ignore file changes while running
        if (state.isRunning) { return; }

        // Debounce and collect files changes (if not running yet)
        state.changedFiles[filename] = true;
        await delay(250);

        if (state.isRunning) { return; }
        state.isRunning = true;

        const changedFilenames = Object.keys(state.changedFiles);
        state.changedFiles = {};
        if (changedFilenames.length > 0) {
            await onFilesChanged(changedFilenames);
        }
        state.isRunning = false;
    };

    if (options.runOnStart) {
        await processDirectoryFiles(options.pathRoot, f => run(f));
    }

    fsRaw.watch(options.pathRoot, { recursive: true, persistent: true }, async (event, filename) => {
        await run(getPathNormalized(options.pathRoot, filename));
    });

};
