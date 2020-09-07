import { shuffle, distinct } from 'utils/arrays';
import { ProblemService, ProblemResult, ProblemAnswer } from './problems-service';

export const createMultiplesProblemService = ({ min = 1, max = 12, maxAnswers = 4 }: { min?: number, max?: number, maxAnswers?: number }): ProblemService => {
    let n = min - 1;
    let m = min;

    const problemService: ProblemService = {
        getSections: () => [...new Array(max - min + 1)].map((x, i) => `Multiples of ${i + min}`),
        gotoSection: (name: string) => {
            const parts = name.split(` `);
            const v = parts[parts.length - 1];
            const bVal = Number.parseInt(v, 10);
            m = bVal;
            n = min - 1;
        },
        getNextProblem: (): ProblemResult => {
            n++;
            if (n > max) {
                n = min;
                m++;
                if (m > max) {
                    // Loop
                    n = min;
                    m = min;
                    // return { done: true, key: `done` };
                }
            }

            const correctValue = n * m;
            const wrongAnswerCount = maxAnswers - 1;
            const wrongValues =
                distinct(
                    [...new Array(100)].map(() =>
                        Math.round(n + 1 - 2 * Math.random())
                        * Math.round(m + 1 - 2 * Math.random())
                        + Math.round(2 - 4 * Math.random()))
                        .filter(x => x !== correctValue)
                        .filter(x => x > 0),
                ).slice(0, wrongAnswerCount);

            const answers: ProblemAnswer[] = shuffle([...wrongValues.map(x => ({ value: `${x}`, isCorrect: false })), { value: `${correctValue}`, isCorrect: true }]).map(x => ({ ...x, key: x.value }));

            return {
                key: `${m} x ${n}`,
                question: `${m} x ${n}`,
                answers,
                isLastOfSection: n === max,
                isLastOfSubject: n === max && m === max,
            };
        },
        recordAnswer: () => { },
    };

    return problemService;
};
