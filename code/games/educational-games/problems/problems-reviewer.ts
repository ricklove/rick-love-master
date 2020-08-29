import { distinct, shuffle } from 'utils/arrays';
import { ProblemService, Problem, ProblemResult } from './problems-service';


export const createReviewProblemService = (problemSource: ProblemService, { maxReviewCount = 5, reviewSequenceLength = 5 }: { maxReviewCount?: number, reviewSequenceLength?: number }): ProblemService => {
    const state = {
        problemSourceHistory: [] as Problem[],
        problemsToReview: [] as { index: number }[],
        reviewSequence: null as null | { iNext: number, iEnd: number },
        repeatState: `new` as 'new' | 'review',
    };

    const startReview = () => {
        state.repeatState = `review`;
    };

    const getReviewProblem = (): null | Problem => {
        if (state.reviewSequence && state.reviewSequence.iNext === state.reviewSequence.iEnd) {
            state.reviewSequence = null;
        }

        if (!state.reviewSequence) {
            const nextProblemToReview = state.problemsToReview[0];
            if (!nextProblemToReview) { return null; }

            state.reviewSequence = {
                iNext: nextProblemToReview.index - 1,
                iEnd: nextProblemToReview.index - 1 + reviewSequenceLength,
            };
        }

        const seq = state.reviewSequence;

        // Remove reviewed problem
        state.problemsToReview = state.problemsToReview.filter(x => x.index !== seq.iNext);

        const p = state.problemSourceHistory[seq.iNext];
        seq.iNext++;

        return {
            ...p,
            answers: shuffle(p.answers),
        };
    };

    const service: ProblemService = {
        getNextProblem: (): ProblemResult => {
            if (state.repeatState === `review`) {
                const reviewProblem = getReviewProblem();
                if (reviewProblem) {
                    return reviewProblem;
                }

                state.repeatState = `new`;
            }

            if (state.problemsToReview.length > maxReviewCount) {
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
            if (answer.isCorrect) { return; }

            const i = state.problemSourceHistory.lastIndexOf(problem);
            state.problemsToReview.push({ index: i });
            state.problemsToReview = distinct(state.problemsToReview);
        },
    };

    return service;
};
