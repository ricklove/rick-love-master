import { promises as fs } from 'fs';
import hash from 'hash-wasm';
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
export const bruteForce_theGreats_answer01_hashTest = async () => {
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

  const TARGET = `f8eec0d6db1f110801e2771e5effbb2d209720f67e5608d521f96d516387e65b`;
  // const TARGET = TEST_WORDS_HASH;

  // 5/8 known
  // TheOldGuitarist   |qqqqqqqqqqqqqqq|aaaaaaaaaaaaaaa|aaaaaaaaaaaaaa|aaaaaaaaaaaaa|aaaaaaaaaaaa|aaaaaaaaaaa|aaaaaaaaaa|aaaaaaaaa|aaaaaaaa|aaaaaaa|aaaaaa|aaaaa
  //GuerrillaGirls
  const words = `
TheOldGuitarist   |qqqqqqqqqqqqqqq|aaaaaaaaaaaaaaa|aaaaaaaaaaaaaa|aaaaaaaaaaaaa|aaaaaaaaaaaa|aaaaaaaaaaa|aaaaaaaaaa|aaaaaaaaa|aaaaaaaa|aaaaaaa|aaaaaa|aaaaa|aaaa|aaa|aa|a
lance             |rrrrr          |bbbbb|bbbb|bbb|bb|b          
nobody            |ssssss         |cccccc|ccccc|cccc|ccc|cc|c         
TheNewYorkSun     |ttttttttttttt  |ddddddddddddd  
1518              |uuuu           |eeee           
RhinocerosHorn    |vvvvvvvvvvvvvv |ffffffffffffff 
AubergeRavoux     |wwwwwwwwwwwww  |ggggggggggggg  
GuerrillaGirls    |xxxxxxxxxxxxxx |hhhhhhhhhhhhhh|hhhhhhhhhhhhh|hhhhhhhhhhhh|hhhhhhhhhhh|hhhhhhhhhh|hhhhhhhhh|hhhhhhhh|hhhhhhh|hhhhhh|hhhhh|hhhh|hhh|hh|h
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
${hashAnalysis.sort().join(`\n`)}
  `;
  await fs.writeFile(`./hash-analysis-test.txt`, report);
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

      if (countSame > 0){
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

      // if (hash === TARGET){
      //   log(`❗❗❗ FOUND IT THIS IS IT!!! ❗❗❗`, {
      //     TARGET,
      //     text,
      //     words: [
      //       words[i0][j0],
      //       words[i1][j1],
      //       words[i2][j2],
      //       words[i3][j3],
      //       words[i4][j4],
      //       words[i5][j5],
      //       words[i6][j6],
      //       words[i7][j7],
      //   ] });
      //   return true;
      // }

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
