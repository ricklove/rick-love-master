/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import { dirname, resolve as resolvePath, basename as getFilename } from 'path';
import { promisify } from 'util';
import { delay } from './delay';

export { resolvePath, getFilename };

const _mkdir = promisify(fs.mkdir);
const _readFile = promisify(fs.readFile);
const _writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

export const readFile = async (filePath: string) => _readFile(filePath, { encoding: `utf-8` });
export const writeFile = async (filePath: string, data: string | Buffer) => {
    await _mkdir(dirname(filePath), { recursive: true });
    await _writeFile(filePath, data, { encoding: `utf-8` });
};

export async function processDirectoryFiles(dir: string, onFile: (filePath: string) => Promise<void>) {
    const items = await readdir(dir, { withFileTypes: true });
    await Promise.all(items.map(async (item) => {
        const res = resolvePath(dir, item.name);
        if (item.isDirectory()) { await processDirectoryFiles(res, onFile); }
        else { await onFile(res); }
    }));
}

export const watchForFileChanges = async (options: { pathRoot: string, runOnStart: boolean }, onFilesChanged: (changedFiles: string[]) => Promise<void>) => {

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

    fs.watch(options.pathRoot, { recursive: true, persistent: true }, async (event, filename) => {
        run(resolvePath(options.pathRoot, filename));
    });

};
