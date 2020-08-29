export type Problem = {
    question: string;
    answers: { value: string, isCorrect: boolean }[];
};
export type ProblemService = {
    getNextProblem: () => Problem | {
        question: undefined;
        answers: undefined;
        done: boolean;
    };
};
