import { AppError } from '@ricklove/utils-core';
import { findInParentPath } from '@ricklove/utils-files';

export const getWebProjectPath = async () => process.cwd();
export const getMonoRepoRoot = async () => {
  const cwd = process.cwd();
  const result = await findInParentPath(cwd, `rush.json`);
  if (!result) {
    throw new AppError(`getProjectRoot fail`, { cwd });
  }
  return result.dirPath;
};
