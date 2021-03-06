/* eslint-disable no-console */
import React from 'react';
import { C } from 'controls-react';
import { createAuthenticationClient, createAuthenticationClient_serverAccess } from '../client/login';
import { AuthenticationStatus, AuthError } from '../common/types';

const mockServerState = {
    username: `rick`,
    password: `42`,
    phone: ``,
    phoneCode: ``,
    email: ``,
    emailCode: ``,

    status: {
        isAuthenticated: false,
    } as AuthenticationStatus,
};
const authClient = createAuthenticationClient_serverAccess({
    serverAccess: {
        refreshStatus: async () => ({ result: mockServerState.status }),
        logout: async () => {
            mockServerState.status = { isAuthenticated: false };
            return { result: mockServerState.status };
        },
        createAccount: async (username, password) => {
            mockServerState.username = username;
            mockServerState.password = password;
            mockServerState.status = { isAuthenticated: true, requiresVerifiedPhone: true, username };
            return { result: mockServerState.status };
        },
        login: async (username, password) => {
            if (username !== mockServerState.username
                || password !== mockServerState.password) {
                mockServerState.status = { isAuthenticated: false };
                return { result: mockServerState.status };
            }
            mockServerState.status = { isAuthenticated: true, requiresVerifiedPhone: true, username };
            return { result: mockServerState.status };
        },
        changeUsername: async (username) => {
            mockServerState.username = username;
            mockServerState.status = { ...mockServerState.status, username };
            return { result: mockServerState.status };
        },
        changePassword: async (password) => {
            mockServerState.password = password;
            mockServerState.status = { ...mockServerState.status, requiresPasswordReset: false };
            return { result: mockServerState.status };
        },

        // Phone
        requestPhoneLoginCode: async (phone) => {
            mockServerState.phoneCode = `${Math.floor(100000 + Math.random() * 899999)}`;
            console.log(`phoneCode`, { phoneCode: mockServerState.phoneCode });
        },
        loginWithPhoneCode: async (phone, code) => {
            if (mockServerState.phoneCode !== code) {
                // mockServerState.status = { isAuthenticated: false };
                // return { result: mockServerState.status };
                throw new AuthError(`Invalid Login Code`);
            }
            mockServerState.phone = phone;
            mockServerState.status = { isAuthenticated: true, requiresPasswordReset: true, username: mockServerState.username, phone };
            return { result: mockServerState.status };
        },
        registerPhoneAndSendVerification: async (phone) => {
            mockServerState.phoneCode = `${Math.floor(100000 + Math.random() * 899999)}`;
            console.log(`phoneCode`, { phoneCode: mockServerState.phoneCode });
            return { result: mockServerState.status };
        },
        verifyPhone: async (phone, code) => {
            if (mockServerState.phoneCode !== code) {
                throw new AuthError(`Invalid Verification Code`);
                // return { result: mockServerState.status };
            }
            mockServerState.phone = phone;
            mockServerState.status = { ...mockServerState.status, phone, requiresVerifiedPhone: false };
            return { result: mockServerState.status };
        },

        // Email
        requestEmailLoginCode: async (email) => {
            mockServerState.emailCode = `${Math.floor(100000 + Math.random() * 899999)}`;
            console.log(`emailCode`, { emailCode: mockServerState.emailCode });
        },
        loginWithEmailCode: async (email, code) => {
            if (mockServerState.emailCode !== code) {
                // mockServerState.status = { isAuthenticated: false };
                // return { result: mockServerState.status };
                throw new AuthError(`Invalid Login Code`);
            }
            mockServerState.email = email;
            mockServerState.status = { isAuthenticated: true, requiresPasswordReset: true, username: mockServerState.username, email };
            return { result: mockServerState.status };
        },
        registerEmailAndSendVerification: async (email) => {
            mockServerState.emailCode = `${Math.floor(100000 + Math.random() * 899999)}`;
            console.log(`emailCode`, { emailCode: mockServerState.emailCode });
            return { result: mockServerState.status };
        },
        verifyEmail: async (email, code) => {
            if (mockServerState.emailCode !== code) {
                throw new AuthError(`Invalid Verification Code`);
                // return { result: mockServerState.status };
            }
            mockServerState.email = email;
            mockServerState.status = { ...mockServerState.status, email, requiresVerifiedEmail: false };
            return { result: mockServerState.status };
        },


    },
    config: {
        minPasswordLength: 8,
    },
});
export const AuthComponent = () => {
    return (
        <C.View_Panel>
            <authClient.AuthenticationView />
        </C.View_Panel>
    );
};
