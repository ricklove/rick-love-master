import React from 'react';
import { C } from 'controls-react';
import { createAuthenticationClient } from '../client/login';
import { AuthenticationStatus } from '../client/auth-types';

const mockServerState = {
    password: `42`,
    status: {
        isAuthenticated: false,
    } as AuthenticationStatus,
};
const authClient = createAuthenticationClient({
    serverAccess: {
        refreshStatus: async () => ({ result: mockServerState.status }),
        logout: async () => {
            mockServerState.status = { isAuthenticated: false };
            return { result: mockServerState.status };
        },
        login: async (username, password) => {
            if (password !== mockServerState.password) {
                mockServerState.status = { isAuthenticated: false };
                return { result: mockServerState.status };
            }
            mockServerState.status = { isAuthenticated: true, requiresVerifiedPhone: true, username };
            return { result: mockServerState.status };
        },
        changePassword: async (password) => {
            mockServerState.password = password;
            mockServerState.status = { ...mockServerState.status, requiresPasswordReset: false };
            return { result: mockServerState.status };
        },
        requestPhoneLoginCode: async (phone) => {

        },
        loginWithPhoneCode: async (phone, code) => {
            mockServerState.status = { isAuthenticated: true, requiresPasswordReset: true, username: `ricklove`, phone, email: `test@test.com` };
            return { result: mockServerState.status };
        },
    },
});
export const AuthComponent = () => {
    return (
        <C.View_Panel>
            <authClient.AuthenticationView />
        </C.View_Panel>
    );
};
