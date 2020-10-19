import { hashCode } from 'utils/hash-code';
import { LessonProjectState } from './lesson-types';

export const caclulateFilesHash = (files: LessonProjectState['files']) => {
    const allText = files.map(x => `${x.content}:${x.path}:${x.language}::`).join(``);
    return `${hashCode(allText)}`;
};
