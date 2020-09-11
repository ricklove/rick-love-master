import React, { useEffect, useState } from 'react';
import { UserDataService } from 'user-data-service/user-data-service';
import { useAutoLoadingError } from 'utils-react/hooks';
import { UserProfileManagerView } from 'user-data-service/user-profile-manager-view';
import { UserProfileSelectionView } from 'user-data-service/user-profile-selection-view';
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
            // (async () => UserDataService.get().markUserDataChanged())();

            if (answer.isCorrect) {
                ProgressGameService.onCorrect();

                if (!problem.isReview && problem.isLastOfSubject) {
                    ProgressGameService.onCompleteSubject();

                    // Save User Data (delayed to let other state update)
                    setTimeout(async () => {
                        await UserDataService.get().uploadUserData();
                    }, 1000);
                } else if (!problem.isReview && problem.isLastOfSection) {
                    ProgressGameService.onCompleteSection();

                    // Save User Data (delayed to let other state update)
                    setTimeout(async () => {
                        await UserDataService.get().uploadUserData();
                    }, 1000);
                }

            } else {
                ProgressGameService.onWrong();
            }

            return problemSource.recordAnswer(problem, answer);
        },
    };
    return service;
};

export const ProgressGameView = () => {
    const { loading, error, doWork } = useAutoLoadingError();
    const [hasSelectedProfile, setHasSelectedProfile] = useState(false);

    useEffect(() => {
        // Load User Data
        doWork(async () => {
            await UserDataService.get().setup();
            EmojiIdleService.reset();
        });
    }, []);

    if (loading) {
        return <></>;
    }

    if (!hasSelectedProfile) {
        return <UserProfileSelectionView onUserSelected={() => setHasSelectedProfile(true)} />;
    }

    return <EmojiIdleView />;
};
