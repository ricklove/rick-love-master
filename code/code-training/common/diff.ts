import { StringSpan } from 'utils/string-span';
import { IDiffComputerOpts, DiffComputer, ILineChange } from 'vscode-diff';

export const diff = (a: string, b: string) => {
    const aSpan = new StringSpan(a);
    const bSpan = new StringSpan(b);
    const aLineSpans = aSpan.splitOnRegExp(/\n/g).map(x => x.trimStart(`\n`));
    const bLineSpans = bSpan.splitOnRegExp(/\n/g).map(x => x.trimStart(`\n`));
    const options: IDiffComputerOpts = {
        shouldPostProcessCharChanges: true,
        shouldIgnoreTrimWhitespace: true,
        shouldMakePrettyDiff: true,
        shouldComputeCharChanges: true,
        // maxComputationTime: 0, // time in milliseconds, 0 => no computation limit.
    };
    const diffComputer = new DiffComputer(aLineSpans.map(x => x.toText()), bLineSpans.map(x => x.toText()), options);
    const lineChanges: ILineChange[] = diffComputer.computeDiff();
    return {
        changes: lineChanges
            .flatMap(x => x.charChanges ?? [{
                ...x,
                originalStartColumn: 1,
                originalEndColumn: x.originalEndLineNumber <= 0 ? 0 : aLineSpans[x.originalEndLineNumber - 1].length + 2,
                modifiedStartColumn: 1,
                modifiedEndColumn: x.modifiedEndLineNumber <= 0 ? 0 : bLineSpans[x.modifiedEndLineNumber - 1].length + 2,
            }])
            .map(x => {
                const aRemoved = x.originalStartLineNumber <= 0 || x.originalEndLineNumber <= 0;
                const bRemoved = x.modifiedStartLineNumber <= 0 || x.modifiedEndLineNumber <= 0;
                const aStart = aRemoved ? 0 : aLineSpans[x.originalStartLineNumber - 1].start + x.originalStartColumn - 1;
                const aAfterEnd = aRemoved ? 0 : aLineSpans[x.originalEndLineNumber - 1].start + x.originalEndColumn - 1;
                const aChange = new StringSpan(a, aStart, aAfterEnd - aStart);

                const bStart = bRemoved ? 0 : bLineSpans[x.modifiedStartLineNumber - 1].start + x.modifiedStartColumn - 1;
                const bAfterEnd = bRemoved ? 0 : bLineSpans[x.modifiedEndLineNumber - 1].start + x.modifiedEndColumn - 1;
                const bChange = new StringSpan(b, bStart, bAfterEnd - bStart);
                return {
                    ...x,
                    a: aChange.length === 0 ? null : {
                        aStart,
                        aAfterEnd,
                        aChange,
                        aSpan,
                        aLineSpans,
                    },
                    b: bChange.length === 0 ? null : {
                        bStart,
                        bAfterEnd,
                        bChange,
                        bSpan,
                        bLineSpans,
                    },
                };
            }),
    };
};
