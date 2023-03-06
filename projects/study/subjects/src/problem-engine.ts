import { allSubjects, getSubject, StudyProblemType } from './all-subjects';
import { StudyProblemAnswer, StudyProblemReviewState } from './types';

type PlayerState = {
  nextProblemTimerId: undefined | number;
  isReady: boolean;
  playerName: string;
  timeStart: Date;
  problemQueue: StudyProblemType[];
  reviewProblems: StudyProblemReviewState[];
  answerHistory: StudyProblemAnswer[];
  selectedSubjectCategories: {
    subjectKey: string;
    categoryKey: string;
  }[];
  writeAnswerToFile?: (answer: StudyProblemAnswer) => Promise<void>;
};

const REVIEW_RATIO = 0.9;

const gotoNextProblem = async ({
  playerState,
  presenter,
  setInterval,
  clearInterval,
  delay,
}: {
  playerState: PlayerState;
  presenter: {
    presentMultipleChoiceProblem: (
      playerName: string,
      args: {
        subjectTitle: string;
        question: string;
        choices: string[];
      },
    ) => Promise<{ answer: string }>;
    presentShortAnswerProblem: (
      playerName: string,
      args: { subjectTitle: string; question: string },
    ) => Promise<{ answer: string }>;
    presentQuestionPreview: (
      playerName: string,
      args: { subjectTitle: string; questionPreview: string; questionPreviewTimeMs: number },
    ) => Promise<{ answer: string }>;
    sayMessage?: (playerName: string, message: string) => Promise<void>;
  };
  setInterval: (cb: () => void, timeMs: number) => number;
  clearInterval: (id: number) => void;
  delay: (timeMs: number) => Promise<void>;
}): Promise<undefined | StudyProblemAnswer> => {
  const { playerName } = playerState;

  const getQueuedProblem = () => {
    // return playerState.problemQueue.shift();

    if (playerState.problemQueue.length <= 0) {
      return;
    }

    // console.log(`getQueuedProblem`, { playerName: playerState.playerName, problemQueue: playerState.problemQueue });

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
    if (playerState.reviewProblems.length < 3 && Math.random() > REVIEW_RATIO) {
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

    // console.log(`getReviewProblem - sequence added`, {
    //   playerName: playerState.playerName,
    //   reviewSequence,
    //   reviewProblems: playerState.reviewProblems.map((x) => ({ reviewLevel: x.reviewLevel, ...x.problem })),
    //   // problemQueue: playerState.problemQueue,
    // });

    // Run as queued problem
    return getQueuedProblem();
  };

  const getProblem = () => {
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

  const problem = getProblem();
  const problemSubject = getSubject(problem.subjectKey);

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
      });
      return response.answer;
    }

    const response = await presenter.presentShortAnswerProblem(playerName, {
      subjectTitle: problem.subjectTitle,
      question: problem.question,
    });
    return response.answer;
  };

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
    await delay(problem.questionPreviewTimeMs);
  }

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
    if (timeToAnswerMs < 500) {
      return await presentProblemWithReissueOnAccidentalAnswer();
    }
    if (timeToAnswerMs < 1000 && !isCorrect) {
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

export const createProblemEngine = () => {
  return {
    gotoNextProblem,
  };
};
