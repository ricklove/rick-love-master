import React from 'react';
import { C } from 'controls-react';
import { createAuthenticationClient } from '../client/login';

const authClient = createAuthenticationClient({
    serverAccess: {
        refreshStatus: async () => ({ result: { isAuthenticated: false } }),
    },
});
export const AuthComponent = () => {
    return (
        <C.View_Panel>
            <authClient.AuthenticationView />
        </C.View_Panel>
    );
};
