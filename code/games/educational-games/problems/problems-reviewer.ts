import { distinct, shuffle, distinct_key } from 'utils/arrays';
import { ProblemService, Problem, ProblemResult } from './problems-service';


export const createReviewProblemService = (problemSource: ProblemService, {
    maxReviewCount = 3, reviewSequenceLength = 3, reviewSequencePreviousLength = 1, reviewQuestionPrefix = `🔄 `,
}: {
    maxReviewCount?: number; reviewSequenceLength?: number; reviewSequencePreviousLength?: number;
    reviewQuestionPrefix?: string;
}): ProblemService => {
    const state = {
        problemSourceHistory: [] as Problem[],
        problemsToReview: [] as { index: number }[],
        reviewSequence: null as null | { iNext: number, iEnd: number },
        repeatState: `new` as 'new' | 'review',
    };

    const startReview = () => {
        console.log(`createReviewProblemService startReview`, state);
        state.repeatState = `review`;
    };

    const getReviewProblem = (): null | Problem => {
        console.log(`createReviewProblemService getReviewProblem`, state);

        if (state.reviewSequence && state.reviewSequence.iNext > state.reviewSequence.iEnd) {
            console.log(`createReviewProblemService getReviewProblem - End of Sequence`, state);
            state.reviewSequence = null;
        }

        if (!state.reviewSequence) {
            const nextProblemToReview = state.problemsToReview[0];
            if (!nextProblemToReview) {
                console.log(`createReviewProblemService getReviewProblem - No Review Problems`, state);
                return null;
            }

            console.log(`createReviewProblemService getReviewProblem - Start Review Sequence`, state);
            state.reviewSequence = {
                iNext: Math.max(0, nextProblemToReview.index - reviewSequencePreviousLength),
                iEnd: Math.min(state.problemSourceHistory.length - 1, nextProblemToReview.index - reviewSequencePreviousLength + reviewSequenceLength - 1),
            };
        }

        const seq = state.reviewSequence;

        // Remove reviewed problem
        state.problemsToReview = state.problemsToReview.filter(x => x.index !== seq.iNext);
        const p = state.problemSourceHistory[seq.iNext];
        seq.iNext++;

        return {
            ...p,
            question: reviewQuestionPrefix + p.question,
            answers: shuffle(p.answers),
        };
    };

    const service: ProblemService = {
        getNextProblem: (): ProblemResult => {
            console.log(`createReviewProblemService getNextProblem`, state);

            if (state.repeatState === `review`) {
                const reviewProblem = getReviewProblem();
                if (reviewProblem) {
                    return reviewProblem;
                }

                console.log(`createReviewProblemService getNextProblem - No Review Problem - Change Mode to NEW`, state);
                state.repeatState = `new`;
            }

            if (state.problemsToReview.length >= maxReviewCount) {
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

            if (answer.isCorrect) { return; }

            const i = state.problemSourceHistory.findIndex(x => x.key === problem.key);
            if (i < 0) { return; }

            state.problemsToReview.push({ index: i });
            state.problemsToReview = distinct_key(state.problemsToReview, x => `${x.index}`);
        },
    };

    return service;
};
