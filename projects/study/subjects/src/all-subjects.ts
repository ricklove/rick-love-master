import { createMathSubject, MathProblemType } from './subjects/mathProblems';
import { createSpanishSubject, SpanishProblemType } from './subjects/spanishProblems';
import { createSpellingSubject, SpellingProblemType } from './subjects/spellingProblems';
import { StudySubject } from './types';

export type StudyProblemType = MathProblemType | SpellingProblemType | SpanishProblemType;
export const allSubjects = [createMathSubject(), createSpellingSubject(), createSpanishSubject()];
export const getSubject = (
  subjectKey: StudyProblemType['subjectKey'],
): StudySubject<StudyProblemType, typeof subjectKey> => {
  return allSubjects.find((s) => s.subjectKey === subjectKey) as StudySubject<StudyProblemType, typeof subjectKey>;
};
