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
export const getFileName = path.basename;
export const getPathNormalized = (...x: string[]) => path.resolve(path.join(...x)).replace(/\\/g, `/`);

export const getFileInfo = async (fullPath: string) => {
    try {
        const info = await fs.stat(fullPath);
        return info;
    } catch{
        return null;
    }
};
export const ensureDirectoryExists = async (dirPath: string) => fs.mkdir(dirPath, { recursive: true });
export const copyFile = async (sourceFilePath: string, destFilePath: string, shouldCreateDirectory = true) => {
    if (shouldCreateDirectory) { await ensureDirectoryExists(getDirectoryPath(destFilePath)); }
    fs.copyFile(sourceFilePath, destFilePath);
};

export const getProjectRootDirectoryPath = async (dirStart: string, options: { search: string } = { search: `.git` }) => {
    const { search } = options;
    let dir = dirStart;
    let hasGit = await getFileInfo(getPathNormalized(dir, search));
    while (!hasGit) {
        const parentDir = getDirectoryPath(dir);
        if (parentDir === dir) {
            throw new Error(`No .git was found`);
        }

        dir = parentDir;
        // eslint-disable-next-line no-await-in-loop
        hasGit = await getFileInfo(getPathNormalized(dir, search));
    }

    return dir;
};

export const directoryContains = async (dirPath: string, relativePath: string) => !!getFileInfo(getPathNormalized(dirPath, relativePath));


export const readFile = async (filePath: string) => fs.readFile(filePath, { encoding: `utf-8` });
export const writeFile = async (filePath: string, data: string | Buffer, options?: { readonly?: boolean, overwrite?: boolean }) => {
    await fs.mkdir(getDirectoryPath(filePath), { recursive: true });
    if (options?.overwrite) { fs.unlink(filePath); }
    await fs.writeFile(filePath, data, { encoding: `utf-8`, mode: options?.readonly ? 0o444 : 0o666 });
};

export async function getAllDirectories(dir: string) {
    const dirs = [] as string[];
    await processDirectoryItems(dir, { onDirectory: async (fullPath) => { dirs.push(fullPath); } });
    dirs.sort();
    return dirs.map(x => getPathNormalized(x));
}

export async function processDirectoryItems(dir: string, options: { onDirectory?: (fullPath: string, name: string, info: Dirent) => Promise<void>, onFile?: (fullPath: string, name: string, info: Dirent) => Promise<void> }) {
    const { onDirectory, onFile } = options;
    const items = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(items.map(async (item) => {
        const fullPath = getPathNormalized(dir, item.name);
        if (item.isDirectory()) {
            await onDirectory?.(fullPath, item.name, item);
            await processDirectoryItems(fullPath, options);
        }
        else { await onFile?.(fullPath, item.name, item); }
    }));
}

export async function processDirectoryFiles(dir: string, onFile: (filePath: string) => Promise<void>) {
    await processDirectoryItems(dir, { onFile });
}

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
        processDirectoryFiles(options.pathRoot, f => run(f));
    }

    fsRaw.watch(options.pathRoot, { recursive: true, persistent: true }, async (event, filename) => {
        run(getPathNormalized(options.pathRoot, filename));
    });

};