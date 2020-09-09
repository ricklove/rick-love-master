import { distinct, shuffle, distinct_key } from 'utils/arrays';
import { ProblemService, Problem, ProblemResult } from './problems-service';


export const createReviewProblemService = (problemSource: ProblemService, {
    maxReviewCount = 3,
    reviewSequencePreviousLength = 1,
    reviewQuestionPrefix = `🔄 `,
    requiredCorrectInRow = 3,
}: {
    maxReviewCount?: number;
    reviewSequencePreviousLength?: number;
    reviewQuestionPrefix?: string;
    requiredCorrectInRow?: number;
}): ProblemService => {
    const state = {
        problemSourceHistory: [] as Problem[],
        reviewProblems: [] as { index: number, correctsInRow: number, order: number }[],
        lastReviewProblem: null as null | { index: number, correctsInRow: number, order: number },
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

            // Skip just reviewed
            const lastRev = state.lastReviewProblem;
            if (lastRev) {
                const reviewProblemsSameRange = state.reviewProblems.filter(x => x.order > lastRev.order && x.index >= rSeq.iStart && x.index <= rSeq.iEnd);
                if (reviewProblemsSameRange.length > 0) {
                    console.log(`createReviewProblemService getReviewProblem - Skip overlapping review problem`, { reviewProblemsSameRange, lastRev, state });
                    state.lastReviewProblem = reviewProblemsSameRange[reviewProblemsSameRange.length - 1] ?? null;
                }
            }

            state.reviewSequence = null;
        }

        if (!state.reviewSequence) {
            // If reached end of review problems, exit review mode
            const reviewProblem = state.reviewProblems.find(x => x.order > (state.lastReviewProblem?.order ?? -1));
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

            if (state.reviewProblems.length >= maxReviewCount) {
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
                    state.reviewProblems = state.reviewProblems.filter(x => x.correctsInRow < requiredCorrectInRow);
                }
            } else {
                // Wrong 
                // eslint-disable-next-line no-lonely-if
                if (problemAlreadyInReview) {
                    problemAlreadyInReview.correctsInRow = 0;
                } else {
                    // Add to review
                    state.reviewProblems.push({ index: i, correctsInRow: 0, order: (state.reviewProblems[state.reviewProblems.length - 1]?.order ?? 0) + 1 });
                    // state.problemsToReview = distinct_key(state.problemsToReview, x => `${x.index}`);
                }
            }


            problemSource.recordAnswer(problem, answer);
        },
    };

    return service;
};
