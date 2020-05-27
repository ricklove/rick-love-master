// Clone the files and expand the imports found in each

import { getFileInfo, getPathNormalized, getProjectRootDirectoryPath, readFile, writeFile, getParentName, readFileAsJson } from 'utils/files';
import { distinct_key, mergeItems, distinct } from 'utils/arrays';
import { toKeyValueObject, toKeyValueArray } from 'utils/objects';
import { TsConfigPath, loadTsConfigPaths } from './generate-tsconfig-paths';
import { PackageJson } from './types';

export const processImports = async (sourceFilePath: string,
    onImportFound: (args: {
        fileRelativePath: string;
        fileFullPath: string;
        tsConfigPath: TsConfigPath | null;
        importExpression: string;
        importPackageName: string;
        replace: (value: string) => void;
        wholeText: string;
        match: RegExpExecArray;
    }) => void,
    root: string, tsconfigPaths?: TsConfigPath[],
    options?: {}) => {

    const sourceFileFullPath = getPathNormalized(sourceFilePath);
    const relativePath = sourceFileFullPath.replace(`${root}/`, ``);
    const fileInfo = await getFileInfo(sourceFilePath);

    // Skip non files
    if (!fileInfo || !fileInfo.isFile()) { return; }

    // Skip non-js files
    if (!sourceFileFullPath.endsWith(`.ts`)
        && !sourceFileFullPath.endsWith(`.tsx`)
        && !sourceFileFullPath.endsWith(`.js`)
        && !sourceFileFullPath.endsWith(`.jsx`)) {
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
    const regex = new RegExp(`((?:(?:import|export)\\s+[^;]*\\s+from\\s*|(?:import|require)\\s*\\(\\s*)["'\`])([^"'\`]+)(["'\`])`, `g`);

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
        const importExpression = m[2] ?? ``;
        const importPackageName = importExpression.startsWith(`@`) ? importExpression.split(`/`).slice(0, 2).join(`/`) : importExpression.split(`/`)[0];
        onImportFound({
            fileRelativePath: relativePath,
            fileFullPath: sourceFilePath,
            tsConfigPath: getTsConfigPath(m[2] ?? ``) ?? null,
            importExpression,
            importPackageName,
            replace,
            wholeText: contentFinal,
            match: m,
        });
    };

    // write file in place
    if (contentFinal !== content) {
        await writeFile(sourceFilePath, contentFinal, { readonly: false, overwrite: true });
    }
};

export const processImports_expandToRelativeImports = async (sourceFilePath: string, root: string, tsconfigPaths?: TsConfigPath[]) => {

    await processImports(sourceFilePath, (args) => {
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
    }, root, tsconfigPaths);
};

export type ImportDependency = {
    importExpression: string;
    importPackageName: string;
    tsConfigPath: TsConfigPath | null;
    fileFullPath: string;
};

export type FileDependencies = {
    fileFullPath: string;
    dependencies: ImportDependency[];
};

export const processImports_returnDependencies = async (sourceFilePath: string, root: string, tsconfigPaths?: TsConfigPath[]): Promise<null | FileDependencies> => {

    const importsAll = [] as ImportDependency[];
    await processImports(sourceFilePath, (args) => {
        const { importExpression, importPackageName, tsConfigPath, fileFullPath } = args;
        importsAll.push({ importExpression, importPackageName, tsConfigPath, fileFullPath });
    }, root, tsconfigPaths);

    if (importsAll.length <= 0) { return null; }

    const imports = distinct_key(importsAll, x => x.importExpression);
    const { fileFullPath } = imports[0];

    return { fileFullPath, dependencies: imports };
};
export const processDependenciesInModulePackageJson = async (
    fileDependencies: FileDependencies[],
    root: string,
    processPackageJson: (packageJson: PackageJson, dependencies: ImportDependency[], rootPackageJson: PackageJson, packageJsonPath: string) => Promise<PackageJson>,
    options?: { placeNewPackageJsonInSrcFolder?: boolean },
) => {

    const rootPackagePath = getPathNormalized(root, `./package.json`);
    const rootPackageJson = JSON.parse(await readFile(rootPackagePath)) as PackageJson;

    const packageDependenciesAll = await Promise.all(fileDependencies.map(async (x) => {
        const moduleRoot = await getProjectRootDirectoryPath(x.fileFullPath, { search: `src` });
        const packagePath = getPathNormalized(moduleRoot, `./package.json`);
        return {
            packageJsonPath: packagePath,
            dependencies: x.dependencies,
        };
    }));

    const packageDependencies = mergeItems(packageDependenciesAll, x => x.packageJsonPath, g => ({ packageJsonPath: g[0].packageJsonPath, dependencies: distinct_key(g.flatMap(x => x.dependencies), x => x.importExpression) }));

    // dependencies: { "@loadable/component": "^5.12.0", }
    await Promise.all(packageDependencies.map(async (pack) => {
        const { packageJsonPath: packageJsonPathRaw, dependencies } = pack;
        let packageJsonPath = packageJsonPathRaw;
        let loadedPackageJson = !(await getFileInfo(packageJsonPath)) ? null : await readFileAsJson<PackageJson>(packageJsonPath);
        if (!loadedPackageJson && options?.placeNewPackageJsonInSrcFolder) {
            packageJsonPath = packageJsonPath.replace(`/package.json`, `/src/package.json`);
            loadedPackageJson = !(await getFileInfo(packageJsonPath)) ? null : await readFileAsJson<PackageJson>(packageJsonPath);
        }

        const loadedPackageJsonText = loadedPackageJson && JSON.stringify(loadedPackageJson, null, 2);

        const defaultPackageJson = { name: getParentName(packageJsonPath), dependencies: {} } as PackageJson;
        const packageJsonInit = loadedPackageJson || defaultPackageJson;

        const packageJson = await processPackageJson(packageJsonInit, dependencies, rootPackageJson, packageJsonPath);

        // Sort Order
        packageJson.dependencies = toKeyValueObject(toKeyValueArray(packageJson.dependencies).sort((a, b) => {
            if (a.value === `*` && b.value === `*`) return a.key.localeCompare(b.key);
            if (a.value === `*`) return -1;
            if (b.value === `*`) return 1;
            return a.key.localeCompare(b.key);
        }));

        const finalPackageJsonText = JSON.stringify(packageJson, null, 2);
        if (loadedPackageJsonText === finalPackageJsonText) { return; }
        await writeFile(packageJsonPath, finalPackageJsonText, { readonly: false, overwrite: true });
    }));
};

export const saveDependenciesToModulePackageJson = async (fileDependencies: FileDependencies[], root: string, options?: { placeNewPackageJsonInSrcFolder?: boolean, updateRootWorkspaces?: boolean }) => {

    const packageJsonPaths = [] as string[];
    await processDependenciesInModulePackageJson(fileDependencies, root, async (packageJsonRaw, dependencies, rootPackageJson, packageJsonPath) => {
        packageJsonPaths.push(packageJsonPath);
        // Json Clone
        const packageJson = JSON.parse(JSON.stringify(packageJsonRaw)) as PackageJson;

        const depPackageNames = distinct(dependencies
            .filter(x => !x.importExpression.startsWith(`.`))
            .map(x => ({
                importPackageName: x.importPackageName,
            })));

        // Record as * for yarn workspaces to manage (if not already there)
        depPackageNames.forEach(x => {
            if ((packageJson.dependencies[x.importPackageName] ?? packageJson.devDependencies?.[x.importPackageName] ?? packageJson.peerDependencies?.[x.importPackageName] ?? `*`) !== `*`) { return; }
            // Ignore node built-in
            if (x.importPackageName === `path`
                || x.importPackageName === `fs`
            ) { return; }

            // For external dependencies, get the version from the root package.json
            packageJson.dependencies[x.importPackageName] =
                rootPackageJson.dependencies[x.importPackageName] ??
                rootPackageJson.devDependencies?.[x.importPackageName] ??
                rootPackageJson.peerDependencies?.[x.importPackageName] ??
                `*`;
        });

        return packageJson;
    }, options);

    if (options?.updateRootWorkspaces) {
        const rootPackagePath = getPathNormalized(root, `./package.json`);
        const rootPackageJson = JSON.parse(await readFile(rootPackagePath)) as PackageJson;
        rootPackageJson.workspaces = packageJsonPaths.map(x => x.replace(`/package.json`, ``).replace(`${root}/`, ``));
        await writeFile(rootPackagePath, JSON.stringify(rootPackageJson, null, 2), { overwrite: true, readonly: false });
    }
};

export const removeLocalDependenciesFromModulePackageJson = async (packageJsonPath: string, root: string) => {
    const packageJson = !(await getFileInfo(packageJsonPath)) ? null : await readFileAsJson<PackageJson>(packageJsonPath);
    if (!packageJson) { return; }

    // Remove any dependencies not listed in root
    const rootPackagePath = getPathNormalized(root, `./package.json`);
    const rootPackageJson = JSON.parse(await readFile(rootPackagePath)) as PackageJson;

    const localDeps = toKeyValueArray(packageJson.dependencies).filter(x =>
        !rootPackageJson.dependencies[x.key]
        && !rootPackageJson.devDependencies?.[x.key]
        && !rootPackageJson.peerDependencies?.[x.key]);

    localDeps.forEach(x => { delete packageJson.dependencies[x.key]; });
    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), { readonly: false, overwrite: true });

};

export const removeRootPackageJsonWorkspaces = async (root: string) => {
    const rootPackagePath = getPathNormalized(root, `./package.json`);
    const rootPackageJson = JSON.parse(await readFile(rootPackagePath)) as PackageJson;
    delete rootPackageJson.workspaces;
    await writeFile(rootPackagePath, JSON.stringify(rootPackageJson, null, 2), { overwrite: true, readonly: false });
};

// cloneFileAndExpandExports(getPathNormalized(__dirname, `../../code/games/console-simulator/src/game-dork.ts`));
// cloneFileAndRecordDependencies(getPathNormalized(__dirname, `../../code/games/console-simulator/src/game-dork.ts`));
// cloneFileAndRecordDependencies(getPathNormalized(__dirname, `../../code/games/console-simulator/src/console-simulator.tsx`));
