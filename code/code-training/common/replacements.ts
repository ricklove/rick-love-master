import { diff } from './diff';
import { calculateFilesHashCode } from './lesson-hash';
import { LessonProjectState, LessonExperimentReplacement } from './lesson-types';

export const lessonExperiments_createReplacementProjectState = (projectState: LessonProjectState, replacements: LessonExperimentReplacement[]): LessonProjectState => {
    const files = projectState.files.map(x => {
        const file = { ...x };
        replacements
            .filter(r => r.selection.filePath === x.path)
            // Apply replacements from end so the index will be valid
            .sort((a, b) => - (a.selection.index - b.selection.index))
            .forEach(r => { file.content = `${file.content.substr(0, r.selection.index)}${r.content}${file.content.substr(r.selection.index + r.selection.length)}`; });
        return file;
    });

    const finalProjectState: LessonProjectState = {
        files,
        filesHashCode: calculateFilesHashCode(files),
    };

    console.log(`lessonExperiments_createReplacementProjectState`, finalProjectState, projectState, replacements);
    return finalProjectState;
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
            // _change: x.change,
            selection: { filePath: x.filePath, index: x.change.a.change.start, length: x.change.a.change.length },
            content: (x.change.b?.change.length ?? 0) === 0 ? `` : x.change.b?.change.toText() ?? ``,
        }));

    console.log(`lessonExperiments_calculateProjectStateReplacements`, replacements, projectState, newProjectState);
    return { replacements };
};


// const runTests = () => {
//     const testRoundTrip = (fileStart: string, fileEnd: string) => {
//         console.log(`testRoundTrip`, { fileStart, fileEnd });

//         const projectStart: LessonProjectState = {
//             files: [{ content: fileStart, language: `tsx`, path: `./test.tsx` }],
//         };
//         const projectEnd: LessonProjectState = {
//             files: [{ content: fileEnd, language: `tsx`, path: `./test.tsx` }],
//         };
//         const { replacements } = lessonExperiments_calculateProjectStateReplacements(projectStart, projectEnd);
//         const actualProjectEnd = lessonExperiments_createReplacementProjectState(projectStart, replacements);

//         if (fileEnd === actualProjectEnd.files[0].content) {
//             console.log(`PASS`, { expected: fileEnd, actual: actualProjectEnd.files[0].content });
//             return true;
//         }

//         console.error(`FAIL`, { expected: fileEnd, actual: actualProjectEnd.files[0].content });
//         return false;
//     };

//     let failCount = 0;
//     failCount += !testRoundTrip(`Test`, `Test`) ? 1 : 0;
//     failCount += !testRoundTrip(`Test\r\n`, `Test\r\n`) ? 1 : 0;
//     failCount += !testRoundTrip(`Test`, `123`) ? 1 : 0;
//     failCount += !testRoundTrip(`Test\r\n`, `Test`) ? 1 : 0;
//     failCount += !testRoundTrip(`Test`, `Test\r\n`) ? 1 : 0;
//     failCount += !testRoundTrip(`A\r\nTest\r\n123\r\nB`, `A\r\n123\r\nTest\r\nB`) ? 1 : 0;
//     failCount += !testRoundTrip(`Test`, `123\r\nTest`) ? 1 : 0;
//     failCount += !testRoundTrip(`Test`, `Test\r\n123`) ? 1 : 0;
//     failCount += !testRoundTrip(`123\r\nTest`, `Test`) ? 1 : 0;
//     failCount += !testRoundTrip(`Test\r\n123`, `Test`) ? 1 : 0;
//     failCount += !testRoundTrip(`Test\n123`, `123\nTest`) ? 1 : 0;
//     failCount += !testRoundTrip(`Test`, `123\nTest`) ? 1 : 0;
//     failCount += !testRoundTrip(`Test`, `Test\n123`) ? 1 : 0;
//     failCount += !testRoundTrip(`123\nTest`, `Test`) ? 1 : 0;
//     failCount += !testRoundTrip(`Test\n123`, `Test`) ? 1 : 0;

//     console.log(`FailCount`, { failCount });
//     const breakdance = true;
// };
// runTests();
