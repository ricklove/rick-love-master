import { ApiError } from 'utils/error';
import { deleteFile, getFileInfo, getFiles, getPathNormalized, readFileAsJson, writeFile } from 'utils/files';
import { LessonModule } from '../../common/lesson-types';
import { LessonModuleMeta, LessonServerApi } from '../lesson-api-types';
import { lessonExperiments_createReplacementProjectState } from '../../common/replacements';
import { calculateFilesHashCode } from '../../common/lesson-hash';


// File Formats
export type LessonModuleFile = LessonModule;
export type LessonModuleMetaFile = LessonModuleMeta;


export const createLessonApiServer_localFileServer = ({
    lessonModuleFileRootPath,
    projectStateRootPath,
}: {
    lessonModuleFileRootPath: string;
    projectStateRootPath: string;
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

    const server: LessonServerApi = {
        getLessonModules: async (data) => {
            const files = await getFiles(lessonModuleFileRootPath, x => x.endsWith(`.code-lesson.meta.json`));
            const lessonInfos = await Promise.all(files.map(async x => await readFileAsJson<LessonModuleMetaFile>(x)));
            return { data: lessonInfos };
        },
        getLessonModule: async (data) => {
            const filePath = getPathNormalized(lessonModuleFileRootPath, `${data.key}.code-lesson.json`);
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

            const fileHistoryPath = getPathNormalized(lessonModuleFileRootPath, `history/${lesson.key}/${Date.now()}.code-lesson.history.json`);
            const filePath = getPathNormalized(lessonModuleFileRootPath, `${lesson.key}.code-lesson.json`);
            const metaPath = getPathNormalized(lessonModuleFileRootPath, `${lesson.key}.code-lesson.meta.json`);

            const fileContents: LessonModuleFile = lesson;
            const metaContents: LessonModuleMetaFile = {
                key: lesson.key,
                title: lesson.title,
            };

            await writeFile(fileHistoryPath, JSON.stringify(fileContents), { overwrite: true });
            await writeFile(filePath, JSON.stringify(fileContents), { overwrite: true });
            await writeFile(metaPath, JSON.stringify(metaContents), { overwrite: true });
            return { data: metaContents };
        },
        deleteLessonModule: async (data) => {
            const filePath = getPathNormalized(lessonModuleFileRootPath, `${data.key}.code-lesson.json`);
            const metaPath = getPathNormalized(lessonModuleFileRootPath, `${data.key}.code-lesson.meta.json`);

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

            const projectStatePath = getPathNormalized(projectStateRootPath, data.projectState.filesHashCode);

            await Promise.all(data.projectState.files.map(async x => {
                await writeFile(getPathNormalized(projectStatePath, `${x.path}`), x.content, { overwrite: true });
            }));

            return { data: {} };
        },
    };
    return server;
};
