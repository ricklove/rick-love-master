const id = Math.floor(Math.random() * 100 + Date.now()) % 100;
const key = `[w${String(id).padStart(2, `0`)}]`;

export const wogger: Pick<typeof console, `log` | `warn` | `error`> = {
  log: (...args) => {
    console.log(key, ...args);
  },
  warn: (...args) => {
    console.warn(key, ...args);
  },
  error: (...args) => {
    console.error(key, ...args);
  },
};
