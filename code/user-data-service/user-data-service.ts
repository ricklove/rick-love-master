import { createUploadApiWebClient } from 'upload-api/client/web-client';
import { uploadApiConfig } from 'upload-api/client/config';
import { UploadUrl } from 'upload-api/client/types';
import { createUploader, downloadData } from 'upload-api/client/uploader';
import { AppError } from 'utils/error';
import { delay } from 'utils/delay';
import { error } from 'console';

const USER_DATA_SERVICE_STATE_KEY = `_USER_DATA_SERVICE_STATE`;
export type UserProfileInfo = {
    key: string;
    name: string;
    emoji: string;
    isActive: boolean;
};
type UserProfileMetadata = {
    name?: string;
    emoji?: string;
};
type UserProfileData = {
    key: string;
    name: string;
    emoji?: string;
    uploadUrl: UploadUrl;
    lastUploadTimestamp?: number;
};
type UserServiceState = {
    userProfiles: UserProfileData[];
    activeUserProfileKey: string;
    changeTimestamp: number;
};
type UserData = {
    data: { [key: string]: null | string };
    metadata?: UserProfileMetadata;
    timestamp: number;
};

const createUserDataService = () => {
    const uploadApi = createUploadApiWebClient(uploadApiConfig);

    const storage = {
        getUserDataServiceState: (): null | UserServiceState => {
            try {
                return JSON.parse(localStorage.getItem(USER_DATA_SERVICE_STATE_KEY) ?? `NULL !{}`);
            } catch{
                return null;
            }
        },
        setUserDataServiceState: (state: UserServiceState) => {
            localStorage.setItem(USER_DATA_SERVICE_STATE_KEY, JSON.stringify(state));
        },
        getUserData: (): UserData => {
            const state = storage.getUserDataServiceState();
            const userState = state && state.userProfiles.find(x => x.key === state.activeUserProfileKey);
            const data = {
                data: {},
                metadata: { name: userState?.name, emoji: userState?.emoji },
                timestamp: Date.now(),
            } as UserData;
            const keys = Object.keys(localStorage).filter(x => !x.startsWith(`_`));
            for (const k of keys) {
                data.data[k] = localStorage.getItem(k);
            }
            return data;
        },
        setUserData: (userData: UserData) => {
            // Remove all old data
            const keys = Object.keys(localStorage).filter(x => !x.startsWith(`_`));
            for (const k of keys) {
                localStorage.removeItem(k);
            }

            // Set New data
            for (const k of Object.keys(userData.data)) {
                const val = userData.data[k];
                if (!val) {
                    localStorage.removeItem(k);
                    return;
                }
                localStorage.setItem(k, val);
            }

            // Load metadata
            const state = storage.getUserDataServiceState();
            const userState = state && state.userProfiles.find(x => x.key === state.activeUserProfileKey);
            if (!state || !userState) { return; }
            userState.emoji = userData.metadata?.emoji ?? userState.emoji;
            userState.name = userData.metadata?.name ?? userState.name;
            userState.lastUploadTimestamp = userData.timestamp;
            storage.setUserDataServiceState(state);
        },
    };

    const getUserProfile = (userProfileKey: string) => {
        const state = storage.getUserDataServiceState();
        if (!state) { return null; }
        return state.userProfiles.find(x => x.key === userProfileKey);
    };
    const getActiveUserProfile = () => {
        const state = storage.getUserDataServiceState();
        if (!state?.activeUserProfileKey) { return null; }
        return state.userProfiles.find(x => x.key === state.activeUserProfileKey);
    };

    const uploadWithAutoRenew = async (userProfileKey: string, userData: UserData) => {
        const state = storage.getUserDataServiceState();
        const userState = state && state.userProfiles.find(x => x.key === userProfileKey);
        if (!state || !userState) { return; }

        const upload = async () => {
            const uploader = createUploader(userState.uploadUrl);
            await uploader.uploadData(userData);
        };

        try {
            // Try to upload
            console.log(`uploadWithAutoRenew - Attempt 1`);
            await upload();
            console.log(`uploadWithAutoRenew - UPLOADED`);
        } catch{
            // Rewew and try again
            console.log(`uploadWithAutoRenew - Attempt 2`);

            const newUploarUrl = await uploadApi.renewUploadUrl({ uploadUrl: userState.uploadUrl });
            userState.uploadUrl = newUploarUrl.uploadUrl;
            storage.setUserDataServiceState(state);

            await upload();

            console.log(`uploadWithAutoRenew - UPLOADED AFTER RENEW`);
        }
    };

    const updataAllProfiles = async () => {
        const state = storage.getUserDataServiceState();
        if (!state) { return; }

        for (const userState of state.userProfiles) {
            // eslint-disable-next-line no-await-in-loop
            const userData = await downloadData(userState.uploadUrl.getUrl) as UserData;
            if (!userData.timestamp || userData.timestamp <= (userState.lastUploadTimestamp ?? 0)) {
                // Skip if not new
                continue;
            }

            console.log(`updataAllProfiles - UPDATED USER PROFILE`, { name: userState.name });
            userState.emoji = userData.metadata?.emoji ?? userState.emoji;
            userState.name = userData.metadata?.name ?? userState.name;
            userState.lastUploadTimestamp = userData.timestamp;

            if (userState.key === state.activeUserProfileKey) {
                console.log(`updataAllProfiles - UPDATED ACTIVE USER DATA`, { name: userState.name });
                storage.setUserData(userData);
            }
        }

        storage.setUserDataServiceState(state);
    };

    let isSetupStarted = false;
    let isSetupDone = false;

    const service = {
        setup: async () => {
            if (isSetupStarted) {
                while (!isSetupDone) {
                    // eslint-disable-next-line no-await-in-loop
                    await delay(10);
                }
                return;
            }
            isSetupStarted = true;
            const doSetup = async () => {
                console.log(`UserDataService:setup`);

                const a = getActiveUserProfile();
                if (a) {
                    await updataAllProfiles();
                    return;
                }

                const state = storage.getUserDataServiceState();
                if (state && state.userProfiles.length > 0) {
                    state.activeUserProfileKey = state.userProfiles[0].key;
                    storage.setUserDataServiceState(state);
                    await updataAllProfiles();
                    return;
                }

                const newUploadUrlResult = await uploadApi.createUploadUrl({ contentType: `application/json` });
                const newState: UserServiceState = state ?? {
                    userProfiles: [{
                        key: newUploadUrlResult.uploadUrl.relativePath,
                        name: `${`Player 1`}`,
                        uploadUrl: newUploadUrlResult.uploadUrl,
                    }],
                    activeUserProfileKey: newUploadUrlResult.uploadUrl.relativePath,
                    changeTimestamp: 0,
                };
                storage.setUserDataServiceState(newState);
            };

            try {
                await doSetup();
                isSetupDone = true;
            } catch (error_) {
                // Setup Failed
                isSetupDone = true;
                throw error_;
            }
        },
        setActiveUser: async (userProfileKey: string) => {
            const state = storage.getUserDataServiceState();
            if (!state) { return; }

            if (!state.userProfiles.find(x => x.key === userProfileKey)) {
                throw new AppError(`User Profile not found`);
            }

            // Upload old user data
            await service.uploadUserData();

            state.activeUserProfileKey = userProfileKey;
            state.changeTimestamp = 0;
            storage.setUserDataServiceState(state);

            // Download new user data
            await service.downloadUserDataIfNewer();
        },
        getUserProfiles: async (): Promise<UserProfileInfo[]> => {
            const state = storage.getUserDataServiceState();
            if (!state?.activeUserProfileKey) { return []; }
            return state.userProfiles.map(x => ({
                key: x.key,
                name: x.name,
                emoji: x.emoji ?? `👤`,
                isActive: state.activeUserProfileKey === x.key,
            }));
        },
        setUserProfileInfo: async (userProfileKey: string, info: { emoji?: string, name?: string }) => {
            const state = storage.getUserDataServiceState();
            if (!state) {
                console.log(`uploadUserData - NO STATE`);
                return;
            }

            const userState = state.userProfiles.find(x => x.key === userProfileKey);
            if (!userState) {
                console.log(`uploadUserData - NO USER STATE`);
                return;
            }

            userState.emoji = info.emoji ?? userState.emoji;
            userState.name = info.name ?? userState.name;
            storage.setUserDataServiceState(state);

            // Save to remote data
            const uploader = createUploader(userState.uploadUrl);
            const uData = await uploader.downloadData() as UserData;
            if (!uData) { return; }
            uData.metadata = {
                name: userState.name,
                emoji: userState.emoji,
            };
            uData.timestamp = Date.now();
            await uploadWithAutoRenew(userProfileKey, uData);
        },
        uploadUserData: async () => {
            console.log(`uploadUserData`);

            const state = storage.getUserDataServiceState();
            if (!state) {
                console.log(`uploadUserData - NO STATE`);
                return;
            }

            const userState = state.userProfiles.find(x => x.key === state.activeUserProfileKey);
            if (!userState) {
                console.log(`uploadUserData - NO user State`, { state });
                return;
            }

            userState.lastUploadTimestamp = Date.now();
            storage.setUserDataServiceState(state);

            const userData = storage.getUserData();
            await uploadWithAutoRenew(userState.key, userData);

            console.log(`uploadUserData - UPLOADED`, { userData });
        },
        downloadUserDataIfNewer: async () => {
            const state = storage.getUserDataServiceState();
            if (!state) { return; }

            const userState = state.userProfiles.find(x => x.key === state.activeUserProfileKey);
            if (!userState) { return; }

            console.log(`downloadUserDataIfNewer`);

            const uploader = createUploader(userState.uploadUrl);
            const userData = await uploader.downloadData() as UserData;

            // Don't update if not newer
            if (!userData.timestamp || userData.timestamp <= (userState.lastUploadTimestamp ?? 0)) {
                console.log(`downloadUserDataIfNewer - Local data is up to date`, { state, userData });
                return;
            }

            console.log(`downloadUserDataIfNewer - UPDATING`, { state, userData });
            storage.setUserData(userData);
        },
        createShareCode: async (userProfileKey: string) => {
            await service.setup();
            const user = getUserProfile(userProfileKey);
            if (!user) {
                throw new AppError(`user should not be null`);
            }

            const shareUrlResult = await uploadApi.createUploadUrl({ contentType: `application/json`, shareablePath: true });

            // Save user uploadUrl to shared path
            const uploader = createUploader(shareUrlResult.uploadUrl);
            await uploader.uploadData(user.uploadUrl);

            return {
                shareCode: shareUrlResult.uploadUrl.relativePath,
            };
        },
        addUserFromShareCode: async (shareCode: string) => {
            console.log(`addUserFromShareCode`, { shareCode });

            // Don't have a clean way to get the path, but can generate a new path from the server and use it as a template
            const shareUrlResult = await uploadApi.createUploadUrl({ contentType: `application/json`, shareablePath: true });
            const shareGetUrl = shareUrlResult.uploadUrl.getUrl.replace(shareUrlResult.uploadUrl.relativePath, shareCode.toUpperCase());
            const sharedUploadUrl = await downloadData(shareGetUrl) as UploadUrl;
            if (!sharedUploadUrl.putUrl) {
                console.log(`addUserFromShareCode - FAILED TO GET PROFILE`);
                throw new AppError(`Failed to get user profile`);
            }

            const state = storage.getUserDataServiceState();
            if (!state) {
                console.log(`addUserFromShareCode - NO STATE`);
                throw new AppError(`UserDataService is not setup`);
            }

            // Already has that user profile
            if (state.userProfiles.find(x => x.key === sharedUploadUrl.relativePath)) {
                console.log(`addUserFromShareCode - ALREADY HAS USER`, { userKey: sharedUploadUrl.relativePath });
                return;
            }

            state.userProfiles.push({
                key: sharedUploadUrl.relativePath,
                name: `Player ${state.userProfiles.length + 1}`,
                uploadUrl: sharedUploadUrl,
            });
            storage.setUserDataServiceState(state);

            console.log(`addUserFromShareCode - ADDED`, { userKey: sharedUploadUrl.relativePath });
        },
    };
    return service;
};

export type UserDataService = ReturnType<typeof createUserDataService>;
const serviceState = {
    instance: null as null | UserDataService,
};
export const UserDataService = {
    get: (): UserDataService => {
        if (!serviceState.instance) {
            serviceState.instance = createUserDataService();
        };
        return serviceState.instance;
    },
};
