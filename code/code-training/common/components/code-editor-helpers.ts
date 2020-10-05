export type CodeHtmlPair = {
    code: string;
    html: string;
};
export const splitCodeSpanTags = (html: string): CodeHtmlPair[] => {

    const p = html.split(`</span>`);
    const endsWithSpan = p.map((x, i) => ({ rest: x, spanEnd: i === p.length - 1 ? `` : `</span>` }));
    const spansAll = endsWithSpan.flatMap(s => {
        const p2 = s.rest.split(`<span`);
        const startsWithSpan = p2.map((x, i) => ({ spanStart: i === 0 ? `` : `<span`, rest: x, spanEnd: i === p2.length - 1 ? s.spanEnd : `` }));
        return startsWithSpan;
    });

    const spans = spansAll.filter(x => !!x.spanStart || !!x.rest || !!x.spanEnd);
    console.log(`spans`, { spans });

    const parts: CodeHtmlPair[] = spans.map(x => ({
        code: x.rest.substr(x.rest.lastIndexOf(`>`) + 1),
        html: x.spanStart + x.rest + x.spanEnd,
    }));
    return parts;
};

// // Tests
// const runTests = () => {
//     const assertCorrectItem = (actual: CodeHtmlPair, expected: CodeHtmlPair) => {
//         if (actual.html !== expected.html) {
//             console.error(`Assert Fail: html`, { actual, expected });
//         }
//         if (actual.code !== expected.code) {
//             console.error(`Assert Fail: code`, { actual, expected });
//         }
//     };

//     const assertCorrect = (actual: CodeHtmlPair[], expected: CodeHtmlPair[]) => {
//         if (actual.length !== expected.length) {
//             console.error(`Assert Fail: result length`, { actual, expected });
//             return;
//         }
//         actual.forEach((x, i) => { assertCorrectItem(actual[i], expected[i]); });
//     };

//     assertCorrect(splitCodeSpanTags(`No span`), [{ code: `No span`, html: `No span` }]);
//     assertCorrect(splitCodeSpanTags(`<span>In span</span>`), [{ code: `In span`, html: `<span>In span</span>` }]);
//     assertCorrect(splitCodeSpanTags(`<span>In span</span>No span`), [{ code: `In span`, html: `<span>In span</span>` }, { code: `No span`, html: `No span` }]);
//     assertCorrect(splitCodeSpanTags(`No span<span>In span</span>`), [{ code: `No span`, html: `No span` }, { code: `In span`, html: `<span>In span</span>` }]);
//     assertCorrect(splitCodeSpanTags(`<span>In span</span>No span<span>In span</span>`), [{ code: `In span`, html: `<span>In span</span>` }, { code: `No span`, html: `No span` }, { code: `In span`, html: `<span>In span</span>` }]);
//     const breakdance = `begin`;
// };
// runTests();
