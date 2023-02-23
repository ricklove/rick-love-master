const logState = [] as string[];
const log = (message: string, details: unknown) => {
  logState.unshift(`${logState.length} ${Date.now() % 1000000}: ${message} ${details ? JSON.stringify(details) : ``}`);
};

export const logger = {
  log,
  logState,
};
