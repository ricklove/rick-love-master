import { allSubjects, getSubject } from './all-subjects';
import { ProblemEnginePlayerSaveState, StudyProblemAnswer } from './types';

const defaultProblemEngineOptions = {
  nextProblemIntervalTimeMs: 30,
  reviewRatio: 0.9,
  previewTimeMultiplier: 1,
  accidentalAnswerAllowedTimeMs: 1000,
};
type ProblemEngineOptions = typeof defaultProblemEngineOptions;

type ProblemEngineProblemEnginePresenter = {
  presentMultipleChoiceProblem: (
    playerName: string,
    args: {
      subjectTitle: string;
      question: string;
      choices: string[];
      correctAnswer: string;
    },
  ) => Promise<{ answer: string }>;
  presentShortAnswerProblem: (
    playerName: string,
    args: {
      subjectTitle: string;
      question: string;
      correctAnswer: string;
    },
  ) => Promise<{ answer: string }>;
  presentQuestionPreview: (
    playerName: string,
    args: {
      subjectTitle: string;
      questionPreview: string;
      questionPreviewTimeMs: number;
    },
  ) => Promise<void>;
  presentOptions: (
    playerName: string,
    args: {
      title: string;
      label: string;
      options: string[];
    },
  ) => Promise<{ choices: string[] }>;
  presentMessage: (playerName: string, message: string) => Promise<void>;
  sayMessage?: (playerName: string, message: string) => Promise<void>;
};

type ProblemEngineDependencies = {
  setTimeout: (cb: () => void, timeMs: number) => number;
  clearTimeout: (id: undefined | number) => void;
  setInterval: (cb: () => void, timeMs: number) => number;
  clearInterval: (id: undefined | number) => void;
  delay: (timeMs: number) => Promise<void>;
  logger: { log: (message: string, args?: Record<string, unknown>) => void };
};

export const createProblemEngine = ({
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  delay,
  logger,
}: ProblemEngineDependencies) => {
  // show problem
  const showNextProblem = async ({
    playerState,
    presenter,
    options,
  }: {
    playerState: ProblemEnginePlayerState;
    presenter: ProblemEngineProblemEnginePresenter;
    options: ProblemEngineOptions;
  }): Promise<undefined | StudyProblemAnswer> => {
    const { playerName } = playerState;
    const problem = getNextProblem(playerState, options);
    const problemSubject = getSubject(problem.subjectKey);

    // For Text to speech
    let textToSpeechRepeaterId = undefined as undefined | ReturnType<typeof setInterval>;
    if (presenter.sayMessage && problem.questionPreviewChat) {
      const chatTts = problem.questionPreviewChat;
      await presenter.sayMessage(playerName, chatTts);
      await delay(problem.questionPreviewChatTimeMs ?? 0);

      let repeatCount = 0;
      textToSpeechRepeaterId = setInterval(() => {
        if (repeatCount > 5) {
          clearInterval(textToSpeechRepeaterId!);
          return;
        }
        // eslint-disable-next-line no-void
        void presenter.sayMessage?.(playerName, chatTts);
        repeatCount++;
      }, 3000);
    }

    // Title Display
    if (problem.questionPreview && problem.questionPreviewTimeMs) {
      await presenter.presentQuestionPreview(playerName, {
        subjectTitle: problem.subjectTitle,
        questionPreview: problem.questionPreview,
        questionPreviewTimeMs: problem.questionPreviewTimeMs,
      });
      await delay(problem.questionPreviewTimeMs * options.previewTimeMultiplier);
    }

    const presentProblem = async () => {
      const formType = problem.isTyping ? `input` : `choices`;
      if (formType === `choices`) {
        const wrongChoicesSet = problemSubject.getWrongChoices(problem);
        const wrongChoices = [...wrongChoicesSet.values()]
          .filter((x) => x !== problem.correctAnswer)
          .map((x) => ({ x, rand: Math.random() }))
          .sort((a, b) => a.rand - b.rand)
          .map((x) => x.x)
          .slice(0, 3);
        const choices = [problem.correctAnswer, ...wrongChoices];
        const choicesRandomized = choices
          .map((x) => ({ x, rand: Math.random() }))
          .sort((a, b) => a.rand - b.rand)
          .map((x) => x.x);

        const response = await presenter.presentMultipleChoiceProblem(playerName, {
          subjectTitle: problem.subjectTitle,
          question: problem.question,
          choices: choicesRandomized,
          correctAnswer: problem.correctAnswer,
        });
        return response.answer;
      }

      const response = await presenter.presentShortAnswerProblem(playerName, {
        subjectTitle: problem.subjectTitle,
        question: problem.question,
        correctAnswer: problem.correctAnswer,
      });
      return response.answer;
    };

    const presentProblemWithReissueOnAccidentalAnswer = async (): Promise<StudyProblemAnswer> => {
      const timeSent = Date.now();
      const answerRaw = await presentProblem();
      const time = new Date();
      const timeToAnswerMs = Date.now() - timeSent;
      const { isCorrect, responseMessage } = problemSubject.evaluateAnswer(problem, answerRaw?.trim());

      // Re-issue question on accidental tap
      if (!answerRaw) {
        return await presentProblemWithReissueOnAccidentalAnswer();
      }
      if (timeToAnswerMs < 0.5 * options.accidentalAnswerAllowedTimeMs) {
        return await presentProblemWithReissueOnAccidentalAnswer();
      }
      if (timeToAnswerMs < options.accidentalAnswerAllowedTimeMs && !isCorrect) {
        return await presentProblemWithReissueOnAccidentalAnswer();
      }

      return {
        wasCorrect: isCorrect,
        responseMessage,
        answerRaw,
        problem,
        time,
        timeToAnswerMs,
      };
    };

    const result = await presentProblemWithReissueOnAccidentalAnswer();

    if (textToSpeechRepeaterId) {
      clearInterval(textToSpeechRepeaterId);
    }
    return result;
  };

  const getNextProblem = (playerState: ProblemEnginePlayerState, { reviewRatio }: ProblemEngineOptions) => {
    const getQueuedProblem = () => {
      // return playerState.problemQueue.shift();

      if (playerState.problemQueue.length <= 0) {
        return;
      }

      // logger.log(`getQueuedProblem`, { playerName: playerState.playerName, problemQueue: playerState.problemQueue });

      // Don't remove from queue
      return playerState.problemQueue[0];
    };

    const getReviewProblem = () => {
      // Remove reviews that are at mastery level
      playerState.reviewProblems = playerState.reviewProblems.filter((x) => x.reviewLevel < 3);

      if (playerState.reviewProblems.length <= 0) {
        return;
      }
      // Chance for new problem
      if (playerState.reviewProblems.length < 3 && Math.random() > reviewRatio) {
        return;
      }

      const lowestReviewLevel = Math.min(...playerState.reviewProblems.map((x) => x.reviewLevel));
      const w = playerState.reviewProblems.filter((x) => x.reviewLevel === lowestReviewLevel);
      const reviewProblem = w[0];
      if (!reviewProblem) {
        return;
      }

      // Add to queue and run queue
      const reviewSubject = getSubject(reviewProblem.problem.subjectKey);
      const reviewSequence = reviewSubject.getReviewProblemSequence(reviewProblem.problem, reviewProblem.reviewLevel);

      // Increase review level (it will reset on wrong answer)
      reviewProblem.reviewLevel++;

      // Mark sequence as review problems
      reviewSequence.forEach((x) => (x._isReviewProblem = true));
      playerState.problemQueue.push(...reviewSequence);

      // logger.log(`getReviewProblem - sequence added`, {
      //   playerName: playerState.playerName,
      //   reviewSequence,
      //   reviewProblems: playerState.reviewProblems.map((x) => ({ reviewLevel: x.reviewLevel, ...x.problem })),
      //   // problemQueue: playerState.problemQueue,
      // });

      // Run as queued problem
      return getQueuedProblem();
    };

    const qProblem = getQueuedProblem();
    if (qProblem) {
      return qProblem;
    }

    const wProblem = getReviewProblem();
    if (wProblem) {
      return wProblem;
    }

    const includedSubjects = allSubjects.filter((x) =>
      playerState.selectedSubjectCategories.some((s) => s.subjectKey === x.subjectKey),
    );
    const randomSubject = includedSubjects[Math.floor(Math.random() * includedSubjects.length)] ?? allSubjects[0];
    const problem = randomSubject.getNewProblem(
      playerState.selectedSubjectCategories.filter((x) => x.subjectKey === randomSubject.subjectKey),
    );

    // Add to problem queue
    playerState.problemQueue.push(problem);

    // Run as queued problem (so it will auto-repeat if skipped)
    return getQueuedProblem() ?? problem;
  };

  const showSubjectSelection = async ({
    playerState,
    presenter,
  }: {
    playerState: ProblemEnginePlayerState;
    presenter: ProblemEngineProblemEnginePresenter;
  }) => {
    const selectedSubjects = await presenter.presentOptions(playerState.playerName, {
      title: `Choose Subjects`,
      label: `Select your subjects below:`,
      options: allSubjects.map((x) => x.subjectTitle),
    });

    if (!selectedSubjects.choices.length) {
      return;
    }

    const enabledSubjects = allSubjects.filter((x) => selectedSubjects.choices.includes(x.subjectTitle));
    if (!enabledSubjects) {
      return;
    }

    // Get the selected categories for each enabled subject
    const allSelectedSubjectCategories = [] as {
      subjectKey: string;
      categoryKey: string;
    }[];

    for (const s of enabledSubjects) {
      const subjectCategories = s.getCategories();
      const selectedCategories = await presenter.presentOptions(playerState.playerName, {
        title: `Choose Subjects`,
        label: `Select your subjects below:`,
        options: subjectCategories.map((x) => x.categoryTitle),
      });

      if (!selectedCategories.choices.length) {
        return;
      }

      const selectedSubjectCategories = subjectCategories.filter((x) =>
        selectedCategories.choices.includes(x.categoryTitle),
      );
      allSelectedSubjectCategories.push(
        ...selectedSubjectCategories.map((x) => ({ subjectKey: s.subjectKey, categoryKey: x.categoryKey })),
      );
    }

    return allSelectedSubjectCategories;
  };

  const continueStudyGame = async ({
    playerState,
    presenter,
    options: optionsRaw,
  }: {
    playerState: ProblemEnginePlayerState;
    presenter: ProblemEngineProblemEnginePresenter;
    options: Partial<ProblemEngineOptions>;
  }): Promise<void> => {
    const options = { ...defaultProblemEngineOptions, ...(optionsRaw ?? {}) };

    logger.log(`continueStudyGame`, { playerName: playerState.playerName });
    playerState.runtime = playerState.runtime ?? {
      isReady: false,
      timeStart: Date.now(),
    };
    const gameState = playerState.runtime;

    if (gameState.nextProblemTimeoutId) {
      clearTimeout(gameState.nextProblemTimeoutId);
      gameState.nextProblemTimeoutId = undefined;
    }

    // Non ready players
    const isReady =
      gameState.isReady &&
      // and selected a subject
      playerState.selectedSubjectCategories.length > 0;
    // TODO: Or change subject after a while
    // || p.playerState.answerHistory.length % 60 === 59

    if (!isReady) {
      const result = await showSubjectSelection({ playerState, presenter });

      if (!result?.length) {
        await delay(10000);
        return await continueStudyGame({ playerState, presenter, options: optionsRaw });
      }

      // eslint-disable-next-line require-atomic-updates
      playerState.selectedSubjectCategories = result;
      // eslint-disable-next-line require-atomic-updates
      gameState.isReady = true;

      logger.log(`Player Ready`, {
        playerState,
      });
      await presenter.presentMessage(playerState.playerName, `You are now playing the Study Game!!!`);
    }

    // Start player timer
    gameState.nextProblemTimeoutId = setTimeout(() => {
      (async () => {
        await showNextProblem({ playerState, presenter, options });

        // // Report
        // const report = [...gameState.playerStates.values()]
        //   .map((p) => `${p.playerName} ${getPlayerScoreReport(p)}`)
        //   .join(`\n`);
        // logger.log(`report`, { report });
        // // commandsApi.sendMessage('@a', report);

        // eslint-disable-next-line no-void
        void continueStudyGame({ playerState, presenter, options });
      })();
    }, options.nextProblemIntervalTimeMs);
  };

  const stopStudyGame = (playerState: ProblemEnginePlayerState) => {
    const gameState = playerState.runtime;
    if (!gameState || gameState.nextProblemTimeoutId) {
      return;
    }

    logger.log(`stopStudyGame`);
    clearTimeout(gameState.nextProblemTimeoutId);
    gameState.nextProblemTimeoutId = undefined;
    resetSubjects(playerState);
  };

  const resetSubjects = (playerState: ProblemEnginePlayerState) => {
    logger.log(`resetSubjects`, { playerState: playerState.playerName });
    const p = playerState;
    p.selectedSubjectCategories = [];
    p.problemQueue = [];
    p.reviewProblems = [];
    p.runtime = undefined;
  };

  return {
    createPlayer: (playerName: string): ProblemEnginePlayerSaveState => {
      return {
        playerName,
        selectedSubjectCategories: [],
        answerHistory: [],
        problemQueue: [],
        reviewProblems: [],
      };
    },
    startStudyGame: continueStudyGame,
    stopStudyGame,
    resetSubjects,
  };
};

export type ProblemEnginePlayerState = ProblemEnginePlayerSaveState & {
  runtime?: {
    isReady?: boolean;
    timeStart: number;
    nextProblemTimeoutId?: number;
  };
};

export type ProblemEngine = ReturnType<typeof createProblemEngine>;
