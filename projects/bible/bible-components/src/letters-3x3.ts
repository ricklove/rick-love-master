export const getChar3x3Grid = (letter: string) => {
  const l = letter.toLocaleLowerCase()[0];
  if (!l.match(/[a-z0-9]/)) {
    return;
  }

  const letterGrids = getLetterGrids();
  const letterGrid = letterGrids[l];
  console.log(`getLetterGrid`, { l, letterGrids, letterGrid });
  return letterGrid;
};

type LetterGridEntry = {
  letter: string;
  gridSource: string[];
  grid: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
};
type LetterGrids = {
  [letter: string]: LetterGridEntry;
};
const cache = {
  letters: undefined as undefined | LetterGrids,
};
const getLetterGrids = (): LetterGrids => {
  if (cache.letters) {
    return cache.letters;
  }

  const parseLetters = () => {
    const letterLines = lettersText
      .split(`\n`)
      .map((x) => x.trim())
      .filter((x) => x)
      .map((x) => x.replace(/\|/g, ``));

    const letterGrids = {} as LetterGrids;
    const addGridItem = (letter: string, lines: string[]) => {
      const gridItem =
        letterGrids[letter] ??
        (letterGrids[letter] = {
          letter: letter,
          gridSource: lines,
          grid: [false, false, false, false, false, false, false, false, false],
        });
      const grid = gridItem.grid;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          grid[i + j * 3] = lines[j].substring(i)[0] !== ` `;
        }
      }
    };

    // Letters
    for (let c = 0; c < 26; c++) {
      const lines = letterLines.slice(c * 3, c * 3 + 3);
      const cChar = String.fromCharCode(`a`.charCodeAt(0) + c);
      addGridItem(cChar, lines);
    }

    // Numbers
    for (let n = 0; n < 10; n++) {
      const numStart = 26 * 3;
      const lines = letterLines.slice(numStart + n * 3, numStart + n * 3 + 3);
      const nLetter = String.fromCharCode(`0`.charCodeAt(0) + n);
      addGridItem(nLetter, lines);
    }

    return letterGrids;
  };

  cache.letters = parseLetters();
  return cache.letters;
};

const lettersText = `

| x |
|xxx|
|x x|

|xx |
|xxx|
|xxx|

| xx|
|x  |
| xx|

|xx |
|x x|
|xx |

|xxx|
|xx |
|xxx|

|xxx|
|xx |
|x  |

|xx |
|x x|
|xxx|

|x x|
|xxx|
|x x|

|xxx|
| x |
|xxx|

|  x|
|  x|
|xx |

|x x|
|xx |
|x x|

|x  |
|x  |
|xxx|

|xxx|
|xxx|
|x x|

|xxx|
|x x|
|x x|

|xxx|
|x x|
|xxx|

|xxx|
|xxx|
|x  |

| x |
|x x|
| xx|

|xxx|
|x x|
|x  |

| xx|
| x |
|xx |

|xxx|
| x |
| x |

|x x|
|x x|
|xxx|

|x x|
|x x|
| x |

|x x|
|xxx|
|xxx|

|x x|
| x |
|x x|

|x x|
| x |
| x |

|xx |
| x |
| xx|

| xx|
|x x|
|xx |

| x |
| x |
| x |

|xx |
| x |
| xx|

|xx |
| xx|
|xxx|

|x x|
|xxx|
|  x|

| xx|
| x |
|xx |

|x  |
|xxx|
|xxx|

|xxx|
|  x|
|  x|

| xx|
|xxx|
|xx |

|xxx|
|xxx|
|  x|

`;
