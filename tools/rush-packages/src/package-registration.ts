import path from 'path';
import { loadRushJsonProjects } from './rush-json';

type PackageRegistration = { packageName: string; packagePath: string };
export const loadPackageRegistration = async (currentPath: string): Promise<null | PackageRegistration[]> => {
  return await loadPackageRegistration_rush(currentPath);
};

const loadPackageRegistration_rush = async (currentPath: string) => {
  const result = await loadRushJsonProjects(currentPath);
  if (!result) {
    return null;
  }

  // showMessage(`DEBUG: parsed rush.json: ${rushProjects.map((x) => x.packageName).join(`, `)}`);
  return result.rushProjects.map((x) => ({
    packageName: x.packageName,
    packagePath: path.resolve(path.join(path.dirname(result.rushJsonFilePath), x.projectFolder)),
  }));
};
