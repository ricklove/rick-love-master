import { shuffle, distinct } from 'utils/arrays';
import { ProblemService, ProblemResult, ProblemAnswer } from './problems-service';

export const createMultiplesProblemService = ({
    min = 1,
    max = 12,
    maxAnswers = 4,
}: {
    min?: number;
    max?: number;
    maxAnswers?: number;
}): ProblemService => {

    let state = {
        n: min - 1,
        m: min,
        completedSectionKeys: [] as string[],
    };
    const getSectionKey = (m: number) => {
        return `${m}`;
    };
    const getSectionName = (m: number) => {
        return `Multiples of ${m}`;
    };

    const problemService: ProblemService = {
        load: async (storage) => {
            const loaded = await storage.load<typeof state>();
            if (loaded) {
                state = loaded;
            }
        },
        save: async (storage) => {
            await storage.save(state);
        },
        getSections: () => [...new Array(max - min + 1)].map((x, i) => ({
            key: getSectionKey(i + min),
            name: getSectionName(i + min),
            isComplete: state.completedSectionKeys.includes(getSectionKey(i + min)),
        })),
        gotoSection: ({ key }) => {
            const bVal = Number.parseInt(key, 10);
            state.m = bVal;
            state.n = min - 1;
        },
        getNextProblem: (): ProblemResult => {
            state.n++;
            if (state.n > max) {
                state.n = min;
                state.m++;
                if (state.m > max) {
                    // Loop
                    state.n = min;
                    state.m = min;
                    // return { done: true, key: `done` };
                }
            }

            const { n, m } = state;
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
                sectionKey: getSectionKey(m),
                isLastOfSection: n === max,
                isLastOfSubject: n === max && m === max,
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
