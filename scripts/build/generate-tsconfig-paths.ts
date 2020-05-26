import { getAllDirectories, getPathNormalized, getDirectoryName, readFile, writeFile, getProjectRootDirectoryPath, directoryContains } from 'utils/files';
import { toKeyValueObject, toKeyValueArray } from 'utils/objects';
import { piped } from 'utils/piped';

export type TsConfigPathsRaw = { [name: string]: string[] }
export type TsConfigPath = { path: string, name: string };

export const loadTsConfigPaths = async (rootRaw?: string): Promise<TsConfigPath[]> => {
    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const tsConfigPath = getPathNormalized(root, `./tsconfig-paths.json`);
    const tsConfigText = await readFile(tsConfigPath);
    const tsConfigObj = JSON.parse(tsConfigText) as { compilerOptions: { paths: TsConfigPathsRaw } };
    const { paths: pathsRaw } = tsConfigObj.compilerOptions;
    const paths = toKeyValueArray(pathsRaw).map(x => ({ name: x.key.replace(`/*`, ``), path: x.value[0].replace(`/*`, ``) }));
    return paths;
};

export const isTsconfigPathDirectory = async (fullPath: string) => {
    return directoryContains(fullPath, `./src`);
};

export const generateTsconfigPaths = async (rootRaw?: string) => {

    // const parentSearch = `/code/`;
    // const dir = resolvePath(__dirname).replace(/\\/g, `/`);
    // const i = dir.lastIndexOf(parentSearch);
    // const root = dir.slice(0, Math.max(0, i + parentSearch.length));
    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const rootCode = `${root}/code`;

    const dirs = await getAllDirectories(rootCode);
    const dirsWithSrc = dirs.filter(x => x.endsWith(`/src`)).map(x => x.replace(/\/src$/, ``));
    // const dirsOther = dirs.filter(x => !dirsWithSrc.some(d => x.startsWith(d)));
    const pathDirs: TsConfigPath[] = [...dirsWithSrc.map(x => ({ path: `${x}/src`, name: getDirectoryName(x) }))];

    // {
    //     "compilerOptions": {
    //         "paths": {
    //             "blog/*": [
    //                 "c:/Projects/rick-love-master/code/blog/src/*"
    //             ], 
    // ...
    const paths = piped(pathDirs)
        .pipe(r => r.map(x => ({ key: `${x.name}/*`, value: [`${x.path.replace(`${root}/`, ``)}/*`] })))
        .pipe(r => toKeyValueObject(r))
        .out();

    const tsConfigPath = getPathNormalized(root, `./tsconfig-paths.json`);
    const tsConfigText = await readFile(tsConfigPath);
    const tsConfigObj = JSON.parse(tsConfigText) as { compilerOptions: { paths: TsConfigPathsRaw } };
    tsConfigObj.compilerOptions.paths = paths;
    writeFile(`${tsConfigPath}`, JSON.stringify(tsConfigObj, null, 2));
};

// generateTsconfigPaths();
