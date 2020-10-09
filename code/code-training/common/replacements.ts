import { LessonProjectState, LessonExperimentReplacement } from './lesson-types';

export const lessonExperiments_createReplacementProjectState = (projectState: LessonProjectState, replacements: LessonExperimentReplacement[]): LessonProjectState => {
    return {
        files: projectState.files.map(x => {
            const file = { ...x };
            replacements.filter(r => r.filePath === x.path).forEach(r => { file.content = r.content; });
            return file;
        }),
    };
};
export const lessonExperiments_calculateProjectStateReplacements = (projectState: LessonProjectState, newProjectState: LessonProjectState): { replacements: LessonExperimentReplacement[] } => {
    return {
        replacements: projectState.files.map(x => ({
            oldFile: x,
            newFile: newProjectState.files.find(f => f.path === x.path),
        }))
            .filter(x => x.newFile)
            .map(x => ({
                filePath: x.oldFile.path,
                content: x.newFile?.content ?? ``,
            })),
    };
};
