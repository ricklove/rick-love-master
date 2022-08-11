/* eslint-disable @typescript-eslint/no-var-requires */
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import * as child_process from 'child_process';
import * as fsRaw from 'fs';
import * as path from 'path';
import { rollup } from 'rollup';
import * as util from 'util';
import { consoleColors } from '@ricklove/utils-core';
import { findInParentPath, joinPathNormalized } from '@ricklove/utils-files';
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
  readFile: util.promisify(fsRaw.readFile),
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
  console.log(`${consoleColors.BgBlue}runBuildFunction: ${funName}${consoleColors.Reset}`);

  try {
    const sourceIndexFile = path.resolve(`${sourceFunDir}${funName}/${fileName}.ts`);
    const destDirPath = path.resolve(`${destFunDir}${funName}`);
    const destIndexFile = path.resolve(`${destFunDir}${funName}/${fileName}.js`);
    const destPackageFile = path.resolve(`${destFunDir}${funName}/package.json`);
    const destPackageLockFile = path.resolve(`${destFunDir}${funName}/package-lock.json`);

    await fs.mkdir(path.dirname(destIndexFile), { recursive: true });
    await fs.mkdir(path.dirname(destPackageFile), { recursive: true });

    const monoRepoNamespace = `@ricklove/`;

    const idLog = [] as {
      id: string;
      // isInTsconfig?: boolean;
      // isInPackages?: boolean;
      isMonoRepo?: boolean;
      isWithoutDot?: boolean;
      isFilePath?: boolean;
      external: boolean;
    }[];
    const bundle = await rollup({
      input: sourceIndexFile,
      output: {
        inlineDynamicImports: true,
      },
      plugins: [
        resolve({
          // extensions,
          // preferBuiltins: true,
        }),
        typescript({
          target: `es2018`,
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
        const isMonoRepo = id.startsWith(monoRepoNamespace);
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

    type ModuleDependencies = undefined | { name: string; version: string }[];
    const getModuleDependencies = async (
      name: string,
      currentPath: string,
      visited: Map<string, ModuleDependencies>,
    ): Promise<ModuleDependencies> => {
      if (visited.has(name)) {
        return visited.get(name);
      }
      // Prevent circular references
      visited.set(name, []);

      const packagePath = await findInParentPath(currentPath, `package.json`, { includeSelf: true });
      // console.log(`\n\n# getModuleDependencies`, { name, packagePath, currentPath });

      if (!packagePath) {
        return undefined;
      }
      const packageJsonRaw = await fs.readFile(packagePath.itemPath, { encoding: `utf-8` });
      const packageJson = JSON.parse(packageJsonRaw) as {
        version?: string;
        dependencies?: { [name: string]: string };
      };

      const dependencyNames = Object.keys(packageJson.dependencies ?? {});
      // console.log(`\t got dependencyNames`, { name, packageJson, packagePath, dependencyNames });

      const externalDependencies = dependencyNames
        .filter((x) => !x.startsWith(monoRepoNamespace))
        .map((k) => ({ name: k, version: packageJson.dependencies?.[k] ?? `` }));

      // console.log(`\t got externalDependencies`, { name, packageJson, externalDependencies });

      const indirectDependencies = [] as NonNullable<ModuleDependencies>;
      for (const d of dependencyNames.filter((x) => x.startsWith(monoRepoNamespace))) {
        const innerPath = path.join(packagePath.dirPath, `node_modules`, d);
        // console.log(`\t getting indirectDependency`, { d, innerPath });

        indirectDependencies?.push(...((await getModuleDependencies(d, innerPath, visited)) ?? []));
      }

      // console.log(`\t got indirectDependencies`, {
      //   name,
      //   packageJson,
      //   packagePath,
      //   externalDependencies,
      //   indirectDependencies,
      // });
      const result = [...externalDependencies, ...indirectDependencies];
      visited.set(name, result);
      return result;
    };

    const externalModulesMap = new Map<string, ModuleDependencies>();
    const allExternalModules = (await getModuleDependencies(funName, process.cwd(), externalModulesMap)) ?? [];
    const externalModules = idLog
      .filter((x) => x.external)
      .map((x) => allExternalModules.find((m) => m.name === x.id)!)
      .filter((x) => x);

    console.log(`${consoleColors.FgBlue}resolved externalModules ${consoleColors.Reset}`, { externalModules });

    const autoIncluded = [`aws-sdk`];
    const packageDeps = Object.fromEntries(
      externalModules.filter((m) => autoIncluded.some((x) => x === m.name)).map((x) => [x.name, x.version]),
    );
    const peerDeps = Object.fromEntries(
      externalModules.filter((m) => autoIncluded.some((x) => x === m.name)).map((x) => [x.name, x.version]),
    );

    const packageText = `
{
    "name": "${funName}",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "dependencies": ${JSON.stringify(packageDeps)},
    "pperDependencies": ${JSON.stringify(peerDeps)},
    "author": "",
    "license": "Private"
}
          `;

    // Write Package
    console.log(`Writing Package ${destPackageFile}`);
    await fs.writeFile(destPackageFile, JSON.stringify(JSON.parse(packageText), null, 2));
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
    await exec(`npm install`, { cwd: destDirPath });

    // const { output } = await bundle.generate({});
  } catch (error) {
    console.error(`Failed to 'rollup' function ${funName}`);
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
