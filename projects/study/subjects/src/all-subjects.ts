import { createMathSubject } from './subjects/mathProblems';
import { createSpanishSubject } from './subjects/spanishProblems';
import { createSpellingSubject } from './subjects/spellingProblems';
import { StudyProblemType, StudySubject } from './types';

export const allSubjects = [createMathSubject(), createSpellingSubject(), createSpanishSubject()];
export const getSubject = (
  subjectKey: StudyProblemType['subjectKey'],
): StudySubject<StudyProblemType, typeof subjectKey> => {
  return allSubjects.find((s) => s.subjectKey === subjectKey) ?? allSubjects[0];
};
