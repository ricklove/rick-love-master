import { distinct, distinct_key, shuffle } from '@ricklove/utils-core';
import { ProblemAnswer, ProblemResult, ProblemService } from './problems-service';

export type DefinitionSubject = { subjectName: string; sections: DefinitionSection[] };
export type DefinitionSection = { name: string; entries: DefinitionEntry[] };
export type DefinitionEntry = { prompt: string; response: string };
export const createDefinitionProblemService = ({
  subject,
  maxAnswers = 4,
  onQuestion,
  onQuestionReverse,
}: {
  subject: DefinitionSubject;
  maxAnswers?: number;
  onQuestion?: (question: string) => void;
  onQuestionReverse?: (question: string) => void;
}): ProblemService => {
  // console.log(`createDefinitionProblemService`, { subject });

  let state = {
    isReversed: false,
    iSection: null as null | number,
    iNext: null as null | number,
    completedSectionKeys: [] as string[],
  };

  const reversedPrefix = `Reversed - `;
  const getSectionKey = (name: string, isReversed: boolean) => {
    return !isReversed ? name : `${reversedPrefix}${name}`;
  };

  const problemService: ProblemService = {
    load: async (storage) => {
      const loaded = await storage.load<typeof state>();
      if (loaded) {
        // eslint-disable-next-line require-atomic-updates
        state = loaded;
      }
    },
    save: async (storage) => {
      await storage.save(state);
    },
    getSections: () => [
      ...subject.sections.map((x) => ({
        key: getSectionKey(x.name, false),
        name: getSectionKey(x.name, false),
        isComplete: state.completedSectionKeys.includes(getSectionKey(x.name, false)),
      })),
      ...subject.sections.map((x) => ({
        key: getSectionKey(x.name, true),
        name: getSectionKey(x.name, true),
        isComplete: state.completedSectionKeys.includes(getSectionKey(x.name, true)),
      })),
    ],
    gotoSection: ({ key }) => {
      const isRev = key.startsWith(reversedPrefix);
      const n = isRev ? key.substr(reversedPrefix.length) : key;
      state.iSection = subject.sections.findIndex((x) => x.name === n);
      state.iNext = 0;
      state.isReversed = isRev;
    },
    getNextProblem: (): ProblemResult => {
      if (state.iSection == null) {
        // Prompt section?
        state.iSection = 0;
        state.iNext = null;
      }
      if ((state.iNext ?? 0) >= (subject.sections[state.iSection]?.entries.length ?? 0)) {
        state.iSection++;
        state.iNext = null;
      }
      if (state.iSection >= subject.sections.length) {
        state.iSection = 0;
        state.iNext = null;
        state.isReversed = !state.isReversed;
      }
      if (state.iNext == null) {
        state.iNext = 0;
      }

      const section = subject.sections[state.iSection];
      const defRaw = section.entries[state.iNext];
      if (!defRaw) {
        return { done: true, key: `done` };
      }

      const prob = state.isReversed
        ? { question: defRaw.response, anwer: defRaw.prompt }
        : { question: defRaw.prompt, anwer: defRaw.response };

      const wrongAnswerCount = maxAnswers - 1;
      const wrongAnswers = distinct(
        shuffle(
          section.entries
            .slice(Math.max(0, state.iNext - 10), state.iNext + 10)
            .map((x) => (state.isReversed ? x.prompt : x.response))
            .filter((x) => x !== prob.anwer),
        ),
      ).slice(0, wrongAnswerCount);

      const answers: ProblemAnswer[] = shuffle([
        ...wrongAnswers.map((x) => ({ value: `${x}`, isCorrect: false })),
        { value: `${prob.anwer}`, isCorrect: true },
      ]).map((x) => ({ ...x, key: x.value }));

      const isLastOfSection = state.iNext === section.entries.length - 1;
      const isLastOfSubject = isLastOfSection && state.iSection === subject.sections.length - 1;
      state.iNext++;
      return {
        key: `${prob.question}`,
        question: prob.question,
        onQuestion: state.isReversed ? () => onQuestionReverse?.(prob.question) : () => onQuestion?.(prob.question),
        answers,
        sectionKey: getSectionKey(section.name, state.isReversed),
        isLastOfSection,
        isLastOfSubject,
      };
    },
    recordAnswer: (problem, answer) => {
      if (answer.isCorrect && problem.isLastOfSection) {
        state.completedSectionKeys.push(problem.sectionKey);
      }
    },
  };

  return problemService;
};

export const parseDefinitionDocument = (documentText: string, subjectName: string): DefinitionSubject => {
  const lines = documentText
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x);
  const sections = [] as DefinitionSection[];
  sections.push({ name: `[Start]`, entries: [] });
  let section = sections[0];

  for (const l of lines) {
    const parts = l.split(`\t`);
    // console.log(`line`, { l, parts });
    if (parts.length === 1) {
      sections.push({ name: parts[0].trim(), entries: [] });
      section = sections[sections.length - 1];
    }
    if (parts.length >= 2) {
      section.entries.push({ prompt: parts[0].trim(), response: parts[1].trim() });
    }
  }

  // Remove duplicates
  sections.forEach((s) => {
    s.entries = distinct_key(s.entries, (x) => x.prompt);
  });

  const sectionsCleaned = sections.filter((x) => x.entries.length > 0);
  return { subjectName, sections: sectionsCleaned };
};
