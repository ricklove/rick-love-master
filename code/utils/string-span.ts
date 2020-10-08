/* eslint-disable no-cond-assign */
import { AppError } from './error';

const DEBUG = true;

export class StringSpan {
    readonly debug?: string = undefined;

    public readonly source: string;

    public readonly start: number;

    public readonly length: number;

    constructor(source: string, start?: number, length?: number) {
        this.source = source;
        this.start = start ?? 0;
        this.length = length ?? source.length;

        if (DEBUG) {
            this.debug = this.toText();
        }
    }

    toText() { return this.source.substr(this.start, this.length); }

    getChar(index: number) {
        if (index < this.start || index >= this.start + this.length) { throw new AppError(`StringSpan.getChar(): Out of range`, { index, s: this }); }
        return this.source[index];
    }

    indexOf = (d: string) => {
        const i = this.source.indexOf(d, this.start);
        if (i < this.start) { return -1; }
        if (i >= this.start + this.length) { return -1; }
        return i;
    }

    lastIndexOf = (d: string) => {
        const i = this.source.lastIndexOf(d, this.start + this.length);
        if (i < this.start) { return -1; }
        if (i >= this.start + this.length) { return -1; }
        return i;
    }

    indexOfAny = (d: string[]) => {
        const indexes = d.map(x => this.source.indexOf(x, this.start)).filter(x => x >= 0);
        if (indexes.length <= 0) { return -1; }

        const i = Math.min(...indexes);
        if (i < 0) { return -1; }
        if (i > this.start + this.length) { return -1; }
        return i;
    }

    indexOfRegExp = (d: RegExp) => {
        d.lastIndex = this.start;
        const m = d.exec(this.source);
        const i = m?.index ?? -1;
        if (i < 0) { return { index: -1, length: 0 }; }
        if (i > this.start + this.length) { return { index: -1, length: 0 }; }
        return { index: i, length: m?.length ?? 0 };
    }

    lastIndexOfRegex = (d: RegExp) => {
        d.lastIndex = this.start;
        let m: null | RegExpExecArray;
        let i = -1;
        let len = 0;
        while (m = d.exec(this.source)) {
            if (m.index > this.start + this.length) { break; }
            if (m.index < 0) { break; }
            i = m.index;
            len = m.length;
        };
        return { index: i, length: len };
    }

    splitOn = (d: string, maxCount: number | null = null) => {
        const spans = [] as StringSpan[];

        const s = this.source;
        const iMin = this.start;
        const iEnd = this.start + this.length;

        let iLast = iMin;
        let i = this.indexOf(d);

        while (i >= 0
            && i <= iEnd
            && (!maxCount || spans.length < maxCount - 1)) {
            spans.push(new StringSpan(s, iLast, i - iLast));

            iLast = i;
            i = s.indexOf(d, i + d.length);
        }

        i = iEnd;
        spans.push(new StringSpan(s, iLast, i - iLast));

        const spans_inRange = spans.filter(x => x.length > 0
            && x.start >= this.start
            && x.start + x.length <= this.start + this.length);

        return spans_inRange;
    };

    splitOnRegExp = (d: RegExp, maxCount: number | null = null) => {
        const spans = [] as StringSpan[];

        const s = this.source;
        const iMin = this.start;
        const iEnd = this.start + this.length;

        let iLast = iMin;

        // Reset regexp
        d.lastIndex = this.start;
        let m = d.exec(s);

        while (m
            && m.index <= iEnd
            && (!maxCount || spans.length < maxCount - 1)) {
            spans.push(new StringSpan(s, iLast, m.index - iLast));

            iLast = m.index;
            m = d.exec(s);
        }

        const i = iEnd;
        spans.push(new StringSpan(s, iLast, i - iLast));

        const spans_inRange = spans.filter(x => x.length > 0
            && x.start >= this.start
            && x.start + x.length <= this.start + this.length);

        return spans_inRange;
    };

    // private static regex_spaces = new RegExp('\\s', 'g');
    // trimStart = (regex?: RegExp) => {
    //     const r = regex ?? StringSpan.regex_spaces;
    //     r.lastIndex = this.start;

    //     let m: null | RegExpExecArray;
    //     let i = -1;
    //     let len = 0;

    //     let iNext = this.start;
    //     while (m = r.exec(this.source)) {
    //         if (m.index !== iNext) { break; }
    //         iNext += m.length;
    //         r.lastIndex = iNext;
    //     };

    //     if (iNext === this.start) { return this; }
    //     return this.transform(iNext - this.start, 0);
    // }
    // trimEnd = (regex?: RegExp) => {
    //     const r = regex ?? StringSpan.regex_spaces;
    //     const matches = this.source.match(r);

    //     const mInRange = matches?.filter(x => x.);

    //     if (iNext === this.start) { return this; }
    //     return this.transform(iNext - this.start, 0);
    // }
    // trim = (regex?: RegExp) => {
    //     return this.trimStart(regex).trimEnd(regex);
    // }

    startsWith = (text: string) => {
        return this.source.startsWith(text, this.start);
    }

    trimStart = (patterns: string | string[] = [` `, `\t`, `\r`, `\n`]) => {
        const s = this.source;
        patterns = typeof patterns === `string` ? [patterns] : patterns;

        let i = this.start;
        let iLast = -1;

        while (i !== iLast) {
            iLast = i;
            for (const p of patterns) {
                if (s.startsWith(p, i)) {
                    i += p.length;
                    break;
                }
            }
        }

        return this.transform(i - this.start, 0);
    }

    trimEnd = (patterns: string | string[] = [` `, `\t`, `\r`, `\n`]) => {
        const s = this.source;
        patterns = typeof patterns === `string` ? [patterns] : patterns;

        let i = this.start + this.length;
        let iLast = -1;

        while (i !== iLast) {
            iLast = i;
            for (const p of patterns) {
                if (i - p.length >= 0 && s.startsWith(p, i - p.length)) {
                    i -= p.length;
                    break;
                }
            }
        }

        return this.transform(0, i - (this.start + this.length));
    }

    trim = (patterns: string | string[] = [` `, `\t`, `\r`, `\n`]) => {
        return this.trimStart(patterns).trimEnd(patterns);
    }

    transform = (offsetStart: number, offsetEnd: number) => {
        return new StringSpan(this.source, this.start + offsetStart, this.length + offsetEnd - offsetStart);
    };

    newRange = (start: number, length: number) => {
        return new StringSpan(this.source, start, length);
    };
};


const runStringSpanTests = () => {
    const text = ` This is a new test! `;
    const s = new StringSpan(text, 0, text.length);

    const test = (name: string, actual: unknown, expected: unknown) => {
        if (actual !== expected) { console.error(`FAIL - ${name}`, { actual, expected }); }
        else { console.log(`PASS - ${name}`); }
    };

    test(`new`, s.toText(), text);

    test(`startsWith`, s.startsWith(` `), true);
    test(`startsWith`, s.startsWith(`T`), false);

    test(`indexOf(a)`, s.indexOf(`a`), text.indexOf(`a`));
    test(`indexOf(i)`, s.indexOf(`i`), text.indexOf(`i`));
    test(`indexOf( )`, s.indexOf(` `), text.indexOf(` `));

    test(`lastIndexOf(a)`, s.lastIndexOf(`a`), text.lastIndexOf(`a`));
    test(`lastIndexOf(i)`, s.lastIndexOf(`i`), text.lastIndexOf(`i`));
    test(`lastIndexOf( )`, s.lastIndexOf(` `), text.lastIndexOf(` `));

    test(`splitOn`, s.splitOn(` `).join(``), text.split(` `).join(` `));
    test(`splitOnRegExp`, s.splitOnRegExp(/\W/g).join(``), text.split(` `).join(` `));
    test(`splitOnRegExp`, s.splitOnRegExp(/\W/g).join(`,`), ` This, is, a, new, test,!, `);
    test(`splitOnRegExp`, s.splitOnRegExp(/is/g).join(`,`), ` Th,is ,is a new test! `);
    test(`splitOnRegExp`, new StringSpan(`<span class="ca cb cc">test</span>`).splitOnRegExp(/('|")/g).join(`,`), `<span class=,"ca cb cc,">test</span>`);

    const s2 = new StringSpan(`<span class="ca cb cc">test</span>`).splitOn(`</span>`)[0].splitOn(`class`)[1];
    test(`splitOn       - s2`, s2.toText(), `class="ca cb cc">test`);
    test(`splitOnRegExp - s2`, s2.splitOnRegExp(/</g).join(`,`), `class="ca cb cc">test`);
    test(`splitOnRegExp - s2`, s2.splitOnRegExp(/>/g).join(`,`), `class="ca cb cc",>test`);
    test(`splitOnRegExp - s2`, s2.splitOnRegExp(/('|")/g).join(`,`), `class=,"ca cb cc,">test`);

    test(`trimStart`, s.trimStart().toText(), text.trimStart());
    test(`trimEnd`, s.trimEnd().toText(), text.trimEnd());
    test(`trim`, s.trim().toText(), text.trim());
    test(`trim Single`, s.trim(` `).toText(), `This is a new test!`);
    test(`trim Multiple`, s.trim([` `, `!`]).toText(), `This is a new test`);
    test(`trim Words`, s.trim([` `, `!`, `This`]).toText(), `is a new test`);
    test(`trim Complex`, s.trim().trim([`This`, `test!`]).trim().toText(), `is a new`);
};

// runStringSpanTests();
