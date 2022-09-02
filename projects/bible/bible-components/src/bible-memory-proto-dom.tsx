import { getWordRegex, randomIndex, randomItem, randomOrder } from '@ricklove/utils-core';
import { MemoryPassage } from './bible-memory-types';

export type MemoryRuntimeService = ReturnType<typeof createMemoryRuntimeService>;
export const createMemoryRuntimeService = () => {
  type Dependencies = {
    setDiagnosticHtml: (html: string) => void;
    setHintHtml: (html: string) => void;
    setOutputHtml: (html: string) => void;
    scrollToBottom: () => void;
  };

  const setup = ({
    setDiagnosticHtml: setDiagnostic,
    setHintHtml: setHint,
    setOutputHtml,
    scrollToBottom,
  }: Dependencies) => {
    const g = globalThis as unknown as {
      webkitSpeechRecognition: typeof globalThis.SpeechRecognition;
      //   webkitSpeechGrammarList: typeof globalThis.SpeechGrammarList;
      //   webkitSpeechRecognitionEvent: typeof globalThis.SpeechRecognitionEvent;
    };

    const SpeechRecognition = globalThis.SpeechRecognition || g.webkitSpeechRecognition;
    // const SpeechGrammarList = globalThis.SpeechGrammarList || g.webkitSpeechGrammarList;
    // const SpeechRecognitionEvent = globalThis.SpeechRecognitionEvent || g.webkitSpeechRecognitionEvent;

    let isRunning = false;

    const USE_SPEECH = true;
    const createSpeechRecognition = () => {
      try {
        if (!USE_SPEECH) {
          throw new Error(`SKIP SPEECH`);
        }
        return new SpeechRecognition();
      } catch {
        return {
          start: () => {
            // empty
          },
          stop: () => {
            // empty
          },
        } as SpeechRecognition;
      }
    };

    const recognition = createSpeechRecognition();

    // if (SpeechGrammarList) {
    //   // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
    //   // This code is provided as a demonstration of possible capability. You may choose not to use it.
    //   var speechRecognitionList = new SpeechGrammarList();
    //   var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
    //   speechRecognitionList.addFromString(grammar, 1);
    //   recognition.grammars = speechRecognitionList;
    // }
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    recognition.lang = `en-US`;
    // recognition.lang = 'es';

    let isEnglish = true;
    const setLanguage = (lang: string) => {
      console.log(`setLanguage`);
      isEnglish = lang.startsWith(`en`);

      recognition.lang = lang;
      recognition.stop();
      setTimeout(() => recognition.start(), 500);
    };

    let wordBanks = [{ isFinal: false, usedWords: new Set([`word@0`]) }];
    recognition.onresult = (event) => {
      // logDebug('onresult START');

      const allResults = [...(event.results as unknown as SpeechRecognitionResult[])];
      const allPartialResults = allResults
        .filter((x) => !x.isFinal)
        .flatMap((x) => [...(x as unknown as SpeechRecognitionAlternative[])]);
      const allFinalResults = allResults
        .filter((x) => x.isFinal)
        .flatMap((x) => [...(x as unknown as SpeechRecognitionAlternative[])]);
      const lastResults = [
        ...allResults.filter((x) => x.isFinal).map((x) => [...(x as unknown as SpeechRecognitionAlternative[])]),
        //...allFinalResults.length ? [allFinalResults] : [],
        allPartialResults,
      ];

      const newResultWords = lastResults.map((x, i) => {
        const allWords = [...x]
          .map((p) =>
            p.transcript
              .split(` `)
              .map((w, i) => `${normalizeWord(w)}@${i}`)
              .join(` `),
          )
          .join(` `)
          .split(` `);
        const newWords = allWords.filter((w) => !wordBanks[i]?.usedWords.has(w));
        return newWords;
      });

      console.log(`onresult`, {
        newResultWords,
        oldWordBanks: wordBanks.map((x) => ({ usedWords: [...x.usedWords] })),
        allResults,
        allFinalResults,
        allPartialResults,
        lastResults,
      });

      // Update word banks
      newResultWords.forEach((newWords, i) => {
        const wordBank = wordBanks[i] ?? (wordBanks[i] = { isFinal: false, usedWords: new Set() });
        newWords.forEach((w) => {
          wordBank.usedWords.add(w);
        });
      });

      // if (allFinalResults.length) {
      //   wordBanks = wordBanks.slice(1);
      // }

      addInput(
        newResultWords
          .flatMap((x) => x)
          .map((w) => w.split(`@`)[0])
          .map((x) => ({ text: x, matchMode: `phonetic` as const }))
          // max 10
          .slice(-10),
      );
    };

    recognition.onspeechend = () => {
      console.log(`onspeechend`);
      setDiagnostic(`onspeechend`);
      recognition.stop();
      wordBanks = [];

      setTimeout(() => {
        if (!isRunning) {
          return;
        }
        recognition.start();
      }, 250);
    };

    recognition.onnomatch = (event) => {
      setDiagnostic(`I don't understand!`);
    };

    recognition.onerror = (event) => {
      setDiagnostic(`Error occurred in recognition: ` + event.error);
    };

    // document.body.onclick = () => {
    //   recognition.start();
    //   console.log(`Ready to receive speech.`);
    // };

    // const output = document.querySelector(`.output`);
    // var diagnostic = document.querySelector(`.debug`);
    // const bg = document.querySelector(`html`);
    // const hints = document.querySelector(`.hints`);
    // const problems = document.querySelector(`.problems`);
    // const commands = document.querySelector(`.commands`);
    // const scrollTarget = document.querySelector(`.scrollTarget`);

    setHint(`Choose a passage above`);

    // const addCommand = (title: string, onClick: () => void) => {
    //   const div = document.createElement(`div`);
    //   div.className = `command`;
    //   div.textContent = title;
    //   div.onclick = onClick;
    //   commands.appendChild(div);
    // };

    const formatPassage = (text: string) => {
      return text
        .replace(/([,.?!:;)”’]+)(?!\w)/g, `$1\n    `)
        .replace(/ (and|or|but) /g, `\n    $1 `)
        .replace(/\n {4}\n {4}/g, `\n        `)
        .replace(/\n {4}\n {4}/g, `\n        `)
        .replace(/\n {4}\n {4}/g, `\n        `);
    };

    const wordColors = [
      { color: `#888888`, words: `the`.split(`|`) },
      { color: `#00FF00`, words: `and|or|but`.split(`|`) },
      { color: `#006666`, words: `not`.split(`|`) },
      { color: `#CCFF00`, words: `to|for|of|at|with`.split(`|`) },
      { color: `#0088FF`, words: `in|on|up|down|out`.split(`|`) },
      { color: `#88FF88`, words: `who|what|where|which|when|how|that`.split(`|`) },
      { color: `#8888FF`, words: `he|him|his`.split(`|`) },
      { color: `#00FFFF`, words: `they|them|their|theirs`.split(`|`) },
      { color: `#0033FF`, words: `you|your|yours`.split(`|`) },
      { color: `#FFFF33`, words: `I|me|my|mine`.split(`|`) },
      { color: `#6666FF`, words: `is|are|was|were|will|shall|be|has|have`.split(`|`) },
    ];

    const wordEmojis = [
      { emoji: `❤️`, words: `love`.split(`|`) },
      { emoji: `🖤`, words: `hate`.split(`|`) },
      { emoji: `🤣`, words: `joy`.split(`|`) },
      { emoji: `🙏`, words: `pray|prayer`.split(`|`) },
      { emoji: `🥺`, words: `beg|begging|beggar`.split(`|`) },
      { emoji: `😱`, words: `fear|afraid`.split(`|`) },
      { emoji: `😡`, words: `anger|angry`.split(`|`) },
      { emoji: `🩸`, words: `blood`.split(`|`) },
      { emoji: `🔥`, words: `fire|hell`.split(`|`) },
      { emoji: `🌊`, words: `water`.split(`|`) },
      { emoji: `🎁`, words: `give|gift`.split(`|`) },
      { emoji: `🏠`, words: `house`.split(`|`) },
      { emoji: `🧱`, words: `stone`.split(`|`) },
      { emoji: `🌌`, words: `world`.split(`|`) },
      { emoji: `🌍`, words: `earth`.split(`|`) },
      { emoji: `🍞`, words: `bread`.split(`|`) },
      { emoji: `🌲`, words: `plant|tree`.split(`|`) },
      { emoji: `🌱`, words: `seed|vine`.split(`|`) },
      { emoji: `👣`, words: `foot|feet`.split(`|`) },
      { emoji: `👨‍⚖️`, words: `judge|judges|judgement|court|guilt`.split(`|`) },

      { emoji: `🐂`, words: `cow|bull|ox`.split(`|`) },
      { emoji: `🐑`, words: `sheep|lamb`.split(`|`) },
      { emoji: `🐐`, words: `goat`.split(`|`) },
      { emoji: `🦁`, words: `lion`.split(`|`) },
      { emoji: `🐖`, words: `pig`.split(`|`) },
      { emoji: `🐺`, words: `wolf`.split(`|`) },
      { emoji: `🐕`, words: `dog`.split(`|`) },

      { emoji: `🔹`, words: `the`.split(`|`) },
      { emoji: `🔲`, words: `a|an`.split(`|`) },
      { emoji: `&&`, words: `and`.split(`|`) },
      { emoji: `||`, words: `or`.split(`|`) },

      { emoji: `🔘`, words: `of`.split(`|`) },
      { emoji: `⏩`, words: `to`.split(`|`) },
      { emoji: `💠`, words: `for`.split(`|`) },

      { emoji: `👉`, words: `you|your`.split(`|`) },
      { emoji: `👤`, words: `i|me|my`.split(`|`) },
      { emoji: `👨`, words: `he|him|his|man`.split(`|`) },
      { emoji: `👩`, words: `she|her|hers|woman`.split(`|`) },
      { emoji: `🚹`, words: `men`.split(`|`) },
      { emoji: `🚺`, words: `women`.split(`|`) },

      { emoji: `👨‍🦳`, words: `father`.split(`|`) },
      { emoji: `👩‍🦳`, words: `mother`.split(`|`) },
      { emoji: `🤴`, words: `lord`.split(`|`) },
      { emoji: `👶`, words: `child`.split(`|`) },
      { emoji: ``, words: `god`.split(`|`) },
      { emoji: `🌬`, words: `spirit`.split(`|`) },

      { emoji: `👥`, words: `they|them|their|theirs`.split(`|`) },
      { emoji: `🔵`, words: `it|its`.split(`|`) },

      { emoji: `🔻`, words: `in`.split(`|`) },
      { emoji: `🔛`, words: `on`.split(`|`) },
      { emoji: `🆙`, words: `up`.split(`|`) },
      { emoji: `⤵`, words: `into`.split(`|`) },
      { emoji: `↔`, words: `by`.split(`|`) },
      { emoji: `↪`, words: `from`.split(`|`) },
      { emoji: `➿`, words: `with`.split(`|`) },
      { emoji: ``, words: `as`.split(`|`) },

      { emoji: `↗`, words: `that|those|there`.split(`|`) },
      { emoji: `↘`, words: `this|here`.split(`|`) },

      { emoji: `❕`, words: `but`.split(`|`) },
      { emoji: `‼`, words: `not`.split(`|`) },

      { emoji: `↔`, words: `is|are|be`.split(`|`) },
      { emoji: `↔`, words: `was|were`.split(`|`) },
      { emoji: `↔`, words: `has|have|had`.split(`|`) },
      { emoji: `🔜`, words: `shall|should`.split(`|`) },
      { emoji: `⤴`, words: `will|would`.split(`|`) },
      { emoji: `⏩`, words: `let|lets`.split(`|`) },
      { emoji: `▶`, words: `so`.split(`|`) },

      { emoji: `❔`, words: `who|what|when`.split(`|`) },
      { emoji: `🧑❓`, words: `whoever`.split(`|`) },
      { emoji: `🤷‍♂️`, words: `anyone`.split(`|`) },
      { emoji: `👨‍👩‍👧‍👦`, words: `everyone`.split(`|`) },
      { emoji: `♾`, words: `all`.split(`|`) },
      { emoji: `🚶`, words: `someone`.split(`|`) },

      { emoji: `🔢`, words: `all`.split(`|`) },

      { emoji: `👄`, words: `say|said|saying`.split(`|`) },
      { emoji: `🎤`, words: `call|called`.split(`|`) },
      { emoji: `📢`, words: `tell|told|spoken`.split(`|`) },
      { emoji: `🗣`, words: `spoken`.split(`|`) },
      { emoji: `🦻`, words: `listen`.split(`|`) },
      { emoji: `👂`, words: `hear|heard`.split(`|`) },
      { emoji: `👁`, words: `look`.split(`|`) },
      { emoji: `👀`, words: `see|saw|behold`.split(`|`) },

      { emoji: `🌤`, words: `heaven`.split(`|`) },

      { emoji: `⁉`, words: `if`.split(`|`) },
      { emoji: `➡`, words: `then`.split(`|`) },
      { emoji: `⌛`, words: `until`.split(`|`) },
      { emoji: `🕒`, words: `now`.split(`|`) },

      { emoji: ``, words: `blessed`.split(`|`) },
      { emoji: `1️⃣`, words: `one`.split(`|`) },

      { emoji: ``, words: `come|came`.split(`|`) },
      { emoji: `🚦`, words: `go|went`.split(`|`) },
      { emoji: `🛑`, words: `stop`.split(`|`) },

      { emoji: `👑`, words: `kingdom`.split(`|`) },
      { emoji: `👑`, words: `christ`.split(`|`) },
      { emoji: `💡`, words: `light`.split(`|`) },
      { emoji: `🏆`, words: `great`.split(`|`) },

      { emoji: `👪`, words: `people`.split(`|`) },
      { emoji: `🛤`, words: `way`.split(`|`) },

      { emoji: `🏴‍☠️`, words: `take|took`.split(`|`) },
    ];

    const formatPart = (part: typeof partStates[number] & { index: number }) => {
      const { elapsedTime, word, text, isDone } = part;

      const wordEmoji = wordEmojis.find((x) => x.words.includes(word.toLowerCase()))?.emoji ?? ``;
      // const wordEmoji = ``;
      const wordToUse = isDone ? `${word}${wordEmoji}` : getTextWithBlanks(word);

      const textColor = !isEnglish ? undefined : wordColors.find((c) => c.words.some((w) => w === word))?.color;
      const errorStyle =
        elapsedTime > 10000
          ? `background:#FF0000;font-size:2.4em;`
          : elapsedTime > 5000
          ? `background:#880000;font-size:1.8em;`
          : elapsedTime > 2000
          ? `background:#440000;font-size:1.6em;`
          : elapsedTime > 500
          ? `background:#220000;font-size:1.2em;`
          : ``;

      //const displayStyle = `transform:rotate(${-30 + (60 / 4) * ((2 + part.index) % (4 + 1))}deg);`;
      // const displayStyle = part.index % 2 ? `` : `writing-mode:vertical-lr;text-orientation: upright;`;
      const displayStyle = ``;

      const colorStyle = `${textColor ? `color:${textColor};` : ``}${errorStyle}${displayStyle}`.trim();
      const content = !colorStyle
        ? text.replace(word, wordToUse)
        : text.replace(word, `<span style='display:inline-block;${colorStyle}'>${wordToUse}</span>`);
      return content;
    };

    const simplifyPronounciation = (text: string) => {
      // soundex
      return (
        text
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, ``)
          // Remove all h (because it is sometimes silent in starting position)
          .replace(/[h]/g, ``)
          .replace(/(?!^)[aeiouyhw]/g, ``)

          // All vowels the same
          .replace(/[aeiou]/g, `a`)

          .replace(/[bpfv]/g, `B`)
          // .replace(/[bp]/g, 'B')
          // .replace(/[fv]/g, 'F')

          .replace(/[cgjkqsxz]/g, `C`)
          // .replace(/[ckqsxz]/g, 'C')
          // .replace(/[gj]/g, 'G')

          .replace(/[dt]/g, `D`)
          .replace(/[l]/g, `L`)
          .replace(/[mn]/g, `M`)
          .replace(/[r]/g, `R`)

          // Remove duplicate letters
          .replace(/([A-Z])\1+/g, `$1`)
          .toLowerCase()
      );
    };

    const numbersSoundex = [
      { word: `one`, number: `1` },
      { word: `won`, number: `1` },

      { word: `two`, number: `2` },
      { word: `to`, number: `2` },

      { word: `three`, number: `3` },

      { word: `four`, number: `4` },
      { word: `for`, number: `4` },

      { word: `five`, number: `5` },
      { word: `six`, number: `6` },
      { word: `seven`, number: `7` },

      { word: `eight`, number: `8` },
      { word: `ate`, number: `8` },

      { word: `nine`, number: `9` },

      { word: `ten`, number: `10` },
      { word: `tin`, number: `10` },

      { word: `eleven`, number: `11` },
      { word: `twelve`, number: `12` },
      { word: `thirteen`, number: `13` },
      { word: `fourteen`, number: `14` },
      { word: `fifteen`, number: `15` },
      { word: `sixteen`, number: `16` },
      { word: `seventeen`, number: `17` },
      { word: `eightteen`, number: `18` },
      { word: `nineteen`, number: `19` },

      { word: `twenty`, number: `20` },
      { word: `thirty`, number: `30` },
      { word: `forty`, number: `40` },
      { word: `fifty`, number: `50` },
      { word: `sixty`, number: `60` },
      { word: `seventy`, number: `70` },
      { word: `eighty`, number: `80` },
      { word: `ninety`, number: `90` },
      { word: `hundred`, number: `100` },
    ].map((x) => ({
      ...x,
      normalized: simplifyPronounciation(x.word),
    }));

    const normalizeWord = (text: string) => {
      const cleaned = text
        .trim()
        // Remove accents
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]/g, ``);
      if (!isEnglish) {
        return simplifyPronounciation(cleaned);
      }

      const num = numbersSoundex.find((x) => x.number === cleaned);
      const sWord = num?.normalized;
      const s = sWord ?? simplifyPronounciation(cleaned);

      const n = numbersSoundex.find((x) => x.normalized === s);
      return n?.number ?? s;
    };

    let partStates = [
      {
        text: ``,
        word: ``,
        normalized: ``,
        isDone: false,
        startTime: 0,
        endTime: 0,
        elapsedTime: 0,
      },
    ];

    const getParts = (text: string): typeof partStates => {
      const partMatches = [...text.matchAll(getWordRegex())];

      let iNext = 0;
      const parts = partMatches.map((m, i) => {
        const isLast = i === partMatches.length - 1;
        const partText = text.substring(iNext, isLast ? text.length : (m?.index ?? 0) + m[0].length);
        const entry = {
          text: partText,
          word: getWordRegex().exec(partText)?.[0] ?? ``,
          normalized: normalizeWord(partText),
          isDone: false,
          endTime: 0,
          startTime: 0,
          elapsedTime: 0,
        };
        iNext += partText.length;
        return entry;
      });

      const normalizedBlanks = parts.filter((x) => !x.normalized);
      if (normalizedBlanks.length) {
        console.warn(`getParts - some parts are normalized to blank`, { normalizedBlanks });
        let iPartBlank = parts.findIndex((x) => !x.normalized);
        while (iPartBlank >= 0) {
          const partBlank = parts[iPartBlank];
          const partAfter = parts[iPartBlank + 1];
          const partBefore = parts[iPartBlank - 1];
          if (partAfter) {
            partAfter.text = partBlank.text + partAfter.text;
          } else if (partBefore) {
            partBefore.text += partBlank.text;
          } else {
            // No parts before or after - fail!
            console.error(`getParts - all parts are normalized to blank`, { normalizedBlanks });
            break;
          }

          parts.splice(iPartBlank, 1);
          iPartBlank = parts.findIndex((x) => !x.normalized);
          console.log(`getParts - combined blank part`, { partBlank, partAfter, partBefore, parts });
        }
      }

      console.log(`getParts`, { partMatches, parts, text });

      return parts;
    };

    const getTextWithBlanks = (text: string) => {
      const replacer =
        hintMode === `blank`
          ? () => `___`
          : hintMode === `letter`
          ? (x: string) => `${x[0]}___`
          : (x: string) => `_${x}_`;

      const result = text.replace(getWordRegex(), replacer);

      console.log(`getTextWithBlanks`, { hintMode, text, replacer, result });
      return result;
    };

    let hintMode = `blank`;
    const toggleHintMode = () => {
      switch (hintMode) {
        case `blank`: {
          hintMode = `letter`;
          break;
        }
        case `letter`: {
          hintMode = `word`;
          break;
        }
        case `word`: {
          hintMode = `blank`;
          break;
        }
      }

      addInput([]);
      setDiagnostic(`hintMode=${hintMode}`);
    };

    // addCommand(`Change Hint Mode`, toggleHintMode);

    const AHEAD_LENGTH = 3;

    const markPartDone = (p: typeof partStates[number]) => {
      p.isDone = true;
      p.endTime = Date.now();
      if (!p.startTime) {
        p.startTime = p.endTime;
      }
      p.elapsedTime = p.endTime - p.startTime;
    };

    const addInput = (newInput: { text: string; matchMode: 'firstLetter' | 'number' | 'phonetic' }[]) => {
      const partStatesWithIndex = partStates as (typeof partStates[number] & { index: number })[];
      partStatesWithIndex.forEach((p, i) => (p.index = i));

      const getPartsToMatch = () => {
        const iPartLastDone = Math.max(-1, ...partStatesWithIndex.filter((x) => x.isDone).map((x) => x.index));
        const nextPart = partStatesWithIndex.filter((x) => !x.isDone && x.index === iPartLastDone + 1);
        const forwardParts = partStatesWithIndex.filter(
          (x) => !x.isDone && x.index > iPartLastDone + 1 && x.index <= iPartLastDone + AHEAD_LENGTH,
        );
        const skippedParts = partStatesWithIndex.filter((x) => !x.isDone && x.index <= iPartLastDone);
        // Match next part, skipped parts, then forward parts
        const parts = [...nextPart, ...skippedParts, ...forwardParts];
        return {
          parts,
          iPartLastDone,
        };
      };

      let wasForwardPartCompleted = false;

      const inputItems = newInput.map((x) => ({ ...x, used: false }));

      for (const xInput of inputItems) {
        const partsToMatch = getPartsToMatch();
        const p = partsToMatch.parts.find((p) =>
          xInput.matchMode === `phonetic`
            ? xInput.text === p.normalized
            : xInput.matchMode === `number`
            ? p.word === xInput.text
            : p.word.toLowerCase().startsWith(xInput.text.toLowerCase()),
        );

        if (!p) {
          continue;
        }

        xInput.used = true;
        markPartDone(p);

        wasForwardPartCompleted = wasForwardPartCompleted || p.index > partsToMatch.iPartLastDone;
      }

      setDiagnostic(
        `unused: ${inputItems
          .filter((x) => !x.used)
          .map((x) => x.text)
          .join(` `)}`,
      );
      console.log(`updateResult`, { inputItems, partStatesWithIndex });

      const iPartLastDoneAfter = Math.max(-1, ...partStatesWithIndex.filter((x) => x.isDone).map((x) => x.index));
      const pNext = partStatesWithIndex[iPartLastDoneAfter + 1];
      if (pNext && !pNext.startTime) {
        pNext.startTime = Date.now();
      }

      const completed = partStatesWithIndex
        .filter((x) => x.index <= iPartLastDoneAfter + (hintMode !== `blank` ? 1 : 0))
        .map((x) => formatPart(x))
        .join(``);
      setOutputHtml(completed);

      if (wasForwardPartCompleted) {
        scrollToBottom();
      }

      const isDone = partStatesWithIndex.every((p) => p.isDone);
      if (isDone) {
        const elapsedTimeTotal = partStatesWithIndex
          .map((x) => x.elapsedTime)
          .reduce((out, x) => {
            out += x || 0;
            return out;
          }, 0);

        const averageTime = elapsedTimeTotal / partStatesWithIndex.length;
        const PERFECT_AVERAGE_TIME = 500;
        const WORST_AVERAGE_TIME = 3000;

        const scoreRatio = Math.min(
          1,
          Math.max(0, 1 - (averageTime - PERFECT_AVERAGE_TIME) / (WORST_AVERAGE_TIME - PERFECT_AVERAGE_TIME)),
        );

        console.log(`DONE!`, {
          scoreRatio,
          averageTime,
          elapsedTimeTotal,
          partStatesWithIndex,
          PERFECT_AVERAGE_TIME,
          WORST_AVERAGE_TIME,
        });
        doneCallback(scoreRatio);
      }

      setTimeout(() => {
        nextCallback();
      }, 0);
      return {
        isDone,
        inputItems,
      };
    };

    const resetProblem = (text: string, title: string, lang: string) => {
      setLanguage(lang);
      const formatted = formatPassage(text);
      partStates = getParts(formatted);

      setHint(`Say ${title}`);
      addInput([]);
      setDiagnostic(`AHEAD_LENGTH=${AHEAD_LENGTH}`);
    };

    const addToProblem = (text: string, title: string, lang: string) => {
      // Mark old as done
      partStates.filter((p) => !p.isDone).forEach((p) => markPartDone(p));

      // Add items
      setLanguage(lang);
      const formatted = formatPassage(text);
      partStates = [...partStates, ...getParts(formatted)];

      setHint(`Say ${title}`);
      addInput([]);
      setDiagnostic(`AHEAD_LENGTH=${AHEAD_LENGTH}`);
    };
    // resetProblem(passages[0], );

    let doneCallback = (scoreRatio: number) => {
      // Empty
    };
    let nextCallback = () => {
      // Empty
    };

    return {
      getParts: () => partStates,
      addInput,
      resetProblem,
      addToProblem,
      toggleHintMode,
      start: (onDone: (scoreRatio: number) => void, onNext: () => void) => {
        isRunning = true;
        doneCallback = onDone;
        nextCallback = onNext;
        recognition.start();
        setTimeout(() => {
          nextCallback();
        }, 0);
      },
      stop: () => {
        isRunning = false;
        recognition.stop();
      },
    };
  };

  const state = {
    instance: undefined as undefined | ReturnType<typeof setup>,
  };

  return {
    isActive: () => false,
    start: (hostDiv: HTMLDivElement, memoryPassage: MemoryPassage, onDone: (scoreRatio: number) => void) => {
      if (state.instance) {
        return;
      }

      const hintDiv = document.createElement(`div`);
      const outputDiv = document.createElement(`div`);
      outputDiv.style.whiteSpace = `pre-wrap`;
      const scrollTargetDiv = document.createElement(`div`);
      scrollTargetDiv.style.marginTop = `-50px`;
      scrollTargetDiv.style.height = `100px`;
      const diagnosticDiv = document.createElement(`div`);
      const textInput = document.createElement(`input`);
      textInput.type = `input`;
      // Disable autocomplete
      textInput.name = `${Date.now()}${Math.random()}`;
      textInput.spellcheck = false;
      textInput.autocapitalize = `off`;
      textInput.autocomplete = `off`;
      (textInput as unknown as { autocorrect: string }).autocorrect = `off`;

      const textForm = document.createElement(`form`);
      textForm.appendChild(textInput);

      const TEXT_INPUT_IMMEDIATE = false;
      const getFirstLetterInputs = (value: string) => {
        return [...value.matchAll(/(\d+|\w)/g)]
          .map((m) => m[0] ?? ``)
          .filter((x) => x)
          .map((x) => ({
            text: x,
            matchMode: Number.isInteger(Number(x)) ? (`number` as const) : (`firstLetter` as const),
          }));
      };

      textInput.onkeypress = (e) => {
        if (!TEXT_INPUT_IMMEDIATE) {
          return;
        }
        e.preventDefault();
        if (!state.instance) {
          return;
        }
        state.instance.addInput([{ text: e.key, matchMode: `firstLetter` }]);
      };
      textForm.onsubmit = (e) => {
        e.preventDefault();
        if (TEXT_INPUT_IMMEDIATE) {
          return;
        }
        if (!state.instance) {
          return;
        }

        const firstLetterOrNumbers = getFirstLetterInputs(textInput.value);
        const { isDone, inputItems } = state.instance.addInput(firstLetterOrNumbers);
        const iLastUsed = inputItems.length - 1 - [...inputItems].reverse().findIndex((x) => x.used);
        console.log(`textForm.onsubmit`, { firstLetterOrNumbers, inputItems, iLastUsed, input: textInput.value });

        textInput.value = inputItems
          .filter((x, i) => i > iLastUsed)
          .map((x) => x.text)
          .join(``);
        //textInput.value = ``;
        //textInput.value = isDone ? unused.map((x) => x.text).join(``) : ``;
        textInput.focus();
        e.preventDefault();
      };

      // Input buttons
      const choicesDiv = document.createElement(`div`);
      const onNext = () => {
        choicesDiv.innerHTML = ``;

        const parts = state.instance?.getParts();
        if (!parts) {
          return;
        }

        const iFirstUndone = parts.findIndex((p) => !p.isDone);
        if (iFirstUndone < 0) {
          return;
        }

        const iFirstDoneAfterUndone = parts.findIndex((p) => p.isDone, iFirstUndone + 1);
        const GROUP_SIZE = 3;
        const CHOICE_SIZE = 3;

        const partsGroup = parts
          .slice(iFirstUndone, iFirstDoneAfterUndone <= iFirstUndone ? undefined : iFirstDoneAfterUndone)
          .slice(0, GROUP_SIZE);
        if (!partsGroup.length) {
          console.error(`onNext - No undone parts found`, { parts, partsGroup, iFirstUndone, iFirstDoneAfterUndone });
          return;
        }

        const correctFirstLetters = partsGroup
          .map((x) => x.word)
          .map((x) => (Number.isInteger(Number(x)) ? x : x.substring(0, 1)))
          .map((x) => x.toLocaleLowerCase());

        const correctAnswer = correctFirstLetters.join(` `);
        const allWrongAnswers = [...new Array(10)].map(() => {
          const iPart = randomIndex(correctFirstLetters.length);
          const p = correctFirstLetters[iPart];
          const n = Number(p);
          const wrongP = Number.isInteger(n)
            ? `${Math.abs(n + randomIndex(7) - 3)}`
            : randomItem(
                `rstln rstln rstln rstln rstln aeiou aeiou aeiou abcdefghijklmnopqrstuvwxyz`
                  .replace(/\s/g, ``)
                  .split(``),
              );

          return correctFirstLetters.map((x, i) => (i === iPart ? wrongP : x)).join(` `);
        });

        const wrongAnswers = [...new Set(allWrongAnswers)].filter((x) => x !== correctAnswer);
        const allAnswers = [correctAnswer, ...wrongAnswers.slice(0, CHOICE_SIZE - 1)];
        const answers = randomOrder(allAnswers);

        const choicesContainer = document.createElement(`div`);

        answers.forEach((x) => {
          const d = document.createElement(`button`);
          d.innerText = x;
          d.onclick = () => {
            if (!state.instance) {
              return;
            }
            d.disabled = true;
            d.style.opacity = `0.5`;

            const isCorrect = x === correctAnswer;
            if (!isCorrect) {
              d.style.background = `#FF0000`;
              return;
            }
            state.instance.addInput(getFirstLetterInputs(x));
          };
          choicesContainer.appendChild(d);
        });
        choicesDiv.appendChild(choicesContainer);
      };

      hostDiv.appendChild(hintDiv);
      hostDiv.appendChild(outputDiv);
      hostDiv.appendChild(scrollTargetDiv);
      hostDiv.appendChild(choicesDiv);
      hostDiv.appendChild(textForm);
      hostDiv.appendChild(diagnosticDiv);
      // textInput.focus();

      const setDiagnosticHtml = (html: string) => {
        // diagnosticDiv.innerHTML = html;
        console.log(`diagnostic: ${html}`);
      };
      const setHintHtml = (html: string) => {
        hintDiv.innerHTML = html;
      };
      const setOutputHtml = (html: string) => {
        outputDiv.innerHTML = html;
      };
      const scrollToBottom = () => {
        scrollTargetDiv.scrollIntoView({ block: `start`, behavior: `smooth` });
      };
      state.instance = setup({
        setDiagnosticHtml,
        setHintHtml,
        setOutputHtml,
        scrollToBottom,
      });

      state.instance.resetProblem(memoryPassage.text, memoryPassage.title, memoryPassage.lang);
      state.instance.start(onDone, onNext);
    },
    setPassage: (memoryPassage: MemoryPassage) => {
      if (!state.instance) {
        return;
      }
      state.instance.addToProblem(memoryPassage.text, memoryPassage.title, memoryPassage.lang);
    },
    toggleHintMode: () => {
      if (!state.instance) {
        return;
      }
      state.instance.toggleHintMode();
    },
    stop: () => {
      if (!state.instance) {
        return;
      }
      state.instance.stop();
      state.instance = undefined;
    },
  };
};
