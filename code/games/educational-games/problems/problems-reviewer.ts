import { distinct, shuffle, distinct_key } from 'utils/arrays';
import { strictEqual } from 'assert';
import { ProblemService, Problem, ProblemResult } from './problems-service';


export const createReviewProblemService = (problemSource: ProblemService, {
    maxNewReviewCount = 3,
    reviewSequencePreviousLength = 1,
    reviewQuestionPrefix = `🔄 `,
    requiredCorrectInRow = 3,
}: {
    maxNewReviewCount?: number;
    reviewSequencePreviousLength?: number;
    reviewQuestionPrefix?: string;
    requiredCorrectInRow?: number;
}): ProblemService => {
    const state = {
        problemSourceHistory: [] as Problem[],
        reviewProblems: [] as { index: number, correctsInRow: number }[],
        lastReviewProblem: null as null | { index: number, correctsInRow: number },
        reviewSequence: null as null | { iNext: number, iStart: number, iEnd: number },
        repeatState: `new` as 'new' | 'review',
    };

    const startReview = () => {
        console.log(`createReviewProblemService startReview`, state);
        state.repeatState = `review`;
    };

    const getReviewProblem = (): null | Problem => {
        console.log(`createReviewProblemService getReviewProblem`, state);

        const rSeq = state.reviewSequence;
        if (rSeq && rSeq.iNext > rSeq.iEnd) {
            console.log(`createReviewProblemService getReviewProblem - End of Sequence`, { rSeq, state });
            state.reviewSequence = null;
        }

        if (!state.reviewSequence) {
            // If reached end of review problems, exit review mode
            const reviewProblem = state.reviewProblems.find(x => x.index > (state.lastReviewProblem?.index ?? -1));
            if (!reviewProblem) {
                console.log(`createReviewProblemService getReviewProblem - No Review Problem (with greater order than last)`, { reviewProblems: state.reviewProblems, lastReviewProblem: state.lastReviewProblem, state });
                state.lastReviewProblem = null;
                return null;
            }

            const lastReviewProblemIndex = state.lastReviewProblem?.index ?? -1;
            state.lastReviewProblem = reviewProblem;

            console.log(`createReviewProblemService getReviewProblem - Start Review Sequence`, state);
            const iStart = Math.max(0, reviewProblem.index - reviewSequencePreviousLength, lastReviewProblemIndex + 1);

            state.reviewSequence = {
                iNext: iStart,
                iStart,
                iEnd: reviewProblem.index,
            };
        }

        // Next in sequence
        const seq = state.reviewSequence;
        const p = state.problemSourceHistory[seq.iNext];
        seq.iNext++;

        return {
            ...p,
            question: reviewQuestionPrefix + p.question,
            answers: shuffle(p.answers),
        };
    };

    const service: ProblemService = {
        getSections: problemSource.getSections,
        gotoSection: problemSource.gotoSection,

        getNextProblem: (): ProblemResult => {
            console.log(`createReviewProblemService getNextProblem`, state);

            if (state.repeatState === `review`) {
                const reviewProblem = getReviewProblem();
                if (reviewProblem) {
                    return { ...reviewProblem, isReview: true };
                }

                console.log(`createReviewProblemService getNextProblem - No Review Problem - Change Mode to NEW`, state);
                state.repeatState = `new`;
            }

            if (state.reviewProblems.filter(x => x.correctsInRow <= 1).length >= maxNewReviewCount) {
                startReview();
                return service.getNextProblem();
            }

            const newProblem = problemSource.getNextProblem();
            if (newProblem.question) {
                state.problemSourceHistory.push(newProblem);
            } else {
                // Done - Finish Review
                startReview();
                return service.getNextProblem();
            }
            return newProblem;
        },
        recordAnswer: (problem, answer) => {
            console.log(`createReviewProblemService recordAnswer`, state);

            // if (answer.isCorrect) {

            //     problemSource.recordAnswer(problem, answer);
            //     return;
            // }

            const i = state.problemSourceHistory.findIndex(x => x.key === problem.key);
            if (i < 0) {
                problemSource.recordAnswer(problem, answer);
                return;
            }

            const problemAlreadyInReview = state.reviewProblems.find(x => x.index === i);
            if (answer.isCorrect) {
                // Correct
                if (problemAlreadyInReview) {
                    problemAlreadyInReview.correctsInRow++;

                    // Remove if enough corrects in a row 
                    state.reviewProblems = state.reviewProblems.filter(x => x.correctsInRow <= requiredCorrectInRow);
                }
            } else {
                // Wrong 
                // eslint-disable-next-line no-lonely-if
                if (problemAlreadyInReview) {
                    problemAlreadyInReview.correctsInRow = 0;
                } else {
                    // Insert Review Problem in Index order
                    const newReview = { index: i, correctsInRow: 0, _debug_problemKey: problem.key };
                    state.reviewProblems.push(newReview);
                    state.reviewProblems.sort((a, b) => a.index - b.index);
                    // state.problemsToReview = distinct_key(state.problemsToReview, x => `${x.index}`);
                }
            }


            problemSource.recordAnswer(problem, answer);
        },
    };

    return service;
};
