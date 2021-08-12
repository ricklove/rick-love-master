/* eslint-disable @typescript-eslint/no-var-requires */
import * as util from 'util';
import * as fsRaw from 'fs';
import * as path from 'path';
import { rollup } from 'rollup';
import * as child_process from 'child_process';
import { consoleColors } from 'utils/console-colors';
import { cloneToBuildFolder } from './clone';
import { getArtHtml } from './html-template';

const babel = require(`rollup-plugin-babel`);
const resolve = require(`rollup-plugin-node-resolve`);
const includePaths = require(`rollup-plugin-includepaths`);

const fs = {
    exists: util.promisify(fsRaw.exists),
    stat: util.promisify(fsRaw.stat),
    watch: fsRaw.watch,
    copyFile: util.promisify(fsRaw.copyFile),
    readFile: util.promisify(fsRaw.readFile),
    writeFile: util.promisify(fsRaw.writeFile),
    deleteFile: util.promisify(fsRaw.unlink),
    mkdir: util.promisify(fsRaw.mkdir),
    readDir: util.promisify(fsRaw.readdir),
};

const exec = util.promisify(child_process.exec);

const args = process.argv;
console.log(args);

const state = {
    isRunning: false,
    changedFiles: {} as { [path: string]: boolean },
    lastGitIgnore: ``,
    gitIgnoreFileGroups: [] as { sourcePath: string, destintionFilePaths: string[] }[],
};

async function runBuildArt(artInfo: { key: string, absoluteImportPath: string, importObject: string }, destDir: string) {
    console.log(`### runBuildFunction`);
    const artKey = artInfo.key;

    try {
        const fileName = `index`;
        const sourceEntryFile = artInfo.absoluteImportPath;
        const destDirPath = `${destDir}${artKey}`;
        const destIndexFile = `${destDir}${artKey}/${fileName}.js`;
        const destHtmlFile = `${destDir}${artKey}/${fileName}.html`;

        const extensions = [`.js`, `.jsx`, `.ts`, `.tsx`];
        console.log(`Bundling ${artKey}`);

        const packageJson = (await import(`../../package.json`));
        const packageJsonDependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        const external = Object.keys(packageJsonDependencies);
        // console.log(`External: ${external.join(` `)}`);

        // const tsconfigPaths = (await import(`../../tsconfig-paths.json`)).compilerOptions.paths;
        // const allPaths = Object.values(tsconfigPaths).flatMap(x => x).map(x => ROOT + x.replace(/\/\*/, ``));
        // console.log(`allPaths`, { allPaths });

        // //const include = toKeyValueObject(Object.keys(tsconfigPaths).map(k => ({ key: k.replace(/\/\*/, ''), value: ROOT + tsconfigPaths[k as keyof typeof tsconfigPaths][0].replace(/\/\*/, '') })));
        // const include = toKeyValueObject(Object.keys(tsconfigPaths).map(k => ({ key: k.replace(/\/\*/, ''), value: path.resolve(ROOT + tsconfigPaths[k as keyof typeof tsconfigPaths][0].replace(/\/\*/, '')) })));
        // console.log('include', { include });
        // //const exclude = external.map(x => 'node_modules/' + x);

        const idLog = [] as { id: string, isInTsconfig?: boolean, isInPackages?: boolean, isWithoutDot?: boolean, isFilePath?: boolean, external: boolean }[];
        const bundle = await rollup({
            input: sourceEntryFile,
            plugins: [
                // includePaths({
                //     // 'angular': 'bower_components/angular/angular.js'
                //     include,
                //     //paths: ['src/lib', 'src/other'],
                //     // paths: allPaths,
                //     external: [],
                //     extensions: ['.js', '.json', '.html']
                // }),
                resolve({
                    extensions,
                    preferBuiltins: true,
                }),
                babel({
                    // exclude: `node_modules/**`,
                    // exclude,
                    extensions,
                    runtimeHelpers: true,
                    presets: [
                        `@babel/env`,
                        `@babel/typescript`,
                    ],
                    plugins: [
                        // "@babel/plugin-transform-runtime",
                        `@babel/proposal-class-properties`,
                        `@babel/proposal-object-rest-spread`,
                    ],
                }),
            ],
            external: (id) => {
                // const isInTsconfig = !!allPaths.find(x => x.startsWith(id));
                const isInPackages = !!external.find(x => id === x || id.startsWith(`${x}/`));
                const isWithoutDot = !id.startsWith(`.`);
                const isFilePath = id.includes(`.build`);
                const idInfo = {
                    id,
                    // isInTsconfig,
                    // external: !isInTsconfig,
                    isInPackages,
                    isWithoutDot,
                    isFilePath,
                    external: !isFilePath && (isInPackages || isWithoutDot),
                };
                idLog.push(idInfo);
                return idInfo.external;
            },
        });

        //  idLog.forEach(x => console.log(x));
        // console.log(`External Packages: ${idLog.filter(x => x.isInPackages).map(x => x.id).join(` `)}`);
        // console.log(`External Packages (Built-in): ${idLog.filter(x => !x.isInPackages && x.isWithoutDot).map(x => x.id).join(` `)}`);

        const packageDeps = { ...packageJsonDependencies };
        Object.keys(packageJsonDependencies)
            .filter(k => !idLog.find(id => id.id === k))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .forEach(k => delete (packageDeps as any)[k]);

        const packageText = `
{
    "name": "${artKey}",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "dependencies": ${JSON.stringify(packageDeps, null, 2)},
    "devDependencies": {},
    "author": "",
    "license": "Private"
}
          `;


        console.log(`Writing Bundle ${artKey}`);
        const result = await bundle.write({
            file: destIndexFile,
            format: `iife`,
        });

        // Read file and wrap in html template
        const outputJs = await fs.readFile(destIndexFile,{encoding:'utf-8'});
        const outputHtml = getArtHtml(outputJs, artInfo);

        await fs.writeFile(destHtmlFile, outputHtml);

        // Run `npm i` in each folder
        await exec(`npm install`, { cwd: destDirPath });

        // const { output } = await bundle.generate({});
    } catch (error) {
        console.error(`Failed to 'babel-rollup' function ${artKey}`);
        console.error(consoleColors.FgRed, error, consoleColors.Reset);
    }
}

const ROOT = `../../`;

async function runSync(changedFiles: string[]) {
    state.gitIgnoreFileGroups = [];

    // Clone Files to use relative paths
    await cloneToBuildFolder();

    console.log(`--- Files cloned - Starting Rollup ---`);

    // Lambda Functions

    const artIndexFile = `${ROOT}.build/src/code/art/art-index.ts`;
    //const destDir = `${ROOT}projects/blog-art/build/`;
    const destDir = `${ROOT}projects/blog-site/public/art/build/`;

    const artIndexContent = await fs.readFile(artIndexFile, {encoding:'utf-8'});
    const artEntries = [...artIndexContent.matchAll(/key:\s*`([^`]+)`[^>]+>\s*\(await import\s*\(\s*`([^`]+)`\s*\)\)\.(\w+)/g)].map(m => ({
        key: m[1],
        importPath: m[2],
        importObject: m[3],
    })).map(x=>({
        ...x, 
        absoluteImportPath: path.resolve(path.join(path.dirname(artIndexFile), x.importPath)),
    })).map(x=>({
        ...x,
        absoluteImportPathTs: x.absoluteImportPath + '.ts',  
        absoluteImportPathTsx: x.absoluteImportPath + '.tsx',  
    })).map(x=>({
        ...x,
        absoluteImportPath: 
            fsRaw.existsSync(x.absoluteImportPathTs) ? x.absoluteImportPathTs 
            : fsRaw.existsSync(x.absoluteImportPathTsx) ? x.absoluteImportPathTsx 
            : ''
    })).filter(x=>x.absoluteImportPath);
    console.log(`artEntries`,{ artEntries, artIndexFile });

    // --- Functions to Build
    for (const a of artEntries) {
        // eslint-disable-next-line no-await-in-loop
        await runBuildArt(a, destDir);
    }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
runSync([]);
