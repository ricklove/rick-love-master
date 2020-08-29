export type ProblemService = {
    getNextProblem: () => {
        question: string;
        answers: { value: string, isCorrect: boolean }[];
    } | {
        done: boolean;
    };
};
