import type { StudyProblemType } from './all-subjects';

export type StudyProblemAnswer = {
  wasCorrect: boolean;
  answerRaw: string | undefined;
  responseMessage?: string | undefined;
  problem: StudyProblemType;
  time: Date;
  timeToAnswerMs: number;
};

export type StudyProblemBase<TSubjectKey extends string> = {
  subjectKey: TSubjectKey;
  categoryKey: string;
  key: string;
  subjectTitle: string;
  question: string;
  questionPreview?: string;
  questionPreviewTimeMs?: number;
  questionPreviewChat?: string;
  questionPreviewChatTimeMs?: number;
  correctAnswer: string;
  isTyping?: boolean;
  _isReviewProblem?: boolean;
  _reviewProblemSource?: StudyProblemType;
};

export type StudyProblemReviewState = {
  problem: StudyProblemType;
  reviewLevel: number;
};

export type StudySubject<TProblem extends StudyProblemBase<TSubjectKey>, TSubjectKey extends string> = {
  subjectKey: TSubjectKey;
  subjectTitle: string;
  getNewProblem: (selectedCategories: { categoryKey: string }[]) => TProblem;
  getWrongChoices: (problem: TProblem) => Set<string>;
  evaluateAnswer: (
    problem: TProblem,
    answer: string | undefined | undefined,
  ) => { isCorrect: boolean; responseMessage?: string };
  getReviewProblemSequence: (problem: TProblem, reviewLevel: number) => TProblem[];
  getCategories: () => { categoryKey: string; categoryTitle: string }[];
};

export type ProblemEnginePlayerSaveState = {
  playerName: string;
  problemQueue: StudyProblemType[];
  reviewProblems: StudyProblemReviewState[];
  answerHistory: StudyProblemAnswer[];
  selectedSubjectCategories: {
    subjectKey: string;
    categoryKey: string;
  }[];
};
