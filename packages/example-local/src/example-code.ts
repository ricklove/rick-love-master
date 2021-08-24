export const exampleValue8 = {
  example3: 'Here it is nice!',

  run2: () => {
    const a = `It is within a few secs, which is ok!`;
    const b = 'What? This is not formatted! Also! 2A! ';
    let c: string;
    c = b + a;

    return { a, b, c, ok: true };
  },
};
