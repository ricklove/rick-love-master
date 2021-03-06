import { distinct, shuffle } from 'utils/arrays';
import { SpeechService } from '../../utils/speech';
import { ProblemService, ProblemAnswer } from '../problems-service';
import { getSpellingEntries } from './spelling-entries';

export const createSpellingProblemService = ({ speechService, maxAnswers = 4, sectionSize = 25 }: { speechService: SpeechService, maxAnswers?: number, sectionSize?: number }): ProblemService => {
    const speech = speechService;
    const spellingEntries = getSpellingEntries();
    const sectionCount = Math.ceil(spellingEntries.length / sectionSize);

    let state = {
        nextIndex: 0,
        completedSectionKeys: [] as string[],
    };

    const getSectionKey = (sectionIndex: number) => {
        return `${sectionIndex}`;
    };
    const getSectionName = (sectionIndex: number) => {
        return `Spelling ${sectionIndex + 1}`;
    };

    const service: ProblemService = {
        load: async (storage) => {
            const loaded = await storage.load<typeof state>();
            if (loaded) {
                state = loaded;
            }
        },
        save: async (storage) => {
            await storage.save(state);
        },
        getSections: () => [...new Array(sectionCount)].map((x, i) => ({
            key: getSectionKey(i),
            name: getSectionName(i),
            isComplete: state.completedSectionKeys.includes(getSectionKey(i)),
        })),
        gotoSection: ({ key }) => {
            const a = Number.parseInt(key, 10);
            state.nextIndex = a * sectionSize;
            console.log(`createSpellingProblemService gotoSection`, { key, a, state });
        },
        getNextProblem: () => {
            if (state.nextIndex >= spellingEntries.length) {
                state.nextIndex = 0;
            }

            const i = state.nextIndex;
            state.nextIndex++;

            const p = spellingEntries[i];
            const correctValue = p.word;
            const wrongAnswerCount = maxAnswers - 1;
            const wrongValues =
                shuffle(distinct(p.mispellings)).slice(0, wrongAnswerCount);

            const answers: ProblemAnswer[] = shuffle([...wrongValues.map(x => ({ value: `${x}`, isCorrect: false })), { value: `${correctValue}`, isCorrect: true }]).map(x => ({ ...x, key: x.value }));

            const isLastOfSection = (i + 1) % sectionSize === 0;
            const isLastOfSubject = i === spellingEntries.length - 1;
            return {
                key: `${i + 1}`,
                question: `Word ${i + 1}`,
                onQuestion: () => { speech.speak(correctValue); },
                answers,
                sectionKey: getSectionKey(Math.floor(i / sectionSize)),
                isLastOfSection,
                isLastOfSubject,
            };
        },
        recordAnswer: (problem, answer) => {
            if (answer.isCorrect && problem.isLastOfSection) {
                state.completedSectionKeys.push(problem.sectionKey);
            }
        },
    };

    return service;
};
