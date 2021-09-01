export type ProblemAnswer = { key: string, value: string, isCorrect: boolean };
export type Problem = {
    key: string;
    question: string;
    onQuestion?: () => void;
    answers: ProblemAnswer[];
    sectionKey: string;

    isReview?: boolean;
    isLastOfSection?: boolean;
    isLastOfSubject?: boolean;
};
export type ProblemResult = Problem | {
    done: boolean;
    key: 'done';
    question?: undefined;
    answers?: undefined;
    section?: undefined;
};
export type ProblemService = {
    load: (storage: ProblemStateStorage) => Promise<void>;
    save: (storage: ProblemStateStorage) => Promise<void>;
    getSections: () => { key: string, name: string, isComplete: boolean }[];
    gotoSection: (section: { key: string }) => void;
    getNextProblem: () => ProblemResult;
    recordAnswer: (problem: Problem, answer: ProblemAnswer) => void;
};
export type ProblemStateStorage = {
    load: <T>() => Promise<T | null>;
    save: <T>(state: T) => Promise<void>;
};
