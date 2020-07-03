import { PhoneNumber } from 'utils/phone-number';
import { EmailAddress } from 'utils/email-address';

export type AuthenticationStatus = {
    isAuthenticated: boolean;
    requiresPasswordReset?: boolean;
    requiresVerifiedPhone?: boolean;
    requiresVerifiedEmail?: boolean;

    username?: string;
    phone?: PhoneNumber;
    email?: EmailAddress;
};

export type AuthClientApi = {

    refreshStatus: () => Promise<{ result: AuthenticationStatus }>;

    logout: () => Promise<{ result: AuthenticationStatus }>;

    login: (params: { username: string, password: string }) => Promise<{ result: AuthenticationStatus }>;
    createAccount: (params: { username: string, password: string }) => Promise<{ result: AuthenticationStatus }>;

    changeUsername: (params: { username: string }) => Promise<{ result: AuthenticationStatus }>;
    changePassword: (params: { password: string }) => Promise<{ result: AuthenticationStatus }>;

    // Note: Use exponential backoff for multiple requests

    // Phone

    /** Register the phone with this account and send verification code
     * 
     * Error if phone is already registered with another account
     */
    registerPhoneAndSendVerification: (params: { phone: PhoneNumber }) => Promise<{ result: { isAuthenticated: boolean } }>;
    verifyPhone: (params: { phone: PhoneNumber, code: string }) => Promise<{ result: AuthenticationStatus }>;
    requestPhoneLoginCode: (params: { username: string, phone: PhoneNumber }) => Promise<void>;
    loginWithPhoneCode: (params: { phone: PhoneNumber, code: string }) => Promise<{ result: AuthenticationStatus }>;

    // Email

    /** Register the email with this account and send verification code
    * 
    * Error if email is already registered with another account
    */
    registerEmailAndSendVerification: (params: { email: EmailAddress }) => Promise<{ result: { isAuthenticated: boolean } }>;
    verifyEmail: (params: { email: EmailAddress, code: string }) => Promise<{ result: AuthenticationStatus }>;
    requestEmailLoginCode: (params: { username: string, email: EmailAddress }) => Promise<void>;
    loginWithEmailCode: (params: { email: EmailAddress, code: string }) => Promise<{ result: AuthenticationStatus }>;
};


export class AuthError extends Error {
    constructor(public message: string, public data?: unknown) { super(); }
}
