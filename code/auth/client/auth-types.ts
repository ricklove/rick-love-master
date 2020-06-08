import { PhoneNumber } from 'utils/phone-number';

export type AuthenticationStatus = {
    isAuthenticated: boolean;
    requiresPasswordReset?: boolean;
    requiresVerifiedPhone?: boolean;
    requiresVerifiedEmail?: boolean;

    username?: string;
    phone?: PhoneNumber;
    email?: string;
};

export type AuthServerAccess = {

    refreshStatus: () => Promise<{ result: AuthenticationStatus }>;

    logout: () => Promise<{ result: AuthenticationStatus }>;

    login: (username: string, password: string) => Promise<{ result: AuthenticationStatus }>;
    createAccount: (username: string, password: string) => Promise<{ result: AuthenticationStatus }>;

    changePassword: (password: string) => Promise<{ result: AuthenticationStatus }>;

    // Note: Use exponential backoff for multiple requests

    // Phone
    requestPhoneVerification: (phone: PhoneNumber) => Promise<{ result: AuthenticationStatus }>;
    verifyPhone: (phone: PhoneNumber, code: string) => Promise<{ result: AuthenticationStatus }>;
    requestPhoneLoginCode: (phone: PhoneNumber) => Promise<void>;
    loginWithPhoneCode: (phone: PhoneNumber, code: string) => Promise<{ result: AuthenticationStatus }>;

    // Email
    requestEmailVerification: (email: string) => Promise<{ result: AuthenticationStatus }>;
    verifyEmail: (email: string) => Promise<{ result: AuthenticationStatus }>;
    requestEmailLoginCode: (email: string) => Promise<void>;
    loginWithEmailCode: (email: string, code: string) => Promise<{ result: AuthenticationStatus }>;
};
