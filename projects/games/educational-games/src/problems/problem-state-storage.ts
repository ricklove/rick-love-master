import { ProblemService, ProblemStateStorage } from './problems-service';

export const createProblemStateStorage = (storageKey: string): ProblemStateStorage => {
  const storage: ProblemStateStorage = {
    load: async <T>() => {
      try {
        return JSON.parse(localStorage.getItem(storageKey) ?? `error - NOT FOUND`) as T;
      } catch {
        return null;
      }
    },
    save: async (value) => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    },
  };
  return storage;
};

export const createAutoSavedProblemService = (problemSource: ProblemService, storageKey: string): ProblemService => {
  const storage = createProblemStateStorage(storageKey);

  // Load
  (async () => await problemSource.load(storage))();

  return {
    ...problemSource,
    recordAnswer: (problem, answer) => {
      problemSource.recordAnswer(problem, answer);

      if (problem.isLastOfSection) {
        (async () => await problemSource.save(storage))();
      }
    },
  };
};
