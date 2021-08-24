export const exampleValue10 = {
  example3: 'Here it is nice!',

  run2: () => {
    const a = `It is within a few secs, which is ok!`;
    const b = 'What? This is NOW formatted! Also! Can we make it faster though 2? What takes so long?';
    let c: string;
    c = `${a}     
${b}`;

    return { a, b, c, ok: true };
  },
};
