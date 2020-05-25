import { getAllDirectories, resolvePath, getDirectoryName } from 'utils/files';
import { toKeyValueObject } from 'utils/objects';
import { piped } from 'utils/piped';

export const run = async () => {

    // const parentSearch = `/code/`;
    // const dir = resolvePath(__dirname).replace(/\\/g, `/`);
    // const i = dir.lastIndexOf(parentSearch);
    // const root = dir.slice(0, Math.max(0, i + parentSearch.length));
    const root = resolvePath(__dirname, `../code`).replace(/\\/g, `/`);

    const dirs = (await getAllDirectories(root)).map(x => x.replace(/\\/g, `/`));
    const dirsWithSrc = dirs.filter(x => x.endsWith(`/src`)).map(x => x.replace(/\/src$/, ``));
    // const dirsOther = dirs.filter(x => !dirsWithSrc.some(d => x.startsWith(d)));
    const pathDirs = [...dirsWithSrc.map(x => ({ path: x, name: getDirectoryName(x) }))];

    // "paths": {
    //     "console-simulator/*": ["code/games/console-simulator/src/*"],
    //     "dork/*": ["code/games/dork/src/*"],
    //     "utils/*": ["code/utils/src/*"]
    // }
    const paths = piped(pathDirs)
        .pipe(r => r.map(x => ({ key: `${x.name}/*`, value: [`${x.path}/*`] })))
        .pipe(r => toKeyValueObject(r))
        .out();

    const breakdance = true;

};

run();

console.log(`run!`);
