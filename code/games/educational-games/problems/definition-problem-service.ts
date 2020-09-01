import { shuffle, distinct, distinct_key } from 'utils/arrays';
import { ProblemService, ProblemResult, ProblemAnswer } from './problems-service';

export type DefinitionSubject = { subjectName: string, sections: DefinitionSection[] };
export type DefinitionSection = { name: string, entries: DefinitionEntry[] };
export type DefinitionEntry = { prompt: string, response: string };
export const createDefinitionProblemService = ({ subject, maxAnswers = 4 }: { subject: DefinitionSubject, maxAnswers?: number }): ProblemService => {
    // console.log(`createDefinitionProblemService`, { subject });

    let iSection = null as null | number;
    let iNext = null as null | number;
    const problemService: ProblemService = {
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
            }
            if (iNext == null) {
                iNext = 0;
            }

            const section = subject.sections[iSection];
            const def = section.entries[iNext];
            if (!def) {
                return { done: true, key: `done` };
            }

            const wrongAnswerCount = maxAnswers - 1;
            const wrongAnswers =
                distinct(shuffle(
                    section.entries
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
