import { createMathSubject, MathProblemType } from './subjects/mathProblems';
import { createSpanishSubject, SpanishProblemType } from './subjects/spanishProblems';
import { createSpellingSubject, SpellingProblemType } from './subjects/spellingProblems';
import { StudySubject } from './types';

export type StudyProblemType = MathProblemType | SpellingProblemType | SpanishProblemType;
const allSubjectImports = {
  math: {
    title: `Math`,
    load: async () => createMathSubject(),
    // load: async () => (await import(`./subjects/mathProblems`)).createMathSubject(),
  },
  spelling: {
    title: `Spelling`,
    load: async () => createSpellingSubject(),
    // load: async () => (await import(`./subjects/spellingProblems`)).createSpellingSubject(),
  },
  spanish: {
    title: `Spanish`,
    load: async () => createSpanishSubject(),
    // load: async () => (await import(`./subjects/spanishProblems`)).createSpanishSubject(),
  },
} as const;
export const allSubjects = Object.entries(allSubjectImports).map(([subjectKey, v]) => ({
  subjectKey: subjectKey as StudyProblemType['subjectKey'],
  subjectTitle: v.title,
  loadSubject: v.load,
}));
export type StudySubjectTypes = Awaited<ReturnType<typeof allSubjects[number][`loadSubject`]>>;

export const getSubject = async (
  subjectKey: StudyProblemType['subjectKey'],
): Promise<StudySubject<StudyProblemType, typeof subjectKey>> => {
  return (await allSubjectImports[subjectKey].load()) as StudySubject<StudyProblemType, typeof subjectKey>;
};
