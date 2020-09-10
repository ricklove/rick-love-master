import { createUploadApiWebClient } from 'upload-api/client/web-client';
import { uploadApiConfig } from 'upload-api/client/config';
import { UploadUrl } from 'upload-api/client/types';

const USER_DATA_SERVICE_STATE_KEY = `_USER_DATA_SERVICE_STATE`;
type UserServiceState = {
    userProfiles: {
        key: string;
        name: string;
        uploadUrl: UploadUrl;
    }[];
    activeUserProfileKey: string;
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
        getUserData: () => {
            const data = {} as { [key: string]: null | string };
            const keys = Object.keys(localStorage).filter(x => !x.startsWith(`_`));
            for (const k of keys) {
                data[k] = localStorage.getItem(k);
            }
            return data;
        },
        setUserData: (userData: { [key: string]: null | string }) => {
            for (const k of Object.keys(userData)) {
                const val = userData[k];
                if (!val) {
                    localStorage.removeItem(k);
                    return;
                }
                localStorage.setItem(k, val);
            }
        },
    };

    const getActiveUserProfile = () => {
        const state = storage.getUserDataServiceState();
        if (!state?.activeUserProfileKey) { return null; }
        return state.userProfiles.find(x => x.key === state.activeUserProfileKey);
    };

    const service = {
        getUserProfiles: () => {
            const state = storage.getUserDataServiceState();
            if (!state?.activeUserProfileKey) { return []; }
            return state.userProfiles.map(x => ({ key: x.key, name: x.name, isActive: state.activeUserProfileKey === x.key }));
        },
        uploadUserData: async () => {
            const user = getActiveUserProfile();
            const userData = storage.getUserData();

            // Get all local storage
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
