import { getAllDirectories, getPathNormalized, getDirectoryName, readFile, writeFile, getProjectRootDirectoryPath } from 'utils/files';
import { toKeyValueObject, toKeyValueArray } from 'utils/objects';
import { piped } from 'utils/piped';
import { isPackageRootPath } from './package-path';

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

export const generateTsconfigPaths = async (rootRaw?: string) => {

    // const parentSearch = `/code/`;
    // const dir = resolvePath(__dirname).replace(/\\/g, `/`);
    // const i = dir.lastIndexOf(parentSearch);
    // const root = dir.slice(0, Math.max(0, i + parentSearch.length));
    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const rootCode = `${root}/code`;

    const dirs = await getAllDirectories(rootCode);
    const dirs_packageRoot = (await Promise.all(dirs.map(async x => ({ x, isRoot: await isPackageRootPath(x) }))))
        .filter(x => x.isRoot)
        .map(x => x.x);

    const pathDirs: TsConfigPath[] = [...dirs_packageRoot.map(x => ({ path: x, name: getDirectoryName(x) }))];

    // {
    //     "compilerOptions": {
    //         "paths": {
    //             "blog/*": [
    //                 "c:/Projects/rick-love-master/code/blog/src/*"
    //             ], 
    // ...
    const paths = piped(pathDirs)
        .pipe(r => r.map(x => ({ key: `${x.name}/*`, value: [`${x.path.replace(`${root}/`, ``)}/*`] })))
        .pipe(r => r.sort((a, b) => a.key.localeCompare(b.key)))
        .pipe(r => toKeyValueObject(r))
        .out();

    const tsConfigPath = getPathNormalized(root, `./tsconfig-paths.json`);
    const tsConfigText = await readFile(tsConfigPath);
    const tsConfigObj = JSON.parse(tsConfigText) as { compilerOptions: { paths: TsConfigPathsRaw } };
    tsConfigObj.compilerOptions.paths = paths;
    await writeFile(`${tsConfigPath}`, JSON.stringify(tsConfigObj, null, 2), { readonly: true, overwrite: true });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
// generateTsconfigPaths();
