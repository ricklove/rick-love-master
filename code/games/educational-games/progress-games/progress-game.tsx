import React from 'react';
import { ProblemService } from '../problems/problems-service';
import { EmojiIdleView } from './emoji-idle-game/emoji-idle-view';
import { EmojiIdleService } from './emoji-idle-game/emoji-idle-service';

export const ProgressGameService = {
    onCorrect: () => {
        EmojiIdleService.get().reward();
    },
    onCompleteSection: () => {
        EmojiIdleService.get().reward_major();
    },
    onCompleteSubject: () => {
        EmojiIdleService.get().reward_extreme();
    },
    onWrong: () => {
        EmojiIdleService.get().punish();
    },
};

export const createProgressGameProblemService = (problemSource: ProblemService, options?: {}): ProblemService => {
    const service: ProblemService = {
        ...problemSource,
        recordAnswer: (problem, answer) => {
            if (answer.isCorrect) {
                ProgressGameService.onCorrect();

                if (!problem.isReview && problem.isLastOfSubject) {
                    ProgressGameService.onCompleteSubject();
                } else if (!problem.isReview && problem.isLastOfSection) {
                    ProgressGameService.onCompleteSection();
                }

            } else {
                ProgressGameService.onWrong();
            }
            // TODO: On complete section
            // TODO: On complete subject

            return problemSource.recordAnswer(problem, answer);
        },
    };
    return service;
};

export const ProgressGameView = () => {
    return <EmojiIdleView />;
};
