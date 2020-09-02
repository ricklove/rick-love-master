import { distinct, shuffle } from 'utils/arrays';
import { createSpeechService } from '../../utils/speech';
import { ProblemService, ProblemAnswer } from '../problems-service';
import { getSpellingEntries } from './spelling-entries';

export const createSpellingProblemService = ({ maxAnswers = 4 }: { maxAnswers?: number }): ProblemService => {
    const spellingEntries = getSpellingEntries();
    const sectionSize = 25;
    const sectionCount = Math.ceil(spellingEntries.length / sectionSize);

    const speech = createSpeechService();

    let nextIndex = 0;

    return {
        getSections: () => [...new Array(sectionCount)].map((x, i) => `Spelling ${i + 1}`),
        gotoSection: (name: string) => {
            const parts = name.split(` `);
            const v = parts[parts.length - 1];
            const a = Number.parseInt(v, 10);
            nextIndex = (a - 1) * sectionSize;
        },
        getNextProblem: () => {
            if (nextIndex >= spellingEntries.length) {
                nextIndex = 0;
            }

            const i = nextIndex;
            nextIndex++;

            const p = spellingEntries[i];
            const correctValue = p.word;
            const wrongAnswerCount = maxAnswers - 1;
            const wrongValues =
                shuffle(distinct(p.mispellings)).slice(0, wrongAnswerCount);

            const answers: ProblemAnswer[] = shuffle([...wrongValues.map(x => ({ value: `${x}`, isCorrect: false })), { value: `${correctValue}`, isCorrect: true }]).map(x => ({ ...x, key: x.value }));


            return {
                key: `${i + 1}`,
                question: `Word ${i + 1}`,
                onQuestion: () => { speech.speak(correctValue); },
                answers,
            };
        },
        recordAnswer: () => { },
    };
};
