import { promises as fs } from 'fs';
import path from 'path';
import { AppError } from '@ricklove/utils-core';
import { copyFiles } from '@ricklove/utils-files';
import { loadRushJson as loadRushJson, loadRushJsonProjects } from './rush-json';

export const createRushProject = async ({
  destDirPath,
  packageName,
  templatesDirPath,
  templateName,
}: {
  destDirPath: string;
  packageName: string;
  templatesDirPath?: string;
  templateName: string;
}) => {
  if (!templatesDirPath) {
    const rushJsonPath = await loadRushJson(destDirPath);
    if (!rushJsonPath) {
      throw new AppError(`Cannot find rush.json`, { destDirPath });
    }

    templatesDirPath = path.join(path.dirname(rushJsonPath.filePath), `./config/_templates`);
  }

  await createProjectFromTemplate({ destDirPath, packageName, templatesDirPath, templateName });
  await addRushJsonProject({ destDirPath, packageName });
};

const createProjectFromTemplate = async ({
  destDirPath,
  packageName,
  templatesDirPath,
  templateName,
}: {
  destDirPath: string;
  packageName: string;
  templatesDirPath: string;
  templateName: string;
}) => {
  // Find template
  const dirItems = await fs.readdir(templatesDirPath, { withFileTypes: true });
  const templateDirNames = dirItems.filter((x) => x.isDirectory());
  const template = templateDirNames.find((x) => path.basename(x.name).includes(templateName));
  if (!template) {
    throw new AppError(`Cannot find template`, { templateDirNames, templateName });
  }

  // Copy template
  await copyFiles({ destPath: destDirPath, sourcePath: template.name });

  // Fix package.json
  const packageJsonFilePath = path.join(destDirPath, `package.json`);
  const packageJsonContents = await fs.readFile(packageJsonFilePath, { encoding: `utf-8` });

  const packageNameParts = packageName.split(`/`);
  const packageJsonContents_new = packageJsonContents
    .replace(`_template`, packageName)
    .replace(`${packageNameParts[0]}/${packageName}`, packageName);

  await fs.writeFile(packageJsonFilePath, packageJsonContents_new);
};

const addRushJsonProject = async ({ destDirPath, packageName }: { destDirPath: string; packageName: string }) => {
  const result = await loadRushJsonProjects(destDirPath);
  if (!result) {
    throw new AppError(`Cannot find rush.json`, { destDirPath });
  }

  const projectFolder = path
    .resolve(destDirPath)
    .replace(path.dirname(result.rushJsonFilePath), ``)
    .replace(/\\/g, `/`);

  const projectsBefore = result.rushProjects.filter((p) => p.projectFolder < projectFolder);
  const projectBefore = projectsBefore[projectsBefore.length - 1] ?? result.rushProjects[0];

  if (!projectBefore) {
    throw new AppError(`Cannot find any project in rush.json`, { destDirPath });
  }

  const rushJsonContent = await fs.readFile(result.rushJsonFilePath, { encoding: `utf-8` });

  // Find insertion point
  const iProjectBefore = rushJsonContent.indexOf(projectBefore.projectFolder);
  const iBraceClose = rushJsonContent.indexOf(`}`, iProjectBefore);
  const iInsert = iBraceClose + 1;

  const newRushJsonProject = `
  {
    "packageName": "${packageName}",
    "projectFolder": "${projectFolder}"
  },
`;
  const rushJsonContent_after =
    rushJsonContent.substr(0, iInsert) + newRushJsonProject + rushJsonContent.substr(iInsert);

  await fs.writeFile(result.rushJsonFilePath, rushJsonContent_after);
};
