import { promises as fs } from 'fs';
import hash from 'hash-wasm';
import { portraitsMen } from './research/works/portraits-men';
const { keccak } = hash;

const getHash = async (value: string) => {
  return await keccak(value, 256);
  // kaccak256.reset();
  // kaccak256.update(value);
  // const hash = kaccak256.digest(`hex`);

  // return hash;
};

// const hashes = '';
// const saveHash = (value)=>{
//     hashes+=value + '\n';
// };

const log = (message: string, obj?: unknown) => {
  console.log(message, obj);
};

// let output = '';
const writeLine = (message: string) => {
  // console.log(message);
  // output += message + '/n';
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const bruteForce_theGreats_answer03 = async () => {
  // contract:   getHash('test') = 0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658
  // js:         getHash('test') = 0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658
  // hash-wasm:  getHash('test') = 9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658
  log(`getHash(test)`, { hash: await getHash(`test`) });
  log(`getHash(124816)`, { hash: await getHash(`124816`) });

  // Test hash
  // Contract: 0x0155E3FE6A0b0E4af3320b241dB4258F4871BF19
  const TEST_WORDS_HASH = `edab1d3eabda2509fcebdbcb51603b6f3b20d974f88ad07442d5460d3e8931c1`;
  log(`getHash(words)`, {
    hash: await getHash(
      `
TheOldGuitarist  
Banderillas      
nobody           
PennyPress       
1988             
Narcissus        
AubergeRavoux    
TheImpressionists`
        .toLocaleLowerCase()
        .split(`\n`)
        .map((x) => x.trim())
        .filter((x) => x)
        .sort()
        .join(``),
    ),
  });

  // getHash(124816) = 13d3711985f56632c7a7b9a9f418746c493e9e9f1458ceefb7f69196bb847dbc

  // Hashes from js (for door)
  // secretHashs: [
  //     '0x13d3711985f56632c7a7b9a9f418746c493e9e9f1458ceefb7f69196bb847dbc',
  //     '0xa8730996e37737917624eefdab10481abca521b2255f832d124830ad27c0b03d',
  //     '0x5cca18324dde73940714affef9ca0ff98c074a0914b4a279a5e4a3d290aad0cc',
  //     '',
  // ],

  // Hashes from contract:
  // contract.ANSWER_HASHES(0) = "0xf8eec0d6db1f110801e2771e5effbb2d209720f67e5608d521f96d516387e65b"
  // contract.ANSWER_HASHES(1) = "0x79976ca52d5d47399ce2b26ad0e50be7b5eccccde7829059fe42fcd239dbc4de"
  // contract.ANSWER_HASHES(2) = "0xed04e577862ee91805cfdc2a1eafa3f0030edc74fbcc49100aee05a6ca8f32ab"
  // Hashes from new contract:
  // "answerHashes0": "0x79976ca52d5d47399ce2b26ad0e50be7b5eccccde7829059fe42fcd239dbc4de",
  // "answerHashes1": "0xed04e577862ee91805cfdc2a1eafa3f0030edc74fbcc49100aee05a6ca8f32ab"

  // From js (different from contract hash)
  // const TARGET = `0xf8eec0d6db1f110801e2771e5effbb2d209720f67e5608d521f96d516387e65b`;
  // const TARGET = `f8eec0d6db1f110801e2771e5effbb2d209720f67e5608d521f96d516387e65b`;

  // Pablo Picasso
  // Leonardo da Vinci
  // Roy Lichtenstein
  // Andy Warhol
  // Salvador Dalí
  // Vincent Van Gogh

  /**
48 Speech on the cubic form - Dali 💯
Amboise|Auvers-sur-Oise|Vauvenargues 💯
Times Square Mural 💯
amiga/amiga computer
henri rousseau

### Only 5 of these are right?

White: Vauvenargues - Picasso / Amboise (Da Vinci) / Auvers-sur-Oise (Van Gogh) 💯
Blue: 48 - Based on "Speech on the Cubic Form" by Dali 💯
Yellow: Joseph Roulin/Pere Tanguy/Dr. Gachet / Eugene Boch - Van Gogh 💯
Orange: 24 - 27? - Based on "The Hallucinogenic Toreador" - Dali 💯
Black: Poplars? "avenues of poplars in Autumn" - Van Gogh 💯
Red: Times Square Mural - Lichtenstein (commented by Judas that it could be wrong) 💯
Summary of what I got from discord history
I think we also had alternatives by Picasso on Black so White could be Van Gogh

White: Vauvenargues - Picasso ? 💯
Blue: 48 - Based on "Speech on the Cubic Form" by Dali 💯
Yellow: Joseph Roulin - Van Gogh ? 💯
Orange: Les Arènes - Van Gogh
Black:
Red: Times Square Mural - Lichtenstein 💯

I changed Orange and Black might be somethung else too so I took it out of my list if anyone has an idea shoot it

### Only 5 of these are right?

White: Vauvenargues - Picasso / Amboise (Da Vinci) / Auvers-sur-Oise (Van Gogh) 💯💯💯💯
Blue: 48 - Based on "Speech on the Cubic Form" by Dali 💯💯💯💯
Yellow: Joseph Roulin/Pere Tanguy/Dr. Gachet / Eugene Boch - Van Gogh ?💯
Orange: 24 - 27? - Based on "The Hallucinogenic Toreador" - Dali 💯💯
Black: Poplars? "avenues of poplars in Autumn" - Van Gogh 💯💯
Red: Times Square Mural - Lichtenstein (commented by Judas that it could be wrong) 💯💯


*/
  const _knownAt5_8 = ``;

  /**

## 5/8 Known (below)


### 1 Blue 💯

```
tice f specs...find the corners, add the numbers, multiply with the odd one (Blue)
```

- 48 💯💯💯💯
    -  "Speech on the cubic form" - Dali 💯
        - tice f specs 💯 on painting
        - find the corners = 2
        - add the numbers = 2 * 8 = 16
        - multiply with the odd one (3 is in the center)
        - 2*8*3 = 48
        - alt
          - add the numbers (include 3) = 2 * 8 + 3 = 19
          - 19*3 = 57



### 2 Yellow 💯

```
I told my family about a portrait of him. (Yellow)
```

- Paul Gachet / Dr Gachet 💯
    - "Portrait of Dr. Gachet" - Van Gogh
    - https://lifeofvangogh.com/paintings/the-portrait-of-dr-gachet/


### 3 White

```
The name of the village in which I lay. (White)
```

- Amboise (Da Vinci)
- Auvers-sur-Oise (Van Gogh)
- Vauvenargues (Picaso)


### 4 Red 💯

```
Find it underground with an even number in a place of BIG numbers (Red)
```

- "Times Square Mural" - Roy Lichtenstein
    - 42 (event number)
    - place of BIG numbers (subway numbers?)
    - https://web.archive.org/web/20100201042728/http://www.lichtensteinfoundation.org/timesqmural.htm


- Big Painting VI Lich and Big Campbell's Soup Can Warhol both set records for highest sold painting
- christie's underground art vault
-

### 5 Green

```
Summation of stitches on her left, take away the cubed stitches on the right, multiply by number of aves you see (Green)
```

- ? number [0-1000]
  - ? (Summation of stitches on her left)
  - ? (take away the cubed stitches on the right)
  - ? (multiply by number of aves you see)
  - ? (aves = birds?)

- 10|-4|15|-6
     - Leonardo da Vinci
     - https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Leonardo_da_Vinci_attributed_-_Madonna_Litta.jpg/1200px-Leonardo_da_Vinci_attributed_-_Madonna_Litta.jpg
     - 14 stiches on her left
     - 3|4 stiched on her right (27|64)
     - 14 stiched on right (14^3=2744)
     - 2? = 1 Bird in hand, 1 Ave Maria
     * -26 = (14 - 27) * 2
     * -100 = (14-64) * 2
     * -5460 = (14-2744) * 2

### 6 Brown

```
Machine. URT1. (Brown)
```

- ? amiga/amiga computer
    - Andy Warhol
    - the only URT1 is a 1977 antenna
    - URT1 = You are the one
        - https://en.wikipedia.org/wiki/You_Are_the_One_(Andy_Warhol)
        - https://www.cryptomuseum.com/covert/bugs/ec/urs1/urt1.htm
    - ? https://www.warhol.org/exhibition/warhol-and-the-amiga/


### 7 Black

```
A perspective of these at sunset and fall. (Black)
```

- garrigue|ruins|MontmajourAbbey
  - "Sunset at Montmajour" - Van gogh

- trees|SquareSaint-Pierre|SquareSaintPierre|park
    - "Square Saint-Pierre at Sunset" - Van gogh
    - This was his way of suggesting the fall of night.

- willows
    - "POLLARD WILLOWS AT SUNSET" - Van Gogh

- poplars
    - "Avenue of Poplars at Sunset" - Van Gogh
    - https://en.wikipedia.org/wiki/Avenue_of_Poplars_at_Sunset
    - https://en.wikipedia.org/wiki/Avenue_of_Poplars_in_Autumn
        - "The last thing I made is a rather large study of an avenue of poplars, with yellow autumn leaves, the sun casting, here and there,
          sparkling spots on the fallen leaves on the ground, alternating with the long shadows of the stems. At the end of the road is a small cottage, and over it all the blue sky through the autumn leaves."

- wheatfield|crows

- clocks
    - Dali

- ? henri rousseau
    - How is this related?
    - tower
    - light house
    - trees

### 8 Orange

```
She hates the games, how many exits from the arena? (Orange)
```

- ? number [0-1000]

- 24|25
    - "The Hallucinogenic Toreador" - dali
        - http://salvadordaliprints.org/hallucinogenic-toreador/
        - A woman crying with a bull dead
        - Hallucinogenic Toreador displays Dali's wife's disdain for bullfighting


*/
  const _notes = ``;

  // all the answers are tied to the artists we've selected that matter...no answers are artists

  const TARGET = `ed04e577862ee91805cfdc2a1eafa3f0030edc74fbcc49100aee05a6ca8f32ab`;
  // const TARGET = TEST_WORDS_HASH;

  const allPortaitsMen = portraitsMen.join(`|`);
  // 5/8 known
  const words = `
48|57 //|${[...new Array(200)].map((_, i) => `${i}`).join(`|`)} // 💯💯💯💯💯
JozefBlok|Jeanne d’Arc|Michelet|Renan|Weissenbruch|Johan van Gogh|Michelet|Calvin|Leonardo da Vinci|Roy Lichtenstein|Andy Warhol|Salvador Dalí|Vincent Van Gogh|Johan van Gogh|De Ruyter|Rev. Heldring|Weissenbruch|Corot|Millet|Pa|Van der W.|Shakespeare|Victor Hugo|Kee Vos|Frans Hals|M. de Vos|Rembrand|Delaroche|Portaels|Edmond de Goncourt|JanSix|Six|Tanguy|Roulin|Milliet|Seurat|Bruyas|Gauguin|Boch|Besnard|Mathey|Laval|Hetzel|Rotterdam|Russell|Bruyas |Puvis de Chavannes|Rembrandt|Bracquemond|Delacroix|Lautrec|Hirschig|Jesus|Elijah|Dickens|PuvisDeChavannes|Guillaumin|Jo|Arlesienne|Arlésienne|Comte|GeorgeSand|DoctorGachet|DrGachet|Dr.Gachet|DoctorPaulGachet|PaulGachet|Dickens|CharlesDickens|VanGogh|myself|Corot|FelixRey|CarelFabritius|JosephRoulin|PereTanguy|EugeneBoch|GinevraBenci|${allPortaitsMen} // 💯
Vauvenargues|Amboise|Auvers-sur-Oise|FIGUERES // Probably 💯 
TimesSquareMural|TimesSquare // |42|MONA|MuseumOfNewArt // ? 💯
-26|-100|-5460|${[...new Array(200)].map((_, i) => `${i - 100}`).join(`|`)}
amiga|Amiga1000|MarilynMonroe // 💯💯💯💯💯 |amigaComputer|commodore|commodoreAmiga|amiga1000|A1000|amigaComputer 
poplars // 💯💯💯 |poplarTrees|figures|magi|PortLligat|tonalities|light|rays|shadows|lines|clouds|eye|eyes|rocks|tesseract|prayingMantis|mantis|farmers|desire|dream|dreams|atoms|time|memory|cubes|clocks|crows|poplars|willows|trees|park|SquareSaint-Pierre|SquareSaintPierre|garrigue|ruins|MontmajourAbbey|henriRousseau // probably not henriRousseau (so was not 5/8)
27|26|25|24|1|0 //|${[...new Array(200)].map((_, i) => `${i}`).join(`|`)} // ? 💯💯
`
    .toLowerCase()
    .trim()
    .split(`\n`)
    .map((x) => x.trim().replace(/\s/g, ``))
    .filter((x) => x)
    .map((x) =>
      x
        .split(`//`)[0]
        .split(`|`)
        .map((x) => x.trim()),
    );

  console.log(`words`, { words });
  const indexArray = [...new Array(TARGET.length)].map((_, i) => i);

  // Fast check (3 answers each)
  if (
    await findHash(
      words.map((w) => [...w.slice(0, 6)]),
      TARGET,
      indexArray,
    )
  ) {
    log(`WOW!!!!!`);
    return;
  }

  // Full check
  if (await findHash(words, TARGET, indexArray)) {
    log(`WOW!!!!!`);
    return;
  }

  await analyzeHash();

  log(`DONE`);
};

const analyzeHash = async () => {
  const allWords = hashAnalysis.flatMap((l) => l.split(` `).slice(2)).filter((x) => x);

  const allWordsCountMap = new Map(allWords.map((x) => [x, 0]));
  allWords.forEach((x) => allWordsCountMap.set(x, (allWordsCountMap.get(x) ?? 0) + 1));

  const report = `
${[...allWordsCountMap.entries()]
  .map(([value, count]) => `${`${count}`.padStart(6, `0`)}: ${value}`)
  .sort()
  .join(`\n`)}

  `;

  // ${hashAnalysis.sort().join(`\n`)}

  await fs.writeFile(`./hash-analysis.txt`, report);
};

const hashAnalysis = [] as string[];
const findHash = async (words: string[][], TARGET: string, indexArray: number[]) => {
  log(`words`, words.join(` `));

  let i = 0;
  //let total = 8 * 7 * 6 * 5 * 4 * 3 * 2;
  // words.forEach((x) => (total *= x.length));

  // Order known
  let total = 1;
  words.forEach((x) => (total *= x.length));

  /* eslint-disable */
  /* prettier-ignore */ const i0Start = 0, i0End = 0;
  /* prettier-ignore */ const i1Start = 1, i1End = 1;
  /* prettier-ignore */ const i2Start = 2, i2End = 2;
  /* prettier-ignore */ const i3Start = 3, i3End = 3;
  /* prettier-ignore */ const i4Start = 4, i4End = 4;
  /* prettier-ignore */ const i5Start = 5, i5End = 5;
  /* prettier-ignore */ const i6Start = 6, i6End = 6;
  /* prettier-ignore */ const i7Start = 7, i7End = 7;

  /* prettier-ignore */
  for(let i0 = i0Start; i0 <= i0End; i0++){
      log('i',i);
    for(let j0 = 0; j0 < words[i0].length; j0++){

    for(let i1 = i1Start; i1 <= i1End; i1++){  
      if(i1===i0){continue;}
    for(let j1 = 0; j1 < words[i1].length; j1++){

    for(let i2 = i2Start; i2 <= i2End; i2++){  
      if(i2===i0){continue;}
      if(i2===i1){continue;}
    for(let j2 = 0; j2 < words[i2].length; j2++){

    for(let i3 = i3Start; i3 <= i3End; i3++){  
      if(i3===i0){continue;}
      if(i3===i1){continue;}
      if(i3===i2){continue;}
    for(let j3 = 0; j3 < words[i3].length; j3++){

    for(let i4 = i4Start; i4 <= i4End; i4++){ 
      if(i4===i0){continue;}
      if(i4===i1){continue;}
      if(i4===i2){continue;}
      if(i4===i3){continue;} 
    for(let j4 = 0; j4 < words[i4].length; j4++){

    for(let i5 = i5Start; i5 <= i5End; i5++){ 
      if(i5===i0){continue;}
      if(i5===i1){continue;}
      if(i5===i2){continue;}
      if(i5===i3){continue;}
      if(i5===i4){continue;} 
    for(let j5 = 0; j5 < words[i5].length; j5++){

    for(let i6 = i6Start; i6 <= i6End; i6++){  
      if(i6===i0){continue;}
      if(i6===i1){continue;}
      if(i6===i2){continue;}
      if(i6===i3){continue;}
      if(i6===i4){continue;}
      if(i6===i5){continue;} 
    for(let j6 = 0; j6 < words[i6].length; j6++){
      
    for(let i7 = i7Start; i7 <= i7End; i7++){  
      if(i7===i0){continue;}
      if(i7===i1){continue;}
      if(i7===i2){continue;}
      if(i7===i3){continue;}
      if(i7===i4){continue;}
      if(i7===i5){continue;}
      if(i7===i6){continue;} 
    for(let j7 = 0; j7 < words[i7].length; j7++){
    /* eslint-enable */

      const text = ``
        + words[i0][j0]
        + words[i1][j1]
        + words[i2][j2]
        + words[i3][j3]
        + words[i4][j4]
        + words[i5][j5]
        + words[i6][j6]
        + words[i7][j7]
      ;
      // const input = text.toLowerCase().replace(/ /g, '');
      const input = text;
      const hash = await getHash(input);
      // const hash = saveHash(input);
      // const hash = '';
      // writeLine(input);

      if (i % 100000 === 0){
        log(`\n${i} / ${total} = ${(100 * i / total).toFixed(3)}%`);
        log(`input`, input);
        log(text, {
            words: [
              words[i0][j0],
              words[i1][j1],
              words[i2][j2],
              words[i3][j3],
              words[i4][j4],
              words[i5][j5],
              words[i6][j6],
              words[i7][j7],
          ].join(` `) });
        // log('hash',{hash__:hash,TARGET});
        log(`hash__`, hash);
        log(`TARGET`, TARGET);
      }

      let countSame = 0;
      let countSameInRow = 0;
      let maxCountSameInRow = 0;
      let iCountSameInRow = 0;
      let iMaxCountSameInRow = 0;
      const bytesSame = indexArray.map(i => {
        if (hash[i] !== TARGET[i]){
          countSameInRow = 0;
          iCountSameInRow = i + 1;
          return `_`;
        }

        countSameInRow++;
        if (countSameInRow > maxCountSameInRow){
          maxCountSameInRow = countSameInRow;
          iMaxCountSameInRow = iCountSameInRow;
        }
        countSame++;
        return hash[i];
      }).join(``);

      if (countSame > 1){
        //console.log(`${bytesSame} ${input}`);
        const inputWithSpaces = [
            words[i0][j0],
            words[i1][j1],
            words[i2][j2],
            words[i3][j3],
            words[i4][j4],
            words[i5][j5],
            words[i6][j6],
            words[i7][j7],
        ].join(` `);
        hashAnalysis.push(`${`${countSame}`.padStart(5, `0`)} ${bytesSame} ${inputWithSpaces}`);
      }

      if (hash === TARGET){
        log(`❗❗❗ FOUND IT THIS IS IT!!! ❗❗❗`, {
          TARGET,
          text,
          words: [
            words[i0][j0],
            words[i1][j1],
            words[i2][j2],
            words[i3][j3],
            words[i4][j4],
            words[i5][j5],
            words[i6][j6],
            words[i7][j7],
        ] });
        return true;
      }

      i++;

    /* eslint-disable */
    }}}}}}}}
    }}}}}}}}
  /* eslint-enable */

  log(`words`, words.map((x) => x.join(`|`)).join(` `));
  log(`NO FIND IT!`, i);

  return false;
};

// const bruteForce = ()=>{

//     let i = 0;
//     let timeStart = Date.now();
//     while(true){
//         if(checkAnswer(`test${i}`)) {
//             log('YOU WIN!!!', answer);
//         }

//         if( i % 100){
//             const time = Date.now() - timeStart;
//             log(`fps: ${i/time*1000}`, {i, time});
//         }
//         i++;
//     }

//     log('YOU LOSE!!!', answer);
// };
