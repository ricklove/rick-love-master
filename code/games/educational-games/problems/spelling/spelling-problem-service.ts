import { distinct, shuffle } from 'utils/arrays';
import { randomItem } from 'utils/random';
import { SpeechService } from '../../utils/speech';
import { ProblemService, ProblemAnswer } from '../problems-service';
import { getSpellingEntries } from './spelling-entries';

export const createSpellingProblemService = ({ speechService, maxAnswers = 4 }: { speechService: SpeechService, maxAnswers?: number }): ProblemService => {
    const speech = speechService;
    const spellingEntries = getSpellingEntries();
    const sectionSize = 25;
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
            state.nextIndex = (a - 1) * sectionSize;
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

            // Responses
            if (!answer.isCorrect) {
                // Demotivation!
                const phrases = [
                    `I've got a dog that spells better`,
                    `That was horrible`,
                    `What are you trying to do?`,
                    `That is not a word`,
                    `No, select the correct answer`,
                    `Absolutely Incorrect`,
                    `Completely Wrong`,
                    `This is supposed to be English`,
                    `What does the fox say?`,
                ];
                speech.speak(randomItem(phrases));
                speech.speak(problem.answers.find(x => x.isCorrect)?.value ?? ``);
            } else {

                console.log(`recordAnswer correct`);
                if (Math.random() > 0.1) { return; }
                const phrases = [
                    `Good job! Thank you for the alien skulls.`,
                    `Great! That's a nice pile of bones.`,
                    // `Amazing! Keep getting better`,
                ];
                speech.speak(randomItem(phrases));
            }
        },
    };

    return service;
};
