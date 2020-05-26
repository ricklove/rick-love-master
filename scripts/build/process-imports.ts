// Clone the files and expand the imports found in each

import { getFileInfo, getPathNormalized, getProjectRootDirectoryPath, readFile, writeFile, getParentName } from 'utils/files';
import { distinct_key, mergeItems } from 'utils/arrays';
import { toKeyValueObject, toKeyValueArray } from 'utils/objects';
import { TsConfigPath, loadTsConfigPaths } from './generate-tsconfig-paths';

export const processImports = async (sourceFilePath: string,
    onImportFound: (args: {
        fileRelativePath: string;
        fileFullPath: string;
        tsConfigPath: TsConfigPath | null;
        importName: string;
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
    const regex = new RegExp(`((?:(?:import|export)\\s+[^;]*\\s+from\\s*|(?:import|require)\\s*\\(\\s*)["'\`])([^/\\."'\`/]+)(["'\`/])`, `g`);

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
        onImportFound({
            fileRelativePath: relativePath,
            fileFullPath: sourceFilePath,
            tsConfigPath: getTsConfigPath(m[2] ?? ``) ?? null,
            importName: m[2] ?? ``,
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

export type PackageJson = {
    name: string;
    dependencies: { [name: string]: string };
};

export type ImportDependency = {
    importName: string;
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
        const { importName, tsConfigPath, fileFullPath } = args;
        importsAll.push({ importName, tsConfigPath, fileFullPath });
    }, root, tsconfigPaths);

    if (importsAll.length <= 0) { return null; }

    const imports = distinct_key(importsAll, x => x.importName);
    const { fileFullPath } = imports[0];

    return { fileFullPath, dependencies: imports };
};
export const saveDependenciesToModulePackageJson = async (fileDependencies: FileDependencies[], root: string) => {

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

    const packageDependencies = mergeItems(packageDependenciesAll, x => x.packageJsonPath, g => ({ packageJsonPath: g[0].packageJsonPath, dependencies: distinct_key(g.flatMap(x => x.dependencies), x => x.importName) }));

    // dependencies: { "@loadable/component": "^5.12.0", }
    await Promise.all(packageDependencies.map(async (pack) => {
        const { packageJsonPath, dependencies } = pack;
        const defaultPackageJson = { name: getParentName(packageJsonPath), dependencies: {} } as PackageJson;
        const packageJson = !(await getFileInfo(packageJsonPath)) ? defaultPackageJson : JSON.parse(await readFile(packageJsonPath)) as PackageJson;

        // Record as * for yarn workspaces to manage (if not already there)
        dependencies.forEach(x => {
            if ((packageJson.dependencies[x.importName] ?? `*`) !== `*`) { return; }

            // TODO: For external dependencies, get the version from the root package.json
            packageJson.dependencies[x.importName] = rootPackageJson.dependencies[x.importName] ?? `*`;
        });

        // Sort Order
        packageJson.dependencies = toKeyValueObject(toKeyValueArray(packageJson.dependencies).sort((a, b) => {
            if (a.value === `*` && b.value === `*`) return a.key.localeCompare(b.key);
            if (a.value === `*`) return -1;
            if (b.value === `*`) return 1;
            return a.key.localeCompare(b.key);
        }));

        await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), { readonly: true, overwrite: true });
    }));
};

// cloneFileAndExpandExports(getPathNormalized(__dirname, `../../code/games/console-simulator/src/game-dork.ts`));
// cloneFileAndRecordDependencies(getPathNormalized(__dirname, `../../code/games/console-simulator/src/game-dork.ts`));
// cloneFileAndRecordDependencies(getPathNormalized(__dirname, `../../code/games/console-simulator/src/console-simulator.tsx`));
