import { distinct, shuffle } from 'utils/arrays';
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

            const classPart = cParts[1];
            const classContentParts = classPart.splitOnRegExp(/('|")/g);

            const classContent = classContentParts[1].trimStart([`"`, `'`]);
            if (!classContent) { return { raw: c, cParts, classContentParts }; }

            return {
                raw: c,
                cParts,
                classContentParts,
                classContent: classContent.toText(),
                classes: classContent.toText().split(` `).filter(x => x).map(x => x as string),
            };
        });
        return {
            ...t,
            classInfos,
            classes: distinct(classInfos.flatMap(x => x.classes ?? [])),
        };
    });

    const codeWithClasses = tagsWithClasses.map(x => ({
        code: x.code.toText()
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
    indexAfterEnd: number;
    isInSelection: boolean;
};
export type CodePartsData = {
    // codeBefore: string;
    codeFocus: string;
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

    const s = selection ?? {
        index: 0,
        length: code.length,
    };

    const codePartsAll = modifyCodeParts(codeParts.map(x => ({ ...x, isInSelection: true, indexAfterEnd: x.index + x.length })), s, (x, inRange) => ({ ...x, isInSelection: inRange }));

    console.log(`getCodeParts`, {
        codePartsAll,
        code,
        selection,
    });

    if (codePartsAll.some(x => x.code !== code.substr(x.index, x.length))) {
        console.error(`getCodeParts FAILED`, { codeParts: codeWithClasses, codePartsFailed: codeParts.filter(x => x.code !== x._rawCode) });
    }

    const codeFocus = code.substr(s.index, s.length);
    return {
        codeFocus,
        codeParts: codePartsAll,
        selection,
    };
};
const modifyCodeParts = <T extends CodePart>(codeParts: CodePart[], range: { index: number, length: number }, getCodePart: (codePart: CodePart, inRange: boolean) => T): T[] => {
    const s = {
        ...range,
        indexAfterEnd: range.index + range.length,
    };

    const codePartsAll: T[] = [];
    for (const c of codeParts) {
        // Before
        if (c.indexAfterEnd < s.index) {
            codePartsAll.push(getCodePart(c, false));
            continue;
        }
        // After
        if (c.index > s.indexAfterEnd) {
            codePartsAll.push(getCodePart(c, false));
            continue;
        }
        // Within
        if (c.index >= s.index && c.indexAfterEnd <= s.indexAfterEnd) {
            codePartsAll.push(getCodePart(c, true));
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
            getCodePart({ ...c, code: before, index: c.index, length: iCodeStart }, false),
            getCodePart({ ...c, code: within, index: c.index + iCodeStart, length: iCodeAfterEnd - iCodeStart }, true),
            getCodePart({ ...c, code: after, index: c.index + iCodeAfterEnd, length: c.length - iCodeAfterEnd }, false),
        ].filter(x => x.length > 0));
    }

    return codePartsAll;
};

export const getCodePartsCompleted = (codeParts: CodePart[], incomplete: { index: number, length: number }, options?: { showBlank?: boolean }): CodePart[] => {
    const codePartsCompleted = modifyCodeParts(codeParts, incomplete, (x, inRange) => ({ ...x, isIncomplete: inRange }));
    if (options?.showBlank) {
        return codePartsCompleted.map(x => ({ ...x, code: x.isIncomplete ? x.code.replace(/./g, ` `) : x.code }));
    }
    return codePartsCompleted.filter(x => !x.isIncomplete);
};

export const getAutoComplete = ({ codeParts, selection }: { codeParts: CodePart[], selection?: { index: number, length: number } }, codeFocusCompleted?: string) => {
    if (!selection
        || codeFocusCompleted == null
        || selection.length === codeFocusCompleted.length
    ) {
        return [];
    }

    // const remaining = code_focus.substr(completed.length);

    const nextPartIndexRaw = codeParts.findIndex(x => x.index > selection.index + codeFocusCompleted.length);
    const nextPartIndex = nextPartIndexRaw < 0 ? codeParts.length : nextPartIndexRaw;
    const activePartText = codeParts[nextPartIndex - 1]?.code;
    const iDone = codeParts[nextPartIndex - 1]?.index;
    // console.log(`updateAutoComplete`, { iNext, iDone, activePart: activePartText, codeParts, codeFocusCompleted });

    if (!activePartText?.trim()) {
        return [];
    }

    const activePartTextCompleted = activePartText.substr(0, codeFocusCompleted.length + selection.index - iDone);
    const matchWords = distinct(codeParts
        .filter(x =>
            (!!activePartTextCompleted && x.code.startsWith(activePartTextCompleted))
            || (!activePartTextCompleted && isSimilarCodeToken(x.code, activePartText)))
        .map(x => x.code)
        .filter(x => x !== activePartText)
        .filter(x => !!x.trim()),
    );
    const choices = [activePartText, ...shuffle(matchWords).slice(0, 3)].map(x => ({ textCompleted: x.substr(0, codeFocusCompleted.length - iDone), text: x.substr(codeFocusCompleted.length - iDone) }));

    console.log(`updateAutoComplete`, { iDone, activePartText, codeFocusCompleted, codeParts, activePartTextCompleted, matchWords, choices });

    return shuffle(choices).map((x, i) => ({ ...x, isSelected: i === 0, isWrong: false }));
};
