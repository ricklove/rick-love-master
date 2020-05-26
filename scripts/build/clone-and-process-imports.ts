// Clone the files and expand the imports found in each

import { getFileInfo, getPathNormalized, getProjectRootDirectoryPath, readFile, writeFile, copyFile } from 'utils/files';
import { TsConfigPath, loadTsConfigPaths } from './generate-tsconfig-paths';

const targetFromRootPath = `./build/src/`;

export const cloneFileAndProcessExports = async (sourceFilePath: string,
    onExportFound: (args: { fileRelativePath: string, path: TsConfigPath, exportText: string, replace: (value: string) => void, wholeText: string, match: RegExpExecArray }) => void,
    rootRaw?: string, tsconfigPaths?: TsConfigPath[]) => {

    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const sourceFileFullPath = getPathNormalized(sourceFilePath);
    const relativePath = sourceFileFullPath.replace(`${root}/`, ``);
    const destFilePath = getPathNormalized(root, targetFromRootPath, relativePath);
    const fileInfo = await getFileInfo(sourceFilePath);
    const destFileInfo = await getFileInfo(destFilePath);

    // Skip non files
    if (!fileInfo || !fileInfo.isFile()) { return; }

    // Skip if the destination is newer
    // if (destFileInfo && destFileInfo.mtime > (fileInfo?.mtime ?? 0)) { return; }

    if (!sourceFileFullPath.endsWith(`.ts`)
        && !sourceFileFullPath.endsWith(`.tsx`)
        && !sourceFileFullPath.endsWith(`.js`)
        && !sourceFileFullPath.endsWith(`.jsx`)) {
        await copyFile(sourceFileFullPath, destFilePath);
        return;
    }

    // Load File
    const content = await readFile(sourceFileFullPath);
    let contentFinal = content;

    // Expand Imports
    const p = tsconfigPaths ?? await loadTsConfigPaths(root);
    p.forEach(x => {
        // // Include the start and end char to prevent partial matches
        // contentFinal = contentFinal
        //     .split(`"${x.name}/`).join(`"${toRoot}${x.path}/`)
        //     .split(`'${x.name}/`).join(`'${toRoot}${x.path}/`)
        //     .split(`\`${x.name}/`).join(`\`${toRoot}${x.path}/`)
        //     .split(`"${x.name}"`).join(`"${toRoot}${x.path}"`)
        //     .split(`'${x.name}'`).join(`'${toRoot}${x.path}'`)
        //     .split(`\`${x.name}\``).join(`\`${toRoot}${x.path}\``)
        //     ;

        // Include start, end char and ensure is an imports statement
        // Formats: 
        // module.exports = require('gatsby-lite/.babelrc');
        // import {sdadas} from 'gatsby-lite/.babelrc';
        // await import( 'gatsby-lite/.babelrc');
        // export {sdadas} from 'gatsby-lite/.babelrc';
        // export * from 'gatsby-lite/.babelrc';
        // module.exports = require('gatsby-lite');
        // import {sdadas} from 'gatsby-lite';
        // await import( 'gatsby-lite');
        // export {sdadas} from 'gatsby-lite';
        // export * from 'gatsby-lite';

        const regex = new RegExp(`((?:(?:import|export)\\s+[^;]*\\s+from\\s*|(?:import|require)\\s*\\(\\s*)["'\`])(${x.name})(["'\`/])`, `g`);

        let m = null as null | RegExpExecArray;
        const replace = (value: string) => {
            if (!m) { return; }

            const pieces = [
                contentFinal.substr(0, m.index),
                m[1],
                value,
                m[3],
                contentFinal.substr(m.index + m[0].length, contentFinal.length - (m.index + m.length)),
            ];

            contentFinal = pieces.join(``);
        };

        while ((m = regex.exec(contentFinal))) {
            onExportFound({ fileRelativePath: relativePath, path: x, exportText: m[2] ?? ``, replace, wholeText: contentFinal, match: m });
        };
    });

    // WriteFile (as readonly to prevent manual edits)
    await writeFile(destFilePath, contentFinal, { readonly: true, overwrite: true });
};

export const cloneFileAndExpandExports = async (sourceFilePath: string, rootRaw?: string, tsconfigPaths?: TsConfigPath[]) => {

    cloneFileAndProcessExports(sourceFilePath, (args) => {
        const { fileRelativePath, path, replace } = args;
        const rPathParts = fileRelativePath.split(`/`);
        const tPathParts = path.path.split(`/`);

        while (rPathParts[0] === tPathParts[0]) {
            rPathParts.shift();
            tPathParts.shift();
        }

        const toCommon = [...new Array(rPathParts.length - 1)].map(x => `../`).join(``);
        replace(`${toCommon}${tPathParts.join(`/`)}`);
        // Simplify common path
        // contentFinal = contentFinal.replace(/\/..\/code/g, ``);
    }, rootRaw, tsconfigPaths);
};

// cloneFileAndExpandExports(getPathNormalized(__dirname, `../../code/games/console-simulator/src/game-dork.ts`));
