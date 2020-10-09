import { diff } from './diff';
import { LessonProjectState, LessonExperimentReplacement } from './lesson-types';

export const lessonExperiments_createReplacementProjectState = (projectState: LessonProjectState, replacements: LessonExperimentReplacement[]): LessonProjectState => {
    return {
        files: projectState.files.map(x => {
            const file = { ...x };
            replacements
                .filter(r => r.selection.filePath === x.path)
                // Apply replacements from end so the index will be valid
                .sort((a, b) => - (a.selection.index - b.selection.index))
                .forEach(r => { file.content = `${file.content.substr(0, r.selection.index)}${r.content}${file.content.substr(r.selection.index + r.selection.length)}`; });
            return file;
        }),
    };
};
export const lessonExperiments_calculateProjectStateReplacements = (projectState: LessonProjectState, newProjectState: LessonProjectState): { replacements: LessonExperimentReplacement[] } => {

    const replacements = projectState.files.map(x => ({
        oldFile: x,
        newFile: newProjectState.files.find(f => f.path === x.path),
    }))
        .filter(x => x.newFile)
        .map(x => ({
            filePath: x.oldFile.path,
            changes: diff(x.oldFile.content, x.newFile?.content ?? ``).changes,
        }))
        .flatMap(x => x.changes.map(c => ({
            filePath: x.filePath,
            change: c,
        })))
        .map(x => ({
            selection: !x.change.a
                ? { filePath: x.filePath, index: x.change.b?.bChange.start ?? 0, length: 0 }
                : { filePath: x.filePath, index: x.change.a.aChange.start, length: x.change.a.aChange.length },
            content: (x.change.b?.bChange.length ?? 0) === 0 ? `` : x.change.b?.bChange.toText() ?? ``,
        }));

    console.log(`lessonExperiments_calculateProjectStateReplacements`, replacements);

    return { replacements };
};
