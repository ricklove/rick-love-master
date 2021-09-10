/* eslint-disable no-await-in-loop */
import { exec as execRaw } from 'child_process';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import {
  calculateFilesHashCode,
  lessonExperiments_createReplacementProjectState,
  LessonModule,
  LessonProjectState,
} from '@ricklove/code-training-lesson-common';
import { LessonModuleMeta, LessonServerApi } from '@ricklove/code-training-lesson-editor-common';
import { ApiError } from '@ricklove/utils-core';
import { copyFiles, getAllFiles, joinPathNormalized } from '@ricklove/utils-files';

// Compatibility with old file utils
const writeFile = async (filePath: string, content: string, _options: { overwrite: true }) =>
  await fs.writeFile(filePath, content);
const deleteFile = async (filePath: string) => await fs.unlink(filePath);
const getFiles = async (dirPath: string, predicate: (file: string) => boolean) => {
  const allFiles = await getAllFiles(dirPath);
  return allFiles.filter(predicate);
};
const getFileInfo = fs.stat;
const readFileAsJson = async <T>(filePath: string) => {
  const content = await fs.readFile(filePath, { encoding: `utf-8` });
  return JSON.parse(content) as T;
};
const copyDirectory = async (sourcePath: string, destPath: string, _options: { removeExtraFiles: true }) => {
  await fs.rmdir(destPath, { recursive: true });
  await copyFiles({ sourcePath, destPath });
};

const exec = promisify(execRaw);

// File Formats
export type LessonModuleFile = LessonModule;
export type LessonModuleMetaFile = LessonModuleMeta;

export const createLessonApiServer_localFileServer = ({
  lessonModuleFileRootPath,
  projectStateRootPath,
  renderProjectRootPath,
}: {
  lessonModuleFileRootPath: string;
  projectStateRootPath: string;
  renderProjectRootPath: string;
}): LessonServerApi => {
  const normalizeFileHashes = (lesson: LessonModule) => {
    // Normalize projectState hashes
    lesson.lessons.forEach((l) => {
      if (l.projectState.filesHashCode) {
        return;
      }
      l.projectState.filesHashCode = calculateFilesHashCode(l.projectState.files);
    });
    lesson.lessons.forEach((l) => {
      l.experiments.forEach((e) => {
        if (e.filesHashCode) {
          return;
        }
        const pState = lessonExperiments_createReplacementProjectState(l.projectState, e.replacements);
        e.filesHashCode = pState.filesHashCode;
      });
    });
  };

  const setProjectStateBuildFiles = async (projectState: LessonProjectState) => {
    if (!projectStateRootPath) {
      throw new ApiError(`projectStateRootPath not setup`, {});
    }

    const projectStatePath = joinPathNormalized(projectStateRootPath, projectState.filesHashCode);

    await Promise.all(
      projectState.files.map(async (x) => {
        await writeFile(joinPathNormalized(projectStatePath, `${x.path}`), x.content, { overwrite: true });
      }),
    );
  };

  const buildLessonRender = async (lessonModule: LessonModule) => {
    if (!projectStateRootPath) {
      throw new ApiError(`projectStateRootPath not setup`, {});
    }

    // Remove existing project files
    const files = await getFiles(projectStateRootPath, (x) => true);
    await Promise.all(files.map(async (f) => await deleteFile(f)));

    // Copy project files
    for (const l of lessonModule.lessons) {
      await setProjectStateBuildFiles(l.projectState);
      for (const e of l.experiments) {
        const eProjectState = lessonExperiments_createReplacementProjectState(l.projectState, e.replacements);
        await setProjectStateBuildFiles(eProjectState);
      }
    }

    // Build
    console.log(`buildLessonRender - BUILDING yarn build`, { cwd: renderProjectRootPath });
    await exec(`yarn build`, { cwd: renderProjectRootPath });

    // Copy to build folder
    const outputSourceDirPath = joinPathNormalized(renderProjectRootPath, `build`);
    const renderDestDirPath = joinPathNormalized(lessonModuleFileRootPath, `${lessonModule.key}/build`);
    console.log(`buildLessonRender - Copy Files`, { dest: renderDestDirPath, source: outputSourceDirPath });
    await copyDirectory(outputSourceDirPath, renderDestDirPath, { removeExtraFiles: true });
  };

  const server: LessonServerApi = {
    getLessonModules: async (_data) => {
      const files = await getFiles(lessonModuleFileRootPath, (x) => x.endsWith(`.code-lesson.meta.json`));
      const lessonInfos = await Promise.all(files.map(async (x) => await readFileAsJson<LessonModuleMetaFile>(x)));
      return { data: lessonInfos };
    },
    getLessonModule: async (data) => {
      const filePath = joinPathNormalized(lessonModuleFileRootPath, `${data.key}/${data.key}.code-lesson.json`);
      const fileInfo = await getFileInfo(filePath);
      if (!fileInfo) {
        throw new ApiError(`File not found`, { requestData: data });
      }

      const lesson = await readFileAsJson<LessonModuleFile>(filePath);
      normalizeFileHashes(lesson);

      return { data: lesson };
    },
    setLessonModule: async (data) => {
      const lesson = data.value;
      normalizeFileHashes(lesson);

      const fileHistoryPath = joinPathNormalized(
        lessonModuleFileRootPath,
        `../history/${lesson.key}/${Date.now()}/code-lesson.history.json`,
      );
      const filePath = joinPathNormalized(lessonModuleFileRootPath, `${lesson.key}/${lesson.key}.code-lesson.json`);
      const metaPath = joinPathNormalized(
        lessonModuleFileRootPath,
        `${lesson.key}/${lesson.key}.code-lesson.meta.json`,
      );

      const fileContents: LessonModuleFile = lesson;
      const metaContents: LessonModuleMetaFile = {
        key: lesson.key,
        title: lesson.title,
      };

      await writeFile(fileHistoryPath, JSON.stringify(fileContents), { overwrite: true });
      await writeFile(filePath, JSON.stringify(fileContents), { overwrite: true });
      await writeFile(metaPath, JSON.stringify(metaContents), { overwrite: true });

      // Build Lesson Render Output
      // await buildLessonRender(data.value);

      return { data: metaContents };
    },
    buildLessonModule: async (data) => {
      const filePath = joinPathNormalized(lessonModuleFileRootPath, `${data.key}/${data.key}.code-lesson.json`);
      const fileContents = await readFileAsJson<LessonModuleFile>(filePath);
      const lesson: LessonModule = fileContents;
      await buildLessonRender(lesson);
      return { data: {} };
    },
    deleteLessonModule: async (data) => {
      const filePath = joinPathNormalized(lessonModuleFileRootPath, `${data.key}/${data.key}.code-lesson.json`);
      const metaPath = joinPathNormalized(lessonModuleFileRootPath, `${data.key}/${data.key}.code-lesson.meta.json`);

      await deleteFile(filePath);
      await deleteFile(metaPath);
      return { data: {} };
    },
    setProjectState: async (data) => {
      if (!projectStateRootPath) {
        throw new ApiError(`projectStateRootPath not setup`, { requestData: data });
      }
      // TODO: Delete existing files
      // const files = await getFiles(projectStateRootPath, x=>true);
      // await deleteFile(filePath);
      // await deleteFile(metaPath);
      await setProjectStateBuildFiles(data.projectState);

      return { data: {} };
    },
  };
  return server;
};
