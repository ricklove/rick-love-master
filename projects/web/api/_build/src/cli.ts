/* eslint-disable @typescript-eslint/no-var-requires */
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import * as child_process from 'child_process';
import * as fsRaw from 'fs';
import * as path from 'path';
import { rollup } from 'rollup';
import * as util from 'util';
import { consoleColors } from '@ricklove/utils-core';
import { joinPathNormalized } from '@ricklove/utils-files';
// import includePaths from `rollup-plugin-includepaths`;

const fs = {
  exists: util.promisify(fsRaw.exists),
  stat: util.promisify(fsRaw.stat),
  watch: fsRaw.watch,
  copyFile: util.promisify(fsRaw.copyFile),
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
  gitIgnoreFileGroups: [] as { sourcePath: string; destintionFilePaths: string[] }[],
};

async function runBuildFunction(sourceFunDir: string, destFunDir: string, funName: string, fileName = `index`) {
  console.log(`### runBuildFunction`);

  try {
    const sourceIndexFile = path.resolve(`${sourceFunDir}${funName}/${fileName}.ts`);
    const destDirPath = path.resolve(`${destFunDir}${funName}`);
    const destIndexFile = path.resolve(`${destFunDir}${funName}/${fileName}.js`);
    const destPackageFile = path.resolve(`${destFunDir}${funName}/package.json`);
    const destPackageLockFile = path.resolve(`${destFunDir}${funName}/package-lock.json`);

    await fs.mkdir(path.dirname(destIndexFile), { recursive: true });
    await fs.mkdir(path.dirname(destPackageFile), { recursive: true });

    const extensions = [`.js`, `.jsx`, `.ts`, `.tsx`];
    console.log(`Bundling ${funName}`, { sourceIndexFile });

    const packageJson = await import(`./lambda-dependencies.json`);
    const packageJsonDependencies = { ...packageJson.default.dependencies };
    const external = Object.keys(packageJsonDependencies);
    console.log(`External: ${external.join(` `)}`, { packageJson });

    // const tsconfigPaths = (await import(`../../tsconfig-paths.json`)).compilerOptions.paths;
    // const allPaths = Object.values(tsconfigPaths).flatMap(x => x).map(x => ROOT + x.replace(/\/\*/, ``));
    // console.log(`allPaths`, { allPaths });

    // //const include = toKeyValueObject(Object.keys(tsconfigPaths).map(k => ({ key: k.replace(/\/\*/, ''), value: ROOT + tsconfigPaths[k as keyof typeof tsconfigPaths][0].replace(/\/\*/, '') })));
    // const include = toKeyValueObject(Object.keys(tsconfigPaths).map(k => ({ key: k.replace(/\/\*/, ''), value: path.resolve(ROOT + tsconfigPaths[k as keyof typeof tsconfigPaths][0].replace(/\/\*/, '')) })));
    // console.log('include', { include });
    // //const exclude = external.map(x => 'node_modules/' + x);

    const idLog = [] as {
      id: string;
      isInTsconfig?: boolean;
      isInPackages?: boolean;
      isWithoutDot?: boolean;
      isFilePath?: boolean;
      external: boolean;
    }[];
    const bundle = await rollup({
      input: sourceIndexFile,
      plugins: [
        resolve({
          // extensions,
          // preferBuiltins: true,
        }),
        typescript({
          declaration: false,
        }),
        // includePaths({
        //     // 'angular': 'bower_components/angular/angular.js'
        //     include,
        //     //paths: ['src/lib', 'src/other'],
        //     // paths: allPaths,
        //     external: [],
        //     extensions: ['.js', '.json', '.html']
        // }),

        // babel({
        //   // exclude: `node_modules/**`,
        //   // exclude,
        //   extensions,
        //   babelHelpers: `bundled`,
        //   presets: [`@babel/env`, `@babel/typescript`],
        //   // plugins: [
        //   //   // "@babel/plugin-transform-runtime",
        //   //   // `@babel/proposal-class-properties`,
        //   //   // `@babel/proposal-object-rest-spread`,
        //   // ],
        // }),
      ],
      external: (id) => {
        // const isInTsconfig = !!allPaths.find(x => x.startsWith(id));
        // const isInPackages = !!external.find((x) => id === x || id.startsWith(`${x}/`));
        const isWithoutDot = !id.startsWith(`.`);
        const isFilePath = path.isAbsolute(id);
        const isMonoRepo = id.startsWith(`@ricklove/`);
        const idInfo = {
          id,
          // isInTsconfig,
          // external: !isInTsconfig,
          // isInPackages,
          isWithoutDot,
          isFilePath,
          // external: !isFilePath && (isInPackages || isWithoutDot),
          isMonoRepo,
          external: !isMonoRepo && isWithoutDot && !isFilePath,
        };
        idLog.push(idInfo);
        return idInfo.external;
      },
    });

    idLog.forEach((x) => console.log(x));
    // console.log(`External Packages: ${idLog.filter(x => x.isInPackages).map(x => x.id).join(` `)}`);
    // console.log(`External Packages (Built-in): ${idLog.filter(x => !x.isInPackages && x.isWithoutDot).map(x => x.id).join(` `)}`);

    const packageDeps = { ...packageJsonDependencies };
    // Object.keys(packageJsonDependencies)
    //   .filter((k) => !idLog.find((id) => id.id === k))
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   .forEach((k) => delete (packageDeps as any)[k]);

    const packageText = `
{
    "name": "${funName}",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "dependencies": ${JSON.stringify(packageDeps, null, 2)},
    "devDependencies": {},
    "author": "",
    "license": "Private"
}
          `;

    // Write Package
    console.log(`Writing Package ${destPackageFile}`);
    await fs.writeFile(destPackageFile, packageText);
    // await fs.writeFile(destServerlessFile, serverlessText);

    console.log(`Writing Bundle ${funName}`);
    const result = await bundle.write({
      file: destIndexFile,
      format: `cjs`,
    });

    state.gitIgnoreFileGroups.push({
      sourcePath: sourceIndexFile,
      destintionFilePaths: [destIndexFile, destPackageFile, destPackageLockFile],
    });

    // Run `npm i` in each folder
    // await exec(`npm install`, { cwd: destDirPath });

    // const { output } = await bundle.generate({});
  } catch (error) {
    console.error(`Failed to 'babel-rollup' function ${funName}`);
    console.error(consoleColors.FgRed, error, consoleColors.Reset);
  }
}

async function runSync(changedFiles: string[]) {
  state.gitIgnoreFileGroups = [];

  // Clone Files to use relative paths
  // await cloneToBuildFolder();

  console.log(`--- Starting Rollup ---`);

  // Lambda Functions
  const buildProjectPath = process.cwd();
  const sourceFunDir = `${buildProjectPath}/src/lambda-functions/`;
  const destFunDir = joinPathNormalized(buildProjectPath, `../_serverless/lambda/`);

  const sourceDirContents = await fs.readDir(sourceFunDir, { withFileTypes: true });
  const functionNames = sourceDirContents.filter((x) => x.isDirectory()).map((x) => x.name);

  // --- Functions to Build
  for (const fun of functionNames) {
    // eslint-disable-next-line no-await-in-loop
    await runBuildFunction(sourceFunDir, destFunDir, fun);
  }

  //     // Update gitIgnore (not needed - entire destination folder is ignored)
  //     const gitIgnoreRootPath = destFunDir;
  //     const gitIgnorePath = `${gitIgnoreRootPath}.gitignore`;

  //     const gitIgnore = state.gitIgnoreFileGroups
  //         .map(x => `# From ${x.sourcePath}
  // ${x.destintionFilePaths
  //                 .map(p => p.replace(gitIgnoreRootPath, ``))
  //                 .join(`
  // `)}
  // `)
  //         .join(`

  // `);
  //     if (gitIgnore !== state.lastGitIgnore) {
  //         state.lastGitIgnore = gitIgnore;
  //         await fs.writeFile(gitIgnorePath, gitIgnore);
  //     }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
runSync([]);
