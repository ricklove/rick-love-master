// Clone the files and expand the imports found in each

import { getFileInfo, getPathNormalized, getProjectRootDirectoryPath, readFile, writeFile, copyFile, getDirectoryName, getParentName } from 'utils/files';
import { distinct, distinct_key, mergeItems } from 'utils/arrays';
import { getValuesAsItems } from 'dork/utils';
import { TsConfigPath, loadTsConfigPaths } from './generate-tsconfig-paths';


export const cloneFileAndProcessExports = async (sourceFilePath: string,
    onExportFound: (args: {
        fileRelativePath: string;
        sourceFilePath: string;
        destinationFilePath: string | null;
        tsConfigPath: TsConfigPath | null;
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

    // Process Imports
    const p = tsconfigPaths ?? await loadTsConfigPaths(root);

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

    // Note: This skips relative imports
    const regex = new RegExp(`((?:(?:import|export)\\s+[^;]*\\s+from\\s*|(?:import|require)\\s*\\(\\s*)["'\`])([^/\\.]+)(["'\`/])`, `g`);

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

    const getTsConfigPath = (name: string) => p.find(x => x.name === name);

    while ((m = regex.exec(contentFinal))) {
        onExportFound({
            fileRelativePath: relativePath,
            sourceFilePath,
            destinationFilePath: destFilePath,
            tsConfigPath: getTsConfigPath(m[2] ?? ``) ?? null,
            importName: m[2] ?? ``,
            replace,
            wholeText: contentFinal,
            match: m,
        });
    };

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
        const { fileRelativePath, tsConfigPath, replace } = args;
        if (!tsConfigPath) { return; }

        const rPathParts = fileRelativePath.split(`/`);
        const tPathParts = tsConfigPath.path.split(`/`);

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

// export const cloneFileAndReturnImports = async (sourceFilePath: string, rootRaw?: string, tsconfigPaths?: TsConfigPath[]): Promise<TsConfigPath[]> => {

//     const imports = [] as TsConfigPath[];
//     await cloneFileAndProcessExports(sourceFilePath, (args) => {
//         const { tsConfigPath } = args;
//         imports.push(tsConfigPath);
//     }, rootRaw, tsconfigPaths);

//     return distinct(imports);
// };

export type PackageJson = {
    name: string;
    dependencies: { [name: string]: string };
};

export type ImportDependency = {
    importName: string;
    tsConfigPath: TsConfigPath | null;
    sourceFilePath: string;
    destinationFilePath: string;
};

export type FileDependencies = {
    sourceFilePath: string;
    destinationFilePath: string;
    dependencies: ImportDependency[];
};

export const cloneFileAndReturnDependencies = async (sourceFilePath: string, rootRaw?: string, tsconfigPaths?: TsConfigPath[]): Promise<null | FileDependencies> => {

    const importsAll = [] as ImportDependency[];
    await cloneFileAndProcessExports(sourceFilePath, (args) => {
        const { importName, tsConfigPath, destinationFilePath } = args;
        importsAll.push({ importName, tsConfigPath, sourceFilePath, destinationFilePath: destinationFilePath ?? `` });
    }, rootRaw, tsconfigPaths, { cloneToRootPath: await getTargetBuildPath(rootRaw) });

    if (importsAll.length <= 0) { return null; }

    const imports = distinct_key(importsAll, x => x.importName);
    const { destinationFilePath } = imports[0];


    return { sourceFilePath, destinationFilePath, dependencies: imports };
};
export const saveDependenciesToModulePackageJson = async (fileDependencies: FileDependencies[]) => {

    const packageDependenciesAll = await Promise.all(fileDependencies.map(async (x) => {
        const moduleRoot = await getProjectRootDirectoryPath(x.destinationFilePath, { search: `src` });
        const packagePath = getPathNormalized(moduleRoot, `./package.json`);
        return {
            packageJsonPath: packagePath,
            dependencies: x.dependencies,
        };
    }));

    const packageDependencies = mergeItems(packageDependenciesAll, x => x.packageJsonPath, g => ({ packageJsonPath: g[0].packageJsonPath, dependencies: g.flatMap(x => x.dependencies) }));

    // dependencies: { "@loadable/component": "^5.12.0", }
    await Promise.all(packageDependencies.map(async (pack) => {
        const { packageJsonPath, dependencies } = pack;
        const defaultPackageJson = { name: getParentName(packageJsonPath), dependencies: {} } as PackageJson;
        const packageJson = !(await getFileInfo(packageJsonPath)) ? defaultPackageJson : JSON.parse(await readFile(packageJsonPath)) as PackageJson;

        // Record as * for yarn workspaces to manage (if not already there)
        dependencies.forEach(x => {
            if (packageJson.dependencies[x.importName]) { return; }

            // TODO: For external dependencies, get the version from the root package.json
            packageJson.dependencies[x.importName] = `*`;
        });

        await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }));
};

// cloneFileAndExpandExports(getPathNormalized(__dirname, `../../code/games/console-simulator/src/game-dork.ts`));
// cloneFileAndRecordDependencies(getPathNormalized(__dirname, `../../code/games/console-simulator/src/game-dork.ts`));
// cloneFileAndRecordDependencies(getPathNormalized(__dirname, `../../code/games/console-simulator/src/console-simulator.tsx`));
