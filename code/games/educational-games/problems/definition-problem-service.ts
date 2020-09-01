import { shuffle, distinct, distinct_key } from 'utils/arrays';
import { ProblemService, ProblemResult, ProblemAnswer } from './problems-service';

export type Definition = { prompt: string, response: string };
export const createDefinitionProblemService = ({ definitions, maxAnswers = 4 }: { definitions: Definition[], maxAnswers?: number }): ProblemService => {

    let iNext = 0;
    const problemService: ProblemService = {
        getNextProblem: (): ProblemResult => {
            const def = definitions[iNext];
            if (!def) {
                return { done: true, key: `done` };
            }

            const wrongAnswerCount = maxAnswers - 1;
            const wrongAnswers =
                distinct(shuffle(
                    definitions
                        .slice(Math.max(0, iNext - 10), iNext + 10)
                        .map(x => x.response)
                        .filter(x => x !== def.response))).slice(0, wrongAnswerCount);

            const answers: ProblemAnswer[] = shuffle([...wrongAnswers.map(x => ({ value: `${x}`, isCorrect: false })), { value: `${def.response}`, isCorrect: true }]).map(x => ({ ...x, key: x.value }));

            iNext++;
            return {
                key: `${def.prompt}`,
                question: def.prompt,
                answers,
            };
        },
        recordAnswer: () => { },
    };

    return problemService;
};

export const parseDefinitionDocument = (documentText: string): Definition[] => {
    const lines = documentText.split(`\n`).map(x => x.trim()).filter(x => x);
    const entries = lines.map(x => x.split(`\t`)).filter(x => x.length === 2);
    const dic = entries.map(x => ({ prompt: x[0], response: x[1] }));
    const dicCleaned = distinct_key(dic, x => x.prompt);
    return dicCleaned;
};
