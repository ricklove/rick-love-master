// Clone the files and expand the imports found in each

import { getFileInfo, getPathNormalized, getProjectRootDirectoryPath, readFile, writeFile, copyFile } from 'utils/files';
import { TsConfigPath, loadTsConfigPaths } from './generate-tsconfig-paths';

const targetFromRootPath = `./build/src/`;

export const cloneFileAndExpandExport = async (sourceFilePath: string, rootRaw?: string, tsconfigPaths?: TsConfigPath[]) => {

    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const sourceFileFullPath = getPathNormalized(sourceFilePath);
    const relativePath = sourceFileFullPath.replace(`${root}/`, ``);
    const destFilePath = getPathNormalized(root, targetFromRootPath, relativePath);
    const fileInfo = await getFileInfo(sourceFilePath);
    const destFileInfo = await getFileInfo(destFilePath);

    // Skip non files
    if (!fileInfo || !fileInfo.isFile()) { return; }

    // Skip if the destination is newer
    if (destFileInfo && destFileInfo.mtime > (fileInfo?.mtime ?? 0)) { return; }

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
    const toRoot = [...new Array(relativePath.split(`/`).length - 1)].map(x => `../`).join(``);

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
        contentFinal = contentFinal.replace(regex, `$1${toRoot}${x.path}$3`);

        // Simplify common path
        contentFinal = contentFinal.replace(/\/..\/code/g, ``);
    });

    // WriteFile (as readonly to prevent manual edits)
    await writeFile(destFilePath, contentFinal, { readonly: true });
};

// cloneFileAndExpandExport(getPathNormalized(__dirname, `./build.ts`));
