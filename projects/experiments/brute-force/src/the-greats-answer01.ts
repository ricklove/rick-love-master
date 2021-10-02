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
export const bruteForce_theGreats_answer01 = async () => {
  // contract:   getHash('test') = 0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658
  // js:         getHash('test') = 0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658
  // hash-wasm:  getHash('test') = 9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658
  log(`getHash(test)`, { hash: await getHash(`test`) });
  log(`getHash(124816)`, { hash: await getHash(`124816`) });

  // Test hash
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

  // From js (different from contract hash)
  // const TARGET = `0xf8eec0d6db1f110801e2771e5effbb2d209720f67e5608d521f96d516387e65b`;
  // const TARGET = `f8eec0d6db1f110801e2771e5effbb2d209720f67e5608d521f96d516387e65b`;
  // const words = `ff0000 ffff00 ffc100 000000 0000ff 00ff00 a98c65 bc00bc`.split(' ');
  // const words = `ff0000 ffff00 ffc100 000000 0000ff 00ff00 a98c65 bc00bc`.split(' ').map(x=>`#${x}`);
  // const words = `red yellow orange black blue green brown purple`.split(' ');
  // const words = `red yellow orange black blue green gold purple`.split(' ');
  // const words = `red yellow orange black blue green tan purple`.split(' ');
  // const words = `must not be colors I think wonder what`.split(' ');
  // const words = `picasso dali lichtenstein da vinci van gogh warhol`.split(' ');
  // const words = `picasso dali lichtenstein davinci davinci vangogh vangogh warhol`.split(' ');
  // const words = `picasso dali lichtenstein davinci vangogh warhol manna adame`.split(' ');
  // const words = `TheOldGuitarist SeventhStreetBridge Jesus NewYorkSun AnonymousSocietyofPaintersSculptorsEngraversEtc`.toLowerCase().split(' ');
  // const words = `not that`.split(' ');
  // const words = `Cubism Impressionism`.split(' ');
  //     const words = `
  // TheOldGuitarist
  // Banderillas
  // Muleta
  // MonaLisa
  // TheNewYorkSun
  // 1988
  // Narcissus
  // daffodil
  // SeventhStreetBridge
  // AubergeRavoux
  // Impressionists
  // `.toLowerCase().trim().replace(/\r?\n/g,' ').split(' ').map(x=>x).reverse();

  // 4 of these are right (and always been the same 4):
  // Red - "The Old Guitarist" 💯
  // Green - "Bee", "Bees" [NEW]
  // Orange = "Mae West", "Mona Lisa", "Nobody" 💯
  // Black = "The New York Sun" ?💯
  // Purple = "Banksy" [NEW - NO!]
  // Yellow = "Descabello" [NEW]
  // Brown = "Auberge Ravoux" ???💯
  // Blue = ?

  /*
ok I must now go lay down for a bit
I've been up well past my time to sleep and it is very late here
When I return I will spread more help and lies :slight_smile:
one more hint...all the answers are tied to the artists we've selected that matter...no answers are artists
look at me Judas, helping, I must atone for what I did to Jesus
  */

  /*

So we know the four that we have...
We know anon is a warhol clue
We know green is a dali clue
We know yellow has something to do with bullfighting
And blue we have no fucking idea but we can guess it

*/

  /*

OTHER THINGS WE KNOW:
purple: it is a person that is currently alive that was in an exhibition with warhol OR warhol painted them
green: inside of a dali painting AND can fit in your hand
yellow: something to do with bullfighting

*/

  // all the answers are tied to the artists we've selected that matter...no answers are artists

  const TARGET = `f8eec0d6db1f110801e2771e5effbb2d209720f67e5608d521f96d516387e65b`;
  // const TARGET = TEST_WORDS_HASH;
  const words = `
TheOldGuitarist             // 💯 | OldGuitarist
banderillas                 // NOT?!?  | Muleta|espada   |sword|gloves |Descabello | cape
nobody                      // 💯 | MonaLisa
TheNewYorkSun|NewYorkSon    // sensationalism  | PennyPress      |TheNewYorkSun|NewYorkSun  // ???
2019     // ? Maybe         // | 1988 NOT             //   |1515|1964
time                        // | Narcissus          |daffodil|SeventhStreetBridge|love|flower|swan
Holland|AubergeRavoux       // ??? 😎🤯🤓 💯 |Helvoirt           |AubergeRavoux      // |Auvers-sur-Oise
Impressionists              // ! Not ???💯 |Impressionists|Impressionist|AnonymousSociety|LadiesAndGentlemen 
`
    .toLowerCase()
    .trim()
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x)
    .reverse()
    .map((x) =>
      x
        .split(`//`)[0]
        .split(`|`)
        .map((x) => x.trim()),
    );

  console.log(`words`, { words });

  // SeventhStreetBridge|Narcissus|daffodil|egg
  //

  // Picasso - violin hanging on the Wall
  // Picasso - Ma Jolie
  // Warhol - Four Mona Lisas
  // Warhol - Marilyn Monroe 31
  // Van Gogh - Starry Night
  // Van Gogh - Wheatfield With Crows

  // Da’Vinci - The Virgin and Child with Saint Anne
  // Da’Vinci - The Last Supper
  // Dali - Metamorphosis of Narcissus    daffodil
  // Dali - The persistence of Memory
  // Lichtenstein - Oh, Jeff...I Love You, Too...But...
  // Lichtenstein - Reflections on Crash

  // PabloPicasso - Cubist
  // Salvador Dalí - Surrealist

  // Pablo Picasso
  // Leonardo da Vinci
  // Roy Lichtenstein
  // Salvador Dalí
  // Andy Warhol
  // Salvador Dalí
  // Vincent Van Gogh

  // 1 A woman. A child. A bull. A sheep. Underneath.                                                            (Red)
  // 6 Throughout my life, I loved a sport, from child to elder, the participants use this against the opponent. (Yellow)
  // 3 Who is in the room?                                                                                       (Orange)
  // 4 The creator of my dots had a father who created this.                                                     (Black)
  // 8 The year in which I last entertained a king.                                                              (Blue) /fin #1
  // 2 Suspension with no bridge. What is endangered in the hand?                                                (Green)
  // 7 In number 5...this is the name of the last place I called home.                                           (Brown)
  // 5 They were anon in an exhibition with me.                                                                  (Purple)
  //  The anon you seek likely breathe today

  // Tools of the GOAT. (Picture of Paintbrushes) (What does somebody need that many paintbrushes for?)

  // Pablo Picasso:        TheOldGuitarist              BluePeriod
  // Pablo Picasso:        Banderillas|sword|Muleta     BullFighting (Suerte de Muleta)
  // Leonardo da Vinci:   MonaLisa
  // Roy Lichtenstein:     TheNewYorkSun                BenjaminDay-BenDayDots
  // Salvador Dalí:        1988                         King Juan Carlos (Dalí gave the king a drawing, Head of Europa, which would turn out to be Dalí's final drawing.)
  // Andy Warhol:          SeventhStreetBridge          Andy Warhol Bridge-(The Three Sisters)
  // Salvador Dalí:        Narcissus (daffodil)         (Relenting, the gods immortalised him as the narcissus (daffodil) flower. For this picture Dalí used a meticulous technique which he described as 'hand-painted colour photography' to depict with hallucinatory effect the transformation of Narcissus, kneeling in the pool, into the hand holding the egg and flower.)
  // Vincent Van Gogh:      Auberge Ravoux               House of Van Gogh (Maison de Van Gogh) or  Auvers-sur-Oise
  // Vincent Van Gogh:      Impressionists               "Anonymous Society of Painters, Sculptors, Engravers, etc."

  // Who is in the room?
  // The world’s most famous painting, the Mona Lisa, needs a space big enough to welcome its many admirers. It is therefore housed in the Louvre’s largest room, the Salle des États “Room of the States

  log(`words`, words.join(` `));

  let i = 0;
  let total = 8 * 7 * 6 * 5 * 4 * 3 * 2;
  words.forEach((x) => (total *= x.length));

  /* prettier-ignore */
  /* eslint-disable */
  for(let i0 = 0; i0 < words.length; i0++){
      log('i',i);
    for(let j0 = 0; j0 < words[i0].length; j0++){

    for(let i1 = 0; i1 < words.length; i1++){  
      if(i1===i0){continue;}
    for(let j1 = 0; j1 < words[i1].length; j1++){

    for(let i2 = 0; i2 < words.length; i2++){  
      if(i2===i0){continue;}
      if(i2===i1){continue;}
    for(let j2 = 0; j2 < words[i2].length; j2++){

    for(let i3 = 0; i3 < words.length; i3++){  
      if(i3===i0){continue;}
      if(i3===i1){continue;}
      if(i3===i2){continue;}
    for(let j3 = 0; j3 < words[i3].length; j3++){

    for(let i4 = 0; i4 < words.length; i4++){ 
      if(i4===i0){continue;}
      if(i4===i1){continue;}
      if(i4===i2){continue;}
      if(i4===i3){continue;} 
    for(let j4 = 0; j4 < words[i4].length; j4++){

    for(let i5 = 0; i5 < words.length; i5++){ 
      if(i5===i0){continue;}
      if(i5===i1){continue;}
      if(i5===i2){continue;}
      if(i5===i3){continue;}
      if(i5===i4){continue;} 
    for(let j5 = 0; j5 < words[i5].length; j5++){

    for(let i6 = 0; i6 < words.length; i6++){  
      if(i6===i0){continue;}
      if(i6===i1){continue;}
      if(i6===i2){continue;}
      if(i6===i3){continue;}
      if(i6===i4){continue;}
      if(i6===i5){continue;} 
    for(let j6 = 0; j6 < words[i6].length; j6++){
      
    for(let i7 = 0; i7 < words.length; i7++){  
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
        log(`${i} / ${total} = ${(i / total).toFixed(3)}%`);
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
        return;
      }

      i++;

    /* eslint-disable */
    }}}}}}}}
    }}}}}}}}
  /* eslint-enable */

  log(`words`, words.map((x) => x.join(`|`)).join(` `));
  log(`NO FIND IT!`, i);

  // fs.writeFileSync('./hashcat/output.txt');

  log(`DONE`);
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
