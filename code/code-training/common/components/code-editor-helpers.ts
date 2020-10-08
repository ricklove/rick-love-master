import { distinct } from 'utils/arrays';
import { StringSpan } from 'utils/string-span';
import { highlight, languages } from 'prismjs';
import { LessonProjectFileSelection } from '../lesson-types';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prism-themes/themes/prism-vsc-dark-plus.css';

export const isSimilarCodeToken = (a: string, b: string) => {
    if (/^\d+$/g.test(a) &&
        /^\d+$/g.test(b)) { return true; }
    if (/^\w+$/g.test(a) &&
        /^\w+$/g.test(b)) { return true; }
    if (/^\W+$/g.test(a) &&
        /^\W+$/g.test(b)) { return true; }

    return false;
};


type CodeWithClasses = { code: string, classes: string[] };
const parseHighlightedSpans = (html: string): CodeWithClasses[] => {
    const h = new StringSpan(html, 0, html.length);
    const tagsWithCode = h.splitOnRegExp(/<[^>]*>/g).filter(x => x.length > 0).map(t => {

        const iTagLast = t.indexOf(`>`);
        if (iTagLast < 0) {
            return {
                raw: t,
                tag: t,
                code: t,
            };
        }

        const iTagLength = iTagLast - t.start + 1;
        return {
            raw: t,
            tag: t.newRange(t.start, iTagLength),
            code: t.newRange(iTagLast + 1, t.length - iTagLength),
        };
    });

    const tagContext = [] as StringSpan[];
    const tagsWithContext = tagsWithCode.map(t => {
        if (t.tag.startsWith(`</`)) {
            tagContext.pop();
        } else if (t.tag.startsWith(`<`)) {
            tagContext.push(t.tag);
        }
        return {
            ...t,
            context: [...tagContext],
        };
    });
    const tagsWithClasses = tagsWithContext.map(t => {
        const classInfos = t.context.map(c => {
            const cParts = c.splitOnRegExp(/class=('|")/g);
            if (cParts.length <= 1) { return { raw: c, cParts }; }
            // return cParts.map(x => x.toString());

            const classPart = cParts[1];
            const classContentParts = classPart.splitOnRegExp(/('|")/g);
            // return classContentParts.map(x => x.toString());

            const classContent = classContentParts[1].trimStart([`"`, `'`]);
            if (!classContent) { return { raw: c, cParts, classContentParts }; }

            return {
                raw: c,
                cParts,
                classContentParts,
                classContent: classContent.toString(),
                classes: classContent.toString().split(` `).filter(x => x).map(x => x as string),
            };
        });
        return {
            ...t,
            classInfos,
            classes: distinct(classInfos.flatMap(x => x.classes ?? [])),
        };
    });

    const codeWithClasses = tagsWithClasses.map(x => ({
        code: x.code.toString()
            .replace(/&lt;/g, `<`)
            .replace(/&gt;/g, `>`)
            .replace(/&amp;/g, `&`)
        ,
        classes: x.classes,
    }))
        .filter(x => x.code);

    console.log(`parseHighlightedSpans`, { codeWithClasses, tagsWithClasses, summary: codeWithClasses.map(x => `<span class='${x.classes.join(` `)}'>${x.code}</span>`).join(``) });
    // const iFocus = h.lastIndexOf(`<span`, lengthSameStart);
    return codeWithClasses;
};

export type CodePart = {
    code: string;
    classes: string[];
    index: number;
    length: number;
    isInSelection: boolean;
};
export type CodePartsData = {
    // codeBefore: string;
    // codeFocus: string;
    // codeAfter: string;
    codeParts: CodePart[];
    selection?: LessonProjectFileSelection;
};
export const getCodeParts = (code: string, language: 'tsx', selection?: LessonProjectFileSelection): CodePartsData => {
    const html = highlight(code, languages[language], language);
    const codeWithClasses = parseHighlightedSpans(html);
    let index = 0;
    const codeParts = codeWithClasses.map(x => {
        const r = {
            code: x.code,
            classes: x.classes,
            index,
            length: x.code.length,
            indexAfterEnd: index + x.code.length,
            _rawCode: code.substr(index, x.code.length),
        };
        index += x.code.length;
        return r;
    });

    if (codeParts.some(x => x.code !== x._rawCode)) {
        console.error(`getCodeParts FAILED`, { codeParts: codeWithClasses, codePartsFailed: codeParts.filter(x => x.code !== x._rawCode) });
    }

    const s0 = selection ?? {
        index: 0,
        length: code.length,
    };
    const s = {
        ...s0,
        indexAfterEnd: s0.index + s0.length,
    };

    const codePartsAll: CodePart[] = [];
    for (const c of codeParts) {
        // Before
        if (c.indexAfterEnd < s.index) {
            codePartsAll.push({ ...c, isInSelection: false });
            continue;
        }
        // After
        if (c.index > s.indexAfterEnd) {
            codePartsAll.push({ ...c, isInSelection: false });
            continue;
        }
        // Within
        if (c.index >= s.index && c.indexAfterEnd <= s.indexAfterEnd) {
            codePartsAll.push({ ...c, isInSelection: true });
            continue;
        }

        // Overlap
        const shouldSplitStart = c.index < s.index;
        const shouldSplitEnd = c.indexAfterEnd > s.indexAfterEnd;
        const iCodeStart = shouldSplitStart ? s.index - c.index : 0;
        const iCodeAfterEnd = shouldSplitEnd ? s.indexAfterEnd - c.index : c.length;
        const before = c.code.substr(0, iCodeStart);
        const within = c.code.substr(iCodeStart, iCodeAfterEnd - iCodeStart);
        const after = c.code.substr(iCodeAfterEnd, c.length - iCodeAfterEnd);
        codePartsAll.push(...[
            { ...c, code: before, index: c.index, length: iCodeStart, isInSelection: false },
            { ...c, code: within, index: c.index + iCodeStart, length: iCodeAfterEnd - iCodeStart, isInSelection: true },
            { ...c, code: after, index: c.index + iCodeAfterEnd, length: c.length - iCodeAfterEnd, isInSelection: false },
        ].filter(x => x.length > 0));
    }
    console.log(`getCodeParts`, {
        codePartsAll,
        code,
        selection,
    });

    if (codePartsAll.some(x => x.code !== code.substr(x.index, x.length))) {
        console.error(`getCodeParts FAILED`, { codeParts: codeWithClasses, codePartsFailed: codeParts.filter(x => x.code !== x._rawCode) });
    }

    // const before = codeParts.filter(x => x.indexAfterEnd <= s.index);
    // const beforeToSplit = codeParts.filter(x => x.index < s.index && x.indexAfterEnd > s.index);
    // const within = codeParts.filter(x => x.index >= s.index && x.indexAfterEnd <= s.indexAfterEnd);
    // const afterToSplit = codeParts.filter(x => x.index < s.indexAfterEnd && x.indexAfterEnd > s.indexAfterEnd);
    // const after = codeParts.filter(x => x.index >= s.indexAfterEnd);

    // const codePartsAll = [
    //     ...before.map(x => ({ ...x, isInSelection: false })),
    //     ...beforeToSplit.map(x => ({ ...x, isInSelection: false })),
    //     ...within.map(x => ({ ...x, isInSelection: true })),
    //     ...afterToSplit.map(x => ({ ...x, isInSelection: false })),
    //     ...after.map(x => ({ ...x, isInSelection: false })),
    // ];

    // console.log(`getCodeParts`, {
    //     codePartsAll, sections: {
    //         before,
    //         beforeToSplit,
    //         within,
    //         afterToSplit,
    //         after,
    //     },
    //     code, selection,
    // });


    // const codePartsWithSelection = {};


    return {
        codeParts: codePartsAll,
        selection,
    };
};
