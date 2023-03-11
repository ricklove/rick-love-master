import { StudyProblemBase, StudySubject } from '../types';
import { getSpellingEntries } from './spellingEntries';

const subjectKey = `spelling`;
type CategoryBaseKey = 'normal' | 'chat-only' | 'next-letter' | 'typing-no-word' | 'typing';

const toStringCategoryKey = (categoryBaseKey: CategoryBaseKey, levelKey: string): string => {
  return `${categoryBaseKey}:${levelKey}`;
};
const parseCategoryKey = (categoryKey: string): { categoryBaseKey: CategoryBaseKey; levelKey: string } => {
  const [categoryBaseKey, levelKey] = categoryKey.split(`:`);
  return {
    categoryBaseKey: categoryBaseKey as CategoryBaseKey,
    levelKey,
  };
};

export type SpellingProblemType = StudyProblemBase<'spelling'> & {
  categoryBaseKey: CategoryBaseKey;
  levelKey: string;
  word: string;
  wrongChoices: string[];
  wordGroup: { words: string[] };
};

const createLevels = (entries: ReturnType<typeof getSpellingEntries>, levelCount = 5) => {
  const levelSize = Math.ceil(entries.length / levelCount);
  const levelEntries = [...new Array(levelCount)].map((_, iLevel) =>
    entries.slice(iLevel * levelSize, (iLevel + 1) * levelSize),
  );
  return levelEntries.map((x, iLevel) => {
    return {
      levelKey: `${iLevel + 1}`,
      entries: x,
    };
  });
};

const getUnderlines = (length: number) => [...new Array(length)].map(() => `_`).join(``);

export const createSpellingSubject = (): StudySubject<SpellingProblemType, 'spelling'> => {
  const spellingEntries = getSpellingEntries();
  const levels = createLevels(spellingEntries);

  const getProblemFromWord = (
    word: string,
    categoryBaseKey: CategoryBaseKey,
    levelKey: string,
    startLength_override?: number,
    keySuffix: string = ``,
  ): null | SpellingProblemType => {
    const entry = spellingEntries.find((x) => x.word === word);
    if (!entry) {
      return null;
    }

    if (categoryBaseKey === `typing` || categoryBaseKey === `typing-no-word`) {
      return {
        subjectKey: `spelling`,
        categoryKey: toStringCategoryKey(categoryBaseKey, levelKey),
        categoryBaseKey,
        levelKey,
        key: word + `:` + categoryBaseKey,
        subjectTitle: `Spell`,
        question: categoryBaseKey === `typing` ? word : `???`,
        questionPreviewChat: `§k${word}§r`,
        questionPreviewChatTimeMs: 1000,
        correctAnswer: word,
        isTyping: true,
        word,
        wrongChoices: [],
        wordGroup: entry.wordGroup,
      };
    }

    const startLength = startLength_override ?? Math.max(1, Math.floor(word.length - 2 - word.length * Math.random()));
    const endLength = word.length - startLength;
    const revealPart = word.substr(0, startLength) + getUnderlines(endLength);

    const getChoices = () => {
      if (categoryBaseKey === `next-letter`) {
        const nextLetter = word[startLength];
        const nextLetterWrongChoices_fromMispellings = entry.mispellings.map((x) => {
          return x[startLength];
        });

        const nextLetterWrongChoices_vowels = `aeiou`.split(``);

        const nextLetterWrongChoices = [...nextLetterWrongChoices_fromMispellings, ...nextLetterWrongChoices_vowels];

        return {
          correctAnswer: nextLetter,
          wrongChoices: nextLetterWrongChoices,
        };
      }

      const guessPart = getUnderlines(startLength) + word.substr(startLength);
      const wrongChoicesAll = entry.mispellings
        .map((x) => {
          return getUnderlines(startLength) + x.substr(startLength);
        })
        .filter((x) => x);

      // Don't include choices that are actually the real word, just split on a duplicate letter
      const wrongChoices = wrongChoicesAll.filter((x) => !word.endsWith(x.replace(/_/g, ``)));

      return {
        correctAnswer: guessPart,
        wrongChoices,
      };
    };

    const { correctAnswer, wrongChoices } = getChoices();

    return {
      subjectKey: `spelling`,
      categoryKey: toStringCategoryKey(categoryBaseKey, levelKey),
      categoryBaseKey,
      levelKey,
      key: word + `:` + startLength + keySuffix,
      subjectTitle: `Spell`,
      question: revealPart,
      questionPreview: categoryBaseKey === `chat-only` || categoryBaseKey === `next-letter` ? undefined : word,
      questionPreviewTimeMs: 3000,
      questionPreviewChat: `§k${word}§r`,
      questionPreviewChatTimeMs: 1000,
      correctAnswer: correctAnswer,
      word,
      wrongChoices,
      wordGroup: entry.wordGroup,
    };
  };

  const getNewProblem = (selectedCategories: { categoryKey: string }[]): SpellingProblemType => {
    const randomSelectedCategory =
      selectedCategories[Math.floor(Math.random() * selectedCategories.length)].categoryKey ?? `normal:1`;
    const { categoryBaseKey, levelKey } = parseCategoryKey(randomSelectedCategory);
    const levelEntries = levels.find((x) => x.levelKey === levelKey)?.entries ?? levels[0].entries;
    const randomEntry = levelEntries[Math.floor(Math.random() * levelEntries.length)];
    return getProblemFromWord(randomEntry.word, (categoryBaseKey || `normal`) as CategoryBaseKey, levelKey)!;
  };

  return {
    subjectKey: `spelling`,
    subjectTitle: `Spelling`,
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
      if (reviewLevel === 0) {
        return [
          // Same word letter by letter
          ...[...new Array(p.word.length)].map((x, i) =>
            getProblemFromWord(p.word, `next-letter`, p.levelKey, i, `next-letter`),
          ),
          // Typing
          getProblemFromWord(p.word, `typing`, p.levelKey),
          // Finally the original problem again
          // p,
        ]
          .filter((x) => x)
          .map((x) => x!);
      }
      if (reviewLevel === 1) {
        return [
          // Same word with decreasing start length: i.e: ___t, ___rt, __art, _tart, start
          //...[...new Array(p.word.length - 1)].map((x, i) => getProblemFromWord(p.word, 'chat-only', p.levelKey, p.word.length - 1 - i, 'decreasing')),
          // Typing
          getProblemFromWord(p.word, `typing-no-word`, p.levelKey),
          // Similar words
          //...p.wordGroup.words.map(x => getProblemFromWord(x, 'chat-only', p.levelKey)).filter(x => x?.word !== p.word),
          // Finally the original problem again
          // p,
        ]
          .filter((x) => x)
          .map((x) => x!);
      }
      return [
        // Similar words
        ...p.wordGroup.words
          .map((x) => getProblemFromWord(x, `chat-only`, p.levelKey))
          .filter((x) => x?.word !== p.word),
        // Finally the original problem again
        p,
      ]
        .filter((x) => x)
        .map((x) => x!);
    },
    getCategories: () => [
      // ...levels.map(l => ({ subjectKey, categoryKey: 'normal', categoryTitle: `Words: Level ${l.level}` })),
      ...levels.map((l) => ({
        subjectKey,
        categoryKey: toStringCategoryKey(`chat-only`, l.levelKey),
        categoryTitle: `Level ${l.levelKey} (speech)`,
      })),
    ],

    // { subjectKey, categoryKey: 'chat-only', categoryTitle: `Words (Chat Speech)` },
    //
  };
};
