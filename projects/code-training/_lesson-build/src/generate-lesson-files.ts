import { promises as fs } from 'fs';
import { createLessonApiServer_localFileServer } from '@ricklove/code-training-lesson-editor-local-server';
import { copyFiles, getAllFiles, joinPathNormalized } from '@ricklove/utils-files';

export const generateLessonFiles = async ({
  lessonModulesSourceDir,
  publicDestDir,
  webRoute,
}: {
  lessonModulesSourceDir: string;
  publicDestDir: string;
  webRoute: string;
}) => {
  console.log(`createLessonModules`);

  await copyFiles({ sourcePath: lessonModulesSourceDir, destPath: publicDestDir });

  const server = createLessonApiServer_localFileServer({
    lessonModuleFileRootPath: lessonModulesSourceDir,
    projectStateRootPath: joinPathNormalized(lessonModulesSourceDir, `../templates/cra-template/src/project/`),
    renderProjectRootPath: joinPathNormalized(lessonModulesSourceDir, `../templates/cra-template`),
  });
  const lessonModules = await server.getLessonModules({});

  // FIX /APP_ROOT_PATH
  for (const l of lessonModules.data) {
    const lessonRelativePath = `${l.key}/build`;
    const webPath = `${webRoute}/${lessonRelativePath}`;
    const lessonBuildDir = joinPathNormalized(publicDestDir, lessonRelativePath);

    console.log(`createLessonModules - Fix APP_ROOT_PATH`, { webPath, lessonBuildDir, l });

    const allFiles = await getAllFiles(lessonBuildDir);
    for (const f of allFiles) {
      const fileContent = await fs.readFile(f, { encoding: `utf-8` });
      const corrected = fileContent.replace(/APP_ROOT_PATH/g, webPath);
      await fs.writeFile(f, corrected);
    }
  }

  const lessonModuleList = lessonModules.data;
  return {
    lessonModules: lessonModuleList.map((x) => ({
      key: x.key,
      title: x.title,
    })),
  };

  //   lessonModuleList.forEach((x) => {
  //     pages.push({
  //       sitePath: `/lessons/${x.key}`,
  //       data: { componentLessonModulePage: { lessonModuleKey: x.key, lessonModuleTitle: x.title } },
  //     });
  //   });

  //   // Add index
  //   lessonModuleList.forEach((x) => {
  //     pages.push({
  //       sitePath: `/lessons`,
  //       data: {
  //         componentLessonListPage: {
  //           lessons: lessonModuleList.map((p) => ({
  //             sitePath: `/lessons/${p.key}`,
  //             lessonModuleKey: p.key,
  //             lessonModuleTitle: p.title,
  //           })),
  //         },
  //       },
  //     });
  //   });
};
