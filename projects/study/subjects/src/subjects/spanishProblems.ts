import { StudyProblemBase, StudySubject } from '../types';
import { DefinitionEntry } from './definition-problem-service';
import { createSpanishProblemService } from './spanishEntries';

const subjectKey = `spanish`;
type CategoryBaseKey = 'normal' | 'chat-only';

const toStringCategoryKey = (categoryBaseKey: CategoryBaseKey, sectionKey: string): string => {
  return `${categoryBaseKey}:${sectionKey}`;
};
const parseCategoryKey = (categoryKey: string): { categoryBaseKey: CategoryBaseKey; sectionKey: string } => {
  const [categoryBaseKey, sectionKey] = categoryKey.split(`:`);
  return {
    categoryBaseKey: categoryBaseKey as CategoryBaseKey,
    sectionKey,
  };
};

export type SpanishProblemType = StudyProblemBase<'spanish'> & {
  categoryBaseKey: CategoryBaseKey;
  sectionKey: string;
  word: string;
  wrongChoices: string[];
};

const createSections = () => {
  const problemService = createSpanishProblemService();

  return problemService.sections.map((x) => {
    return {
      sectionKey: x.name.replace(/:/g, `-`),
      sectionName: x.name,
      entries: x.entries,
    };
  });
};

export const createSpanishSubject = (): StudySubject<SpanishProblemType, 'spanish'> => {
  const sections = createSections();

  const getProblemFromEntry = (
    entry: DefinitionEntry,
    categoryBaseKey: CategoryBaseKey,
    sectionKey: string,
    keySuffix: string = ``,
  ): null | SpanishProblemType => {
    const getChoices = () => {
      const section = sections.find((x) => x.sectionKey === sectionKey);
      if (!section) {
        return {
          correctAnswer: entry.response,
          wrongChoices: [entry.response],
        };
      }
      const wrongChoices = section.entries.map((x) => x.response);

      return {
        correctAnswer: entry.response,
        wrongChoices,
      };
    };

    const { correctAnswer, wrongChoices } = getChoices();

    const question = entry.prompt;

    return {
      subjectKey: `spanish`,
      categoryKey: toStringCategoryKey(categoryBaseKey, sectionKey),
      categoryBaseKey,
      sectionKey: sectionKey,
      key: correctAnswer + `:` + keySuffix,
      subjectTitle: `Spanish: ${sectionKey}`,
      question: question,
      questionPreview: question,
      questionPreviewTimeMs: 2000,
      questionPreviewChat: `§k${question}§r`,
      questionPreviewChatTimeMs: 2000,
      correctAnswer: correctAnswer,
      wrongChoices,
      word: question,
    };
  };

  const getNewProblem = (selectedCategories: { categoryKey: string }[]): SpanishProblemType => {
    const randomSelectedCategory =
      selectedCategories[Math.floor(Math.random() * selectedCategories.length)].categoryKey ?? `normal:1`;
    const { categoryBaseKey, sectionKey } = parseCategoryKey(randomSelectedCategory);
    const sectionEntries = sections.find((x) => x.sectionKey === sectionKey)?.entries ?? sections[0].entries;
    const randomEntry = sectionEntries[Math.floor(Math.random() * sectionEntries.length)];
    return getProblemFromEntry(randomEntry, (categoryBaseKey || `normal`) as CategoryBaseKey, sectionKey)!;
  };

  return {
    subjectKey: `spanish`,
    subjectTitle: `Spanish`,
    getNewProblem,
    getWrongChoices: (p) => new Set(p.wrongChoices),
    evaluateAnswer: (p, answer) => {
      const isCorrect = p.correctAnswer.trim().toLowerCase() === answer?.trim().toLowerCase();
      return {
        isCorrect,
        responseMessage: isCorrect ? undefined : `${p.word} = ${p.correctAnswer}`,
      };
    },
    getReviewProblemSequence: (p, reviewLevel) => {
      return [
        // TODO: Reverse order
        // ...p.wordGroup.words.map(x => getProblemFromEntry(x, 'chat-only', p.sectionKey)).filter(x => x?.word !== p.word),
        // Finally the original problem again
        p,
      ]
        .filter((x) => x)
        .map((x) => x!);
    },
    getCategories: () => [
      // ...levels.map(l => ({ subjectKey, categoryKey: 'normal', categoryTitle: `Words: Level ${l.level}` })),
      ...sections.map((l) => ({
        subjectKey,
        categoryKey: toStringCategoryKey(`chat-only`, l.sectionKey),
        categoryTitle: l.sectionName,
      })),
    ],

    // { subjectKey, categoryKey: 'chat-only', categoryTitle: `Words (Chat Speech)` },
    //
  };
};
