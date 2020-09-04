import { shuffle, distinct, distinct_key } from 'utils/arrays';
import { ProblemService, ProblemResult, ProblemAnswer } from './problems-service';

export type DefinitionSubject = { subjectName: string, sections: DefinitionSection[] };
export type DefinitionSection = { name: string, entries: DefinitionEntry[] };
export type DefinitionEntry = { prompt: string, response: string };
export const createDefinitionProblemService = ({ subject, maxAnswers = 4, onQuestion, onQuestionReverse }: {
    subject: DefinitionSubject; maxAnswers?: number;
    onQuestion?: (question: string) => void; onQuestionReverse?: (question: string) => void;
}): ProblemService => {
    // console.log(`createDefinitionProblemService`, { subject });

    let isReversed = false;
    let iSection = null as null | number;
    let iNext = null as null | number;
    const reveresedPrefix = `Reversed - `;
    const problemService: ProblemService = {
        getSections: () => [...subject.sections.map(x => x.name), ...subject.sections.map(x => `${reveresedPrefix}${x.name}`)],
        gotoSection: (name: string) => {
            const isRev = name.startsWith(reveresedPrefix);
            const n = isRev ? name.substr(reveresedPrefix.length) : name;
            iSection = subject.sections.findIndex(x => x.name === n);
            iNext = 0;
            isReversed = isRev;
        },
        getNextProblem: (): ProblemResult => {
            if (iSection == null) {
                // Prompt section?
                iSection = 0;
                iNext = null;
            }
            if ((iNext ?? 0) >= (subject.sections[iSection]?.entries.length ?? 0)) {
                iSection++;
                iNext = null;
            }
            if (iSection >= subject.sections.length) {
                iSection = 0;
                iNext = null;
                isReversed = !isReversed;
            }
            if (iNext == null) {
                iNext = 0;
            }

            const section = subject.sections[iSection];
            const defRaw = section.entries[iNext];
            if (!defRaw) {
                return { done: true, key: `done` };
            }

            const prob = isReversed ? { question: defRaw.response, anwer: defRaw.prompt } : { question: defRaw.prompt, anwer: defRaw.response };

            const wrongAnswerCount = maxAnswers - 1;
            const wrongAnswers =
                distinct(shuffle(
                    section.entries
                        .slice(Math.max(0, iNext - 10), iNext + 10)
                        .map(x => isReversed ? x.prompt : x.response)
                        .filter(x => x !== prob.anwer))).slice(0, wrongAnswerCount);

            const answers: ProblemAnswer[] = shuffle([...wrongAnswers.map(x => ({ value: `${x}`, isCorrect: false })), { value: `${prob.anwer}`, isCorrect: true }]).map(x => ({ ...x, key: x.value }));

            iNext++;
            return {
                key: `${prob.question}`,
                question: prob.question,
                onQuestion: isReversed ? (() => onQuestionReverse?.(prob.question)) : (() => onQuestion?.(prob.question)),
                answers,
            };
        },
        recordAnswer: () => { },
    };

    return problemService;
};

export const parseDefinitionDocument = (documentText: string, subjectName: string): DefinitionSubject => {
    const lines = documentText.split(`\n`).map(x => x.trim()).filter(x => x);
    const sections = [] as DefinitionSection[];
    sections.push({ name: `[Start]`, entries: [] });
    let section = sections[0];

    for (const l of lines) {
        const parts = l.split(`\t`);
        // console.log(`line`, { l, parts });
        if (parts.length === 1) {
            sections.push({ name: parts[0].trim(), entries: [] });
            section = sections[sections.length - 1];
        }
        if (parts.length >= 2) {
            section.entries.push({ prompt: parts[0].trim(), response: parts[1].trim() });
        }
    }

    // Remove duplicates
    sections.forEach(s => { s.entries = distinct_key(s.entries, x => x.prompt); });

    const sectionsCleaned = sections.filter(x => x.entries.length > 0);
    return { subjectName, sections: sectionsCleaned };
};
