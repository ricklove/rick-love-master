export type ProblemAnswer = { key: string, value: string, isCorrect: boolean };
export type Problem = {
    key: string;
    question: string;
    answers: ProblemAnswer[];
};
export type ProblemResult = Problem | {
    done: boolean;
    key: 'done';
    question?: undefined;
    answers?: undefined;
};
export type ProblemService = {
    getNextProblem: () => ProblemResult;
    recordAnswer: (problem: Problem, answer: ProblemAnswer) => void;
};
