import React from 'react';
import { C } from 'controls-react';
import { PhoneNumber, toStandardPhoneNumber } from 'utils/phone-number';
import { createAuthenticationClient, AuthenticationStatus } from '../client/login';

const mockServerState = {
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
            mockServerState.status = { isAuthenticated: true, requiresVerifiedPhone: true, username };
            return { result: mockServerState.status };
        },
        changePassword: async (password) => {
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
