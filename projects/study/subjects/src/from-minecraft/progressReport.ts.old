import { graphBars, graphMap } from "../graphing/graph";
import { readFileText } from "../utils/fileWriter";
import { Vector3 } from "../utils/vector";

type ProgressReportEntry = {
    wasCorrect: boolean,
    answerRaw: string | null,
    responseMessage?: string | null,
    problem: {
        subjectKey: string,
        categoryKey: string;
        key: string,
        question: string,
    },
    time: Date,
    timeToAnswerMs: number,
    runningAverage: RunningAverageEntry;
};

export type RunningAverageEntry = {
    subjectKey: string;
    categoryKey: string;
    countCorrect: number;
    countTotal: number;
    averageTimeMs: number;
};

export const progressReport = {
    toString_answerLine: (a: ProgressReportEntry) => {
        return `${a.wasCorrect ? 'correct' : 'wrong'} \t${a.problem.subjectKey}:${a.problem.categoryKey} \t${(a.timeToAnswerMs / 1000).toFixed(1)}secs \t${a.problem.key} \t${a.problem.question} \t${a.wasCorrect ? '==' : '!='} \t${a.answerRaw} \tRunAve=${progressReport.toString_runningAverage(a.runningAverage)} \t${a.time}\n`;
    },
    parse_answerLine: (line: string): null | ProgressReportEntry => {
        const parsed = /^(correct|wrong) \t([^\t]+) \t([0-9\.]+)secs \t([^\t]+) \t([^\t]+) \t(?:==|!=) \t([^\t]+) \tRunAve=([^\t]+) \t([^\t]+)$/.exec(line);
        if (!parsed) { return null; }

        // console.log('parse_answerLine', { parsed });

        const [whole, correctOrWrong, subjectCategoryKey, timeToAnswerSecs, problemKey, question, answerRaw, runAverageText, time] = parsed;
        const [subjectKey, categoryKey] = subjectCategoryKey.split(':');

        return {
            ...{ _raw: line, _parsed: parsed },
            wasCorrect: correctOrWrong === 'correct',
            problem: {
                subjectKey,
                categoryKey,
                key: problemKey,
                question,
            },
            timeToAnswerMs: parseFloat(timeToAnswerSecs) * 1000,
            answerRaw,
            time: new Date(time),
            runningAverage: progressReport.parse_runningAverage(runAverageText)!,
        };
    },

    toString_runningAverage_short: ({ subjectKey, categoryKey, countCorrect, countTotal: count, averageTimeMs }: RunningAverageEntry) => {
        return `${subjectKey}:${categoryKey}: ${countCorrect}/${count} ${(Math.floor(100 * (countCorrect / count)) + '').padStart(2, ' ')}%`;
    },
    toString_runningAverage: ({ subjectKey, categoryKey, countCorrect, countTotal: count, averageTimeMs }: RunningAverageEntry) => {
        return `runAve ${subjectKey}:${categoryKey}: ${countCorrect}/${count} ${(Math.floor(100 * (countCorrect / count)) + '').padStart(2, ' ')}% ${(averageTimeMs / 1000).toFixed(1)}secs`;
    },
    parse_runningAverage: (line: string): null | RunningAverageEntry => {
        const parsed = /^runAve ([^:]+(:[^ ][^:]+)?): ([0-9]+)\/([0-9]+) [0-9]+% ([0-9\.]+)secs$/.exec(line);
        if (!parsed) { return null; }

        const [whole, subjectKey, categoryKey, countCorrect, count, averageTimeMs] = parsed;

        return {
            ...{ _raw: line, _parsed: parsed },
            subjectKey,
            categoryKey,
            countCorrect: parseInt(countCorrect, 10) || 0,
            countTotal: parseInt(count, 10) || 0,
            averageTimeMs: parseInt(averageTimeMs, 10) || 0,
        };
    },
};

const loadFileHistory = (fileContent: string, options?: { width?: number, runningAverageCount?: number }) => {
    const lines = fileContent.split('\n').map(x => x.trim());
    const parsedLines = lines.map(l => progressReport.parse_answerLine(l)).filter(x => x).map(x => x!);

    const subjectAnswersMap = {} as { [subjectKey: string]: ProgressReportEntry[] };
    parsedLines.forEach(x => {
        if (!subjectAnswersMap[x.problem.subjectKey]) {
            subjectAnswersMap[x.problem.subjectKey] = [];
        }
        subjectAnswersMap[x.problem.subjectKey].push(x);
    });

    // const subjectRunningAverage = Object.keys(subjectAnswersMap).map(k => ({
    //     subjectKey: k,
    //     entries: subjectAnswersMap[k],
    // })).map(x => ({
    //     ...x,
    //     runningAverage: x.entries
    //         .map((_, i) => {
    //             const entries = x.entries.slice(0, i + 1);
    //             return {
    //                 index: i,
    //                 total: entries.length,
    //                 correct: entries.filter(x => x.wasCorrect).length,
    //             };
    //         })
    //         .map(x => ({ ...x, ratio: x.correct / x.total })),
    // }));

    const runningAverageCount = options?.runningAverageCount ?? 32;

    const subjectChunkAverage = Object.keys(subjectAnswersMap).map(k => ({
        subjectKey: k,
        entries: subjectAnswersMap[k],
    })).map(x => {
        const chunkSize = Math.ceil(x.entries.length / (options?.width ?? 128));
        return {
            ...x,
            chunkRunningAverage: [...new Array(options?.width ?? 128)]
                .map((_, i) => {
                    const iEnd = (i + 1) * chunkSize;
                    const iStart = Math.max(0, iEnd - Math.max(runningAverageCount, chunkSize));
                    const entries = x.entries.slice(iStart, iEnd);
                    return {
                        index: i,
                        total: entries.length,
                        correct: entries.filter(x => x.wasCorrect).length,
                    };
                })
                .map(x => ({ ...x, ratio: x.correct / x.total })),
        };
    });

    return { subjectChunkAverage, parsedLines };
};

export const test_loadProblemHistory = async () => {
    const fileContent = await readFileText(`C:/Users/ricka/.bds/_data/playerData/RickLove3045/problemHistory.tsv`);
    const result = loadFileHistory(fileContent);
    console.log('test_loadProblemHistory', {
        r0: result.subjectChunkAverage[0].chunkRunningAverage,
        r1: result.subjectChunkAverage[1].chunkRunningAverage,
        // historyFirstItem: result.parsedLines[0], historyLastItem: result.parsedLines[result.parsedLines.length - 1]
    });
};

// test_loadProblemHistory();

type CommandService = {
    executeCommand: (command: string) => void
};
export const test_graphProgressReport = async (commands: CommandService, position: Vector3, filePath: string) => {
    // const fileContent = await readFileText(`C:/Users/ricka/.bds/_data/playerData/RickLove3045/problemHistory.tsv`);
    const fileContent = await readFileText(filePath);
    const result = loadFileHistory(fileContent, { width: 128 });

    const yBot = position.y - result.subjectChunkAverage.length - 1;

    graphMap(commands, x => ({
        value: 128,
        aboveBlockName: 'snow',
        belowBlockName: 'snow',
        atBlockName: 'snow'
    }), {
        origin: { ...position, y: yBot },
        blockName: 'dirt',
    });

    const getRandomBlockColor = (i: number) => {
        switch (i) {
            case 0: return 'diamond_block';
            case 1: return 'gold_block';
            case 3: return 'coal_block';
            case 4: return 'emerald_block';
            case 5: return 'coral_block';
            case 6: return 'wood';
            case 7: return 'redstone_block';
            case 8: return 'glowstone';
            case 9: return 'grass';
            case 10: return 'ice';
            case 11: return 'obsidian';
            case 12: return 'pink_glazed_terracotta';
            case 13: return 'podzol';
            case 14: return 'slime';

            default:
                return 'dirt';
        };
    }

    for (let i = 0; i < result.subjectChunkAverage.length; i++) {
        const d = result.subjectChunkAverage[i].chunkRunningAverage;

        graphMap(commands, x => ({
            value: Math.floor((d[x + 0]?.ratio || 0) * 128) || 0,
            value_bottom: Math.floor((d[x - 1]?.ratio || 0) * 128) || 0,
            aboveBlockName: 'glass',
            // belowBlockName: getRandomBlockColor(i),
            belowBlockName: 'glass',
            atBlockName: getRandomBlockColor(i)
        }), {
            origin: { ...position, y: yBot + 1 + i },
            blockName: 'glass',
        });
    }

};