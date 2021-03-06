import React, { useEffect, useState } from 'react';
import { UserDataService, UserProfileInfo } from 'user-data-service/user-data-service';
import { useAutoLoadingError } from 'utils-react/hooks';
import { UserProfileManagerView } from 'user-data-service/user-profile-manager-view';
import { UserProfileSelectionView } from 'user-data-service/user-profile-selection-view';
import { View, Text, TouchableOpacity, Platform } from 'react-native-lite';
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
    const [userProfile, setUserProfile] = useState(null as null | UserProfileInfo);

    // Save UserData after Purchase
    const subscribeToSaveOnPurchase = () => {
        let lastPurchase = Date.now();
        const subscription = EmojiIdleService.get().subscribePetStateChange((x) => {
            console.log(`ProgressGameView subscribePetStateChange`, { lastPurchase, x });
            if (lastPurchase >= x.lastPurchaseTimestamp) { return; }
            lastPurchase = x.lastPurchaseTimestamp;
            // Save User Data (delayed to let other state update)
            setTimeout(async () => {
                await UserDataService.get().uploadUserData();
            }, 1000);
        });
        return subscription;
    };

    useEffect(() => {
        setUserProfile(UserDataService.get().getActiveUser() ?? null);
        EmojiIdleService.reset();

        const sub = subscribeToSaveOnPurchase();
        return () => {
            sub.unsubscribe();
        };
    }, [hasSelectedProfile]);

    useEffect(() => {
        // Load User Data
        doWork(async () => {
            await UserDataService.get().setup();
            EmojiIdleService.reset();
        });
    }, []);

    const onChangeProfile = () => {
        // setHasSelectedProfile(false);
        // Force Reload Page
        if (Platform.OS === `web`) {
            window.location.reload();
        }
    };

    if (loading) {
        return <></>;
    }

    if (!hasSelectedProfile) {
        return <UserProfileSelectionView onUserSelected={() => setHasSelectedProfile(true)} />;
    }

    return (
        <>
            <EmojiIdleView />
            <View>
                <TouchableOpacity onPress={onChangeProfile}>
                    <View style={{ flexDirection: `row`, alignItems: `center`, justifyContent: `flex-start`, padding: 4 }}>
                        <Text style={{ fontSize: 32 }}>{userProfile?.emoji ?? `👤`}</Text>
                        <Text style={{ fontSize: 14 }}>{userProfile?.name ?? ``}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    );
};
