import { StringSpan } from './string-span';

declare let console: {
  log: (message: string, data?: unknown) => void;
  error: (message: string, data?: unknown) => void;
};
const runStringSpanTests = () => {
  const text = ` This is a new test! `;
  const s = new StringSpan(text, 0, text.length);

  const test = (name: string, actual: unknown, expected: unknown) => {
    if (actual !== expected) {
      console.error(`FAIL - ${name}`, { actual, expected });
    } else {
      console.log(`PASS - ${name}`);
    }
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
  test(
    `splitOnRegExp`,
    new StringSpan(`<span class="ca cb cc">test</span>`).splitOnRegExp(/('|")/g).join(`,`),
    `<span class=,"ca cb cc,">test</span>`,
  );

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

runStringSpanTests();
