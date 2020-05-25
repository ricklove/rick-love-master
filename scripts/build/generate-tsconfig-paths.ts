import { getAllDirectories, getPathNormalized, getDirectoryName, readFile, writeFile, getProjectRootDirectoryPath, directoryContains } from 'utils/files';
import { toKeyValueObject } from 'utils/objects';
import { piped } from 'utils/piped';

export const isTsconfigPathDirectory = (fullPath: string) => {
    return directoryContains(fullPath, `./src`);
};

export const generateTsconfigPaths = async (rootRaw?: string) => {

    // const parentSearch = `/code/`;
    // const dir = resolvePath(__dirname).replace(/\\/g, `/`);
    // const i = dir.lastIndexOf(parentSearch);
    // const root = dir.slice(0, Math.max(0, i + parentSearch.length));
    const root = getPathNormalized(rootRaw ?? getProjectRootDirectoryPath(__dirname));
    const rootCode = `${root}/code`;

    const dirs = await getAllDirectories(rootCode);
    const dirsWithSrc = dirs.filter(x => x.endsWith(`/src`)).map(x => x.replace(/\/src$/, ``));
    // const dirsOther = dirs.filter(x => !dirsWithSrc.some(d => x.startsWith(d)));
    const pathDirs = [...dirsWithSrc.map(x => ({ path: `${x}/src`, name: getDirectoryName(x) }))];

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
    const tsConfigObj = JSON.parse(tsConfigText) as { compilerOptions: { paths: typeof paths } };
    tsConfigObj.compilerOptions.paths = paths;
    writeFile(`${tsConfigPath}`, JSON.stringify(tsConfigObj, null, 2));
};

// generateTsconfigPaths();
