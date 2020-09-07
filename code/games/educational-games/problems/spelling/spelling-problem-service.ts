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

            const isLastOfSection = (i + 1) % sectionSize === 0;
            const isLastOfSubject = i === spellingEntries.length - 1;
            return {
                key: `${i + 1}`,
                question: `Word ${i + 1}`,
                onQuestion: () => { speech.speak(correctValue); },
                answers,
                isLastOfSection,
                isLastOfSubject,
            };
        },
        recordAnswer: (p, a) => {
            if (!a.isCorrect) {
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
                ];
                speech.speak(randomItem(phrases));
                speech.speak(p.answers.find(x => x.isCorrect)?.value ?? ``);
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
};
