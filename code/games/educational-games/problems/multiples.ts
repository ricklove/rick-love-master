import { shuffle, distinct } from 'utils/arrays';
import { ProblemService, ProblemResult, ProblemAnswer } from './problems-service';

export const createMultiplesProblemService = ({ min = 1, max = 12, maxAnswers = 4 }: { min?: number, max?: number, maxAnswers?: number }): ProblemService => {
    let a = min - 1;
    let b = min;

    const problemService: ProblemService = {
        getNextProblem: (): ProblemResult => {
            a++;
            if (a > max) {
                a = min;
                b++;
                if (b > max) {
                    return { done: true, key: `done` };
                }
            }

            const correctValue = a * b;
            const wrongAnswerCount = maxAnswers - 1;
            const wrongValues =
                distinct(
                    [...new Array(100)].map(() =>
                        Math.round(a + 1 - 2 * Math.random())
                        * Math.round(b + 1 - 2 * Math.random())
                        + Math.round(2 - 4 * Math.random()))
                        .filter(x => x !== correctValue)
                        .filter(x => x > 0),
                ).slice(0, wrongAnswerCount);

            const answers: ProblemAnswer[] = shuffle([...wrongValues.map(x => ({ value: `${x}`, isCorrect: false })), { value: `${correctValue}`, isCorrect: true }]).map(x => ({ ...x, key: x.value }));

            return {
                key: `${b} * ${a}`,
                question: `${b} * ${a}`,
                answers,
            };
        },
        recordAnswer: () => { },
    };

    return problemService;
};