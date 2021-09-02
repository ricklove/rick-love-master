import path from 'path';
import { AppError } from '@ricklove/utils-core';
import { createRushProject } from './create-rush-project';

export const cli = async () => {
  console.log(`rush-packages`);

  const argv = process.argv;
  // const argFull = argv.includes(`--f`) || argv.includes(`--full`);
  // const argCoverage = (argv.includes(`--c`) || argv.includes(`--coverage`));
  const argDestDir =
    argv.includes(`--d`) || argv.includes(`--dest`)
      ? argv.slice(argv.findIndex((a) => a.startsWith(`--d`)) + 1)[0]
      : undefined;
  const argPackageName =
    argv.includes(`--p`) || argv.includes(`--package`)
      ? argv.slice(argv.findIndex((a) => a.startsWith(`--p`)) + 1)[0]
      : undefined;
  const argTemplateName =
    argv.includes(`--t`) || argv.includes(`--template`)
      ? argv.slice(argv.findIndex((a) => a.startsWith(`--t`)) + 1)[0]
      : undefined;

  const command = `create`;

  if (command === `create`) {
    const getDestArgs = () => {
      if (!argDestDir) {
        throw new AppError(`Must provide a destDirPath`);
        // return { packageName: argPackageName, destDirPath: process.cwd() };
      }
      if (!argPackageName) {
        return { packageName: path.basename(argDestDir), destDirPath: path.dirname(argDestDir) };
        // return { packageName: path.basename(process.cwd()), destDirPath: path.dirname(process.cwd()) };
      }
      return { packageName: argPackageName, destDirPath: path.resolve(argDestDir) };
    };
    const { packageName, destDirPath } = getDestArgs();
    const templateName = argTemplateName || `lib`;

    await createRushProject({
      destDirPath,
      packageName,
      templateName,
    });
  }
};
