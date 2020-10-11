import { ApiError } from 'utils/error';
import { deleteFile, getFileInfo, getFiles, getPathNormalized, readFileAsJson, writeFile } from 'utils/files';
import { LessonModule } from '../../common/lesson-types';
import { LessonModuleMeta, LessonServerApi } from '../lesson-api-types';


// File Formats
export type LessonModuleFile = LessonModule;
export type LessonModuleMetaFile = LessonModuleMeta;


export const createLessonApiServer_localFileServer = ({
    lessonModuleFileRootPath,
}: {
    lessonModuleFileRootPath: string;
}): LessonServerApi => {

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
            return { data: lesson };
        },
        setLessonModule: async (data) => {
            const fileHistoryPath = getPathNormalized(lessonModuleFileRootPath, `history/${data.value.key}/${Date.now()}.code-lesson.history.json`);
            const filePath = getPathNormalized(lessonModuleFileRootPath, `${data.value.key}.code-lesson.json`);
            const metaPath = getPathNormalized(lessonModuleFileRootPath, `${data.value.key}.code-lesson.meta.json`);

            const fileContents: LessonModuleFile = data.value;
            const metaContents: LessonModuleMetaFile = {
                key: data.value.key,
                title: data.value.title,
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
    };
    return server;
};
