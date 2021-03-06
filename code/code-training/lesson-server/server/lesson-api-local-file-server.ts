/* eslint-disable no-await-in-loop */
import { ApiError } from 'utils/error';
import { copyDirectory, deleteFile, getFileInfo, getFiles, getPathNormalized, readFileAsJson, writeFile } from 'utils/files';
import { exec as execRaw } from 'child_process';
import { promisify } from 'util';
import { LessonModule, LessonProjectState } from '../../common/lesson-types';
import { LessonModuleMeta, LessonServerApi } from '../lesson-api-types';
import { lessonExperiments_createReplacementProjectState } from '../../common/replacements';
import { calculateFilesHashCode } from '../../common/lesson-hash';

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
        lesson.lessons.forEach(l => {
            if (l.projectState.filesHashCode) { return; }
            l.projectState.filesHashCode = calculateFilesHashCode(l.projectState.files);
        });
        lesson.lessons.forEach(l => {
            l.experiments.forEach(e => {
                if (e.filesHashCode) { return; }
                const pState = lessonExperiments_createReplacementProjectState(l.projectState, e.replacements);
                e.filesHashCode = pState.filesHashCode;
            });
        });
    };

    const setProjectStateBuildFiles = async (projectState: LessonProjectState) => {
        if (!projectStateRootPath) { throw new ApiError(`projectStateRootPath not setup`, {}); }


        const projectStatePath = getPathNormalized(projectStateRootPath, projectState.filesHashCode);

        await Promise.all(projectState.files.map(async x => {
            await writeFile(getPathNormalized(projectStatePath, `${x.path}`), x.content, { overwrite: true });
        }));
    };

    const buildLessonRender = async (lessonModule: LessonModule) => {
        if (!projectStateRootPath) { throw new ApiError(`projectStateRootPath not setup`, {}); }

        // Remove existing project files
        const files = await getFiles(projectStateRootPath, x => true);
        await Promise.all(files.map(async f => await deleteFile(f)));

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
        const outputSourceDirPath = getPathNormalized(renderProjectRootPath, `build`);
        const renderDestDirPath = getPathNormalized(lessonModuleFileRootPath, `${lessonModule.key}/build`);
        console.log(`buildLessonRender - Copy Files`, { dest: renderDestDirPath, source: outputSourceDirPath });
        await copyDirectory(outputSourceDirPath, renderDestDirPath, { removeExtraFiles: true });

    };

    const server: LessonServerApi = {
        getLessonModules: async (data) => {
            const files = await getFiles(lessonModuleFileRootPath, x => x.endsWith(`.code-lesson.meta.json`));
            const lessonInfos = await Promise.all(files.map(async x => await readFileAsJson<LessonModuleMetaFile>(x)));
            return { data: lessonInfos };
        },
        getLessonModule: async (data) => {
            const filePath = getPathNormalized(lessonModuleFileRootPath, `${data.key}/${data.key}.code-lesson.json`);
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

            const fileHistoryPath = getPathNormalized(lessonModuleFileRootPath, `../history/${lesson.key}/${Date.now()}/code-lesson.history.json`);
            const filePath = getPathNormalized(lessonModuleFileRootPath, `${lesson.key}/${lesson.key}.code-lesson.json`);
            const metaPath = getPathNormalized(lessonModuleFileRootPath, `${lesson.key}/${lesson.key}.code-lesson.meta.json`);

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
            const filePath = getPathNormalized(lessonModuleFileRootPath, `${data.key}/${data.key}.code-lesson.json`);
            const fileContents = await readFileAsJson<LessonModuleFile>(filePath);
            const lesson: LessonModule = fileContents;
            await buildLessonRender(lesson);
            return { data: {} };
        },
        deleteLessonModule: async (data) => {
            const filePath = getPathNormalized(lessonModuleFileRootPath, `${data.key}/${data.key}.code-lesson.json`);
            const metaPath = getPathNormalized(lessonModuleFileRootPath, `${data.key}/${data.key}.code-lesson.meta.json`);

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
