import { EmailAddress } from 'utils/email-address';
import { PhoneNumber } from 'utils/phone-number';
import { AuthClientApi, AuthError } from '../common/types';


export type AuthPasswordHash = string & { __type: 'AuthPasswordHash' };
export type AuthPasswordSalt = string & { __type: 'AuthPasswordSalt' };

/** This is used to access storage with regard to a specific authenticated user */
export type AuthUserKey = unknown & { __type: 'UserKey' };
type UserIdentityState = {
    username: string;
    email?: EmailAddress;
    phone?: PhoneNumber;

    password_salt: AuthPasswordSalt;
    password_serverHash: AuthPasswordHash;

    email_unverified?: EmailAddress;
    email_code?: string;
    phone_unverified?: PhoneNumber;
    phone_code?: string;
};
export type AuthServerStorage = {
    getUserIdentityState: (authUserKey: AuthUserKey) => Promise<UserIdentityState>;
    setUserIdentityState: (authUserKey: AuthUserKey, state: UserIdentityState) => Promise<void>;
    findUser_username: (username: string) => Promise<AuthUserKey | null>;
    findUser_phone: (phone: PhoneNumber) => Promise<AuthUserKey | null>;
    findUser_email: (email: EmailAddress) => Promise<AuthUserKey | null>;
    createAccount: () => Promise<AuthUserKey>;
};
export type AuthUserContext = {
    getUserKey: () => Promise<AuthUserKey | null>;
    setUserKey: (authUserKey: AuthUserKey) => Promise<void>;
    resetUserKey: () => Promise<void>;
};
export type AuthServerConfig = {
    requireVerifiedPhone: boolean;
    requireVerifiedEmail: boolean;
};
export type AuthMessaging = {
    sendPhoneMessage
};
export const createAuthServer = (dependencies: { config: AuthServerConfig, storage: AuthServerStorage, userContext: AuthUserContext, messaging: AuthMessaging }) => {
    const { config, storage, userContext } = dependencies;

    const hashPassword = (password: string, passwordSalt: string): AuthPasswordHash => {
        // TODO: scrypt
        return `${password + passwordSalt}hashbrowns` as AuthPasswordHash;
    };
    const generatePasswordSalt = (): AuthPasswordSalt => {
        // TODO: crypto salt
        return (`${Math.random()}salty`) as AuthPasswordSalt;
    };
    const generateVerificationCode = (): string => {
        // TODO: Does a 6 digit number need to be crypto random?
        return `${Math.floor(100000 + Math.random() * 899999)}`;
    };


    const getStatus = (userState: UserIdentityState) => {
        return {
            result: {
                isAuthenticated: true,
                username: userState.username,
                email: userState.email,
                phone: userState.phone,
                requiresVerifiedPhone: config.requireVerifiedPhone && !userState.phone,
                requiresVerifiedEmail: config.requireVerifiedEmail && !userState.email,
            },
        };
    };

    const logout = async () => { await userContext.resetUserKey(); return { result: { isAuthenticated: false } }; };
    const getUserKeyAndState = async () => {
        const userKey = await userContext.getUserKey();
        const userState = !userKey ? null : await storage.getUserIdentityState(userKey);
        return { userKey, userState };
    };

    const clientApi: AuthClientApi = {
        refreshStatus: async () => {
            const { userKey, userState } = await getUserKeyAndState();
            if (!userKey || !userState) { return await logout(); }

            return getStatus(userState);
        },

        logout,
        login: async ({ username, password }) => {
            const targetUserKey = await storage.findUser_username(username);
            if (!targetUserKey) { return { result: { isAuthenticated: false } }; }

            const target = await storage.getUserIdentityState(targetUserKey);
            if (!target) { return { result: { isAuthenticated: false } }; }

            if (target.password_serverHash !== hashPassword(password, target.password_salt)) { return { result: { isAuthenticated: false } }; }

            await userContext.setUserKey(targetUserKey);
            return getStatus(target);
        },
        createAccount: async ({ username, password }) => {
            const exists = await storage.findUser_username(username);
            if (exists) { throw new AuthError(`An account with that username already exists`, { username }); }

            const newUserKey = await storage.createAccount();
            const password_salt = generatePasswordSalt();
            const password_serverHash = hashPassword(password, password_salt);
            const newUserState: UserIdentityState = {
                username,
                password_salt,
                password_serverHash,
            };

            await userContext.setUserKey(newUserKey);
            await storage.setUserIdentityState(newUserKey, newUserState);

            return getStatus(newUserState);
        },
        changePassword: async ({ password }) => {
            const { userKey, userState } = await getUserKeyAndState();
            if (!userKey || !userState) { return await logout(); }

            const password_salt = generatePasswordSalt();
            const password_serverHash = hashPassword(password, password_salt);
            userState.password_salt = password_salt;
            userState.password_serverHash = password_serverHash;
            await storage.setUserIdentityState(userKey, userState);

            return getStatus(userState);
        },

        changeUsername: async ({ username }) => {
            const { userKey, userState } = await getUserKeyAndState();
            if (!userKey || !userState) { return await logout(); }

            userState.username = username;
            await storage.setUserIdentityState(userKey, userState);

            return getStatus(userState);
        },

        // Note: Use exponential backoff for multiple requests

        // Phone

        /** Register the phone with this account and send verification code
         * 
         * Error if phone is already registered with another account
         */
        registerPhoneAndSendVerification: async ({ phone }) => {
            const { userKey, userState } = await getUserKeyAndState();
            if (!userKey || !userState) { return await logout(); }

            const exists = await storage.findUser_phone(phone);
            if (exists) { throw new AuthError(`An account with that phone already exists`, { phone }); }

            userState.phone_unverified = phone;
            userState.phone_code = generateVerificationCode();
            await storage.setUserIdentityState(userKey, userState);

            // TOOD: Send Phone Verification Code

            return getStatus(userState);
        };
        // verifyPhone: (params: { phone: PhoneNumber, code: string }) => Promise<{ result: AuthenticationStatus }>;
        // requestPhoneLoginCode: (params: { phone: PhoneNumber }) => Promise<void>;
        // loginWithPhoneCode: (params: { phone: PhoneNumber, code: string }) => Promise<{ result: AuthenticationStatus }>;

        // // Email

        // /** Register the email with this account and send verification code
        // * 
        // * Error if email is already registered with another account
        // */
        // registerEmailAndSendVerification: (params: { email: EmailAddress }) => Promise<void>;
        // verifyEmail: (params: { email: EmailAddress, code: string }) => Promise<{ result: AuthenticationStatus }>;
        // requestEmailLoginCode: (params: { email: EmailAddress }) => Promise<void>;
        // loginWithEmailCode: (params: { email: EmailAddress, code: string }) => Promise<{ result: AuthenticationStatus }>;

    };

    return clientApi;
};
