// Clone the files and expand the imports found in each

import { getFileInfo, getPathNormalized, getProjectRootDirectoryPath, readFile, writeFile, copyFile, getDirectoryName } from 'utils/files';
import { distinct } from 'utils/arrays';
import { TsConfigPath, loadTsConfigPaths } from './generate-tsconfig-paths';


export const cloneFileAndProcessExports = async (sourceFilePath: string,
    onExportFound: (args: {
        fileRelativePath: string;
        sourceFilePath: string;
        destinationFilePath: string | null;
        path: TsConfigPath;
        importName: string;
        replace: (value: string) => void;
        wholeText: string;
        match: RegExpExecArray;
    }) => void,
    rootRaw?: string, tsconfigPaths?: TsConfigPath[],
    options?: { cloneToRootPath?: string, shouldModifyOriginalFile?: string }) => {

    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const sourceFileFullPath = getPathNormalized(sourceFilePath);
    const relativePath = sourceFileFullPath.replace(`${root}/`, ``);
    const fileInfo = await getFileInfo(sourceFilePath);

    // Skip non files
    if (!fileInfo || !fileInfo.isFile()) { return; }

    const destFilePath = options?.cloneToRootPath ? getPathNormalized(options.cloneToRootPath, relativePath) : null;
    if (destFilePath) {
        // Skip if the destination is newer
        // const destFileInfo = await getFileInfo(destFilePath);
        // if (destFileInfo && destFileInfo.mtime > (fileInfo?.mtime ?? 0)) { return; }
    }

    if (!sourceFileFullPath.endsWith(`.ts`)
        && !sourceFileFullPath.endsWith(`.tsx`)
        && !sourceFileFullPath.endsWith(`.js`)
        && !sourceFileFullPath.endsWith(`.jsx`)) {
        if (destFilePath) {
            await copyFile(sourceFileFullPath, destFilePath);
        }
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
            onExportFound({
                fileRelativePath: relativePath,
                sourceFilePath,
                destinationFilePath: destFilePath,
                path: x,
                importName: m[2] ?? ``,
                replace,
                wholeText: contentFinal,
                match: m,
            });
        };
    });

    // WriteFile (as readonly to prevent manual edits)
    if (destFilePath) {
        await writeFile(destFilePath, contentFinal, { readonly: true, overwrite: true });
    }

    // write file in place
    if (contentFinal !== content && options?.shouldModifyOriginalFile) {
        await writeFile(sourceFilePath, contentFinal, { readonly: false, overwrite: true });
    }
};

export const getTargetBuildPath = async (rootRaw?: string) => {
    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const targetFromRootPath = getPathNormalized(root, `./build/src/`);
    return targetFromRootPath;
};

export const cloneFileAndExpandImports = async (sourceFilePath: string, rootRaw?: string, tsconfigPaths?: TsConfigPath[]) => {

    await cloneFileAndProcessExports(sourceFilePath, (args) => {
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
    }, rootRaw, tsconfigPaths, { cloneToRootPath: await getTargetBuildPath(rootRaw) });
};

export const cloneFileAndReturnImports = async (sourceFilePath: string, rootRaw?: string, tsconfigPaths?: TsConfigPath[]): Promise<TsConfigPath[]> => {

    const imports = [] as TsConfigPath[];
    await cloneFileAndProcessExports(sourceFilePath, (args) => {
        const { path } = args;
        imports.push(path);
    }, rootRaw, tsconfigPaths);

    return distinct(imports);
};

export type PackageJson = {
    name: string;
    dependencies: { [name: string]: string };
};

export const cloneFileAndRecordDependencies = async (sourceFilePath: string, rootRaw?: string, tsconfigPaths?: TsConfigPath[]) => {

    const importsAll = [] as { path: TsConfigPath, destinationFilePath: string }[];
    await cloneFileAndProcessExports(sourceFilePath, (args) => {
        const { path, destinationFilePath } = args;
        importsAll.push({ path, destinationFilePath: destinationFilePath ?? `` });
    }, rootRaw, tsconfigPaths, { cloneToRootPath: await getTargetBuildPath(rootRaw) });

    if (importsAll.length <= 0) { return; }

    const imports = distinct(importsAll);
    const destFilePath = imports[0].destinationFilePath;
    const moduleRoot = await getProjectRootDirectoryPath(destFilePath, { search: `src` });
    const packagePath = getPathNormalized(moduleRoot, `./package.json`);

    // depdencies: { "@loadable/component": "^5.12.0", }
    const defaultPackageJson = { name: getDirectoryName(moduleRoot), dependencies: {} } as PackageJson;
    const packageJson = !(await getFileInfo(packagePath)) ? defaultPackageJson : JSON.parse(await readFile(packagePath)) as PackageJson;
    // Record as * for yarn workspaces to manage
    imports.forEach(x => { packageJson.dependencies[x.path.name] = `*`; });

    await writeFile(packagePath, JSON.stringify(packageJson, null, 2));
};

// cloneFileAndExpandExports(getPathNormalized(__dirname, `../../code/games/console-simulator/src/game-dork.ts`));
cloneFileAndRecordDependencies(getPathNormalized(__dirname, `../../code/games/console-simulator/src/game-dork.ts`));
