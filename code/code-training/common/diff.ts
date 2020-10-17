import { StringSpan } from 'utils/string-span';
import { IDiffComputerOpts, DiffComputer, ILineChange } from 'vscode-diff';

const getSpanRange = (v: { span: StringSpan, lineSpans: StringSpan[], startLine: number, endLine: number, startColumn?: number, endColumn?: number, otherAtStart: boolean, otherAtEnd: boolean }) => {
    const afterLine = v.endLine === 0; // || v.endColumn === 0;
    if (afterLine) {
        const atStart = v.startLine === 0 && v.otherAtStart;
        if (atStart) {
            const cStart = 0;
            const cAfterEnd = 0;
            const cChange = v.span.newRange(cStart, cAfterEnd - cStart);
            return {
                start: cStart,
                afterEnd: cAfterEnd,
                change: cChange,
                span: v.span,
                lineSpans: v.lineSpans,
            };
        }

        const atEnd = v.startLine === 0 && v.otherAtEnd;
        if (atEnd) {
            const cStart = v.span.length;
            const cAfterEnd = cStart;
            const cChange = v.span.newRange(cStart, cAfterEnd - cStart);
            return {
                start: cStart,
                afterEnd: cAfterEnd,
                change: cChange,
                span: v.span,
                lineSpans: v.lineSpans,
            };
        }

        // After line
        const cStart = v.startLine >= v.lineSpans.length ? v.span.length : v.lineSpans[v.startLine].start;
        const cAfterEnd = cStart;
        const cChange = v.span.newRange(cStart, cAfterEnd - cStart);
        return {
            start: cStart,
            afterEnd: cAfterEnd,
            change: cChange,
            span: v.span,
            lineSpans: v.lineSpans,
        };
    }

    // Whole lines
    if (!v.startColumn || !v.endColumn) {
        const cStart = v.startLine <= 1 ? 0
            // Start of this line
            : v.lineSpans[v.startLine - 1].start;

        const cAfterEnd = v.endLine > v.lineSpans.length ? v.span.length
            // End of this line
            : v.lineSpans[v.endLine - 1].start + v.lineSpans[v.endLine - 1].length;

        const cChange = v.span.newRange(cStart, cAfterEnd - cStart);
        return {
            start: cStart,
            afterEnd: cAfterEnd,
            change: cChange,
            span: v.span,
            lineSpans: v.lineSpans,
        };
    }

    // Char Range
    const start = v.lineSpans[v.startLine - 1].start + v.startColumn - 1;
    const afterEnd = v.lineSpans[v.endLine - 1].start + v.endColumn - 1;
    const change = v.span.newRange(start, afterEnd - start);

    return {
        start,
        afterEnd,
        change,
        span: v.span,
        lineSpans: v.lineSpans,
    };
};

export const diff = (a: string, b: string) => {
    const aSpan = new StringSpan(a);
    const bSpan = new StringSpan(b);
    const aLineSpans = aSpan.splitOnRegExp(/(?<=\n)./g);
    const bLineSpans = bSpan.splitOnRegExp(/(?<=\n)./g);
    const options: IDiffComputerOpts = {
        shouldPostProcessCharChanges: true,
        shouldIgnoreTrimWhitespace: false,
        shouldMakePrettyDiff: true,
        shouldComputeCharChanges: true,

        // maxComputationTime: 0, // time in milliseconds, 0 => no computation limit.
    };
    const diffComputer = new DiffComputer(aLineSpans.map(x => x.toText()), bLineSpans.map(x => x.toText()), options);
    const lineChanges: ILineChange[] = diffComputer.computeDiff();

    type LineCharChange = {
        line: {
            readonly originalStartLineNumber: number;
            readonly originalEndLineNumber: number;
            readonly modifiedStartLineNumber: number;
            readonly modifiedEndLineNumber: number;
        };
        readonly originalStartLineNumber: number;
        readonly originalEndLineNumber: number;
        readonly modifiedStartLineNumber: number;
        readonly modifiedEndLineNumber: number;
        readonly originalStartColumn?: number;
        readonly originalEndColumn?: number;
        readonly modifiedStartColumn?: number;
        readonly modifiedEndColumn?: number;
    };
    const charChanges = lineChanges
        .flatMap(x => x.charChanges?.map(c => ({
            line: x,
            ...c,
            // ...x,
        })) as LineCharChange[] ?? [{
            line: x,
            ...x,
            originalStartColumn: undefined,
            originalEndColumn: undefined,
            modifiedStartColumn: undefined,
            modifiedEndColumn: undefined,
        }]);

    console.log(`diff`, { charChanges, lineChanges, aSpan, bSpan });

    return {
        changes: charChanges
            .map(x => {
                if (x.originalStartColumn === 0 && x.originalEndColumn === 0
                    || x.modifiedStartColumn === 0 && x.modifiedEndColumn === 0) {
                    // Whole Line
                    return {
                        ...x,
                        a: getSpanRange({
                            span: aSpan,
                            lineSpans: aLineSpans,
                            startLine: x.line.originalStartLineNumber,
                            endLine: x.line.originalEndLineNumber,
                            startColumn: undefined,
                            endColumn: undefined,
                            otherAtStart: x.modifiedStartLineNumber <= 1 && (x.modifiedStartColumn ?? 1) === 1,
                            otherAtEnd: x.modifiedStartLineNumber >= bLineSpans.length,
                        }),
                        b: getSpanRange({
                            span: bSpan,
                            lineSpans: bLineSpans,
                            startLine: x.line.modifiedStartLineNumber,
                            endLine: x.line.modifiedEndLineNumber,
                            startColumn: undefined,
                            endColumn: undefined,
                            otherAtStart: x.originalStartLineNumber <= 1 && (x.originalStartColumn ?? 1) === 1,
                            otherAtEnd: x.originalStartLineNumber >= aLineSpans.length,
                        }),
                    };
                }

                const aSpanRange = getSpanRange({
                    span: aSpan,
                    lineSpans: aLineSpans,
                    startLine: x.originalStartLineNumber,
                    endLine: x.originalEndLineNumber,
                    startColumn: x.originalStartColumn,
                    endColumn: x.originalEndColumn,
                    otherAtStart: x.modifiedStartLineNumber <= 1 && (x.modifiedStartColumn ?? 1) === 1,
                    otherAtEnd: x.modifiedStartLineNumber >= bLineSpans.length,
                });
                const bSpanRange = getSpanRange({
                    span: bSpan,
                    lineSpans: bLineSpans,
                    startLine: x.modifiedStartLineNumber,
                    endLine: x.modifiedEndLineNumber,
                    startColumn: x.modifiedStartColumn,
                    endColumn: x.modifiedEndColumn,
                    otherAtStart: x.originalStartLineNumber <= 1 && (x.originalStartColumn ?? 1) === 1,
                    otherAtEnd: x.originalStartLineNumber >= aLineSpans.length,
                });

                return {
                    ...x,
                    a: aSpanRange,
                    b: bSpanRange,
                };
            }),
    };
};
