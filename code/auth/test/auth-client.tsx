import React from 'react';
import { C } from 'controls-react';
import { LoginView } from '../client/login';

export const AuthComponent = () => {
    return (
        <C.View_Panel>
            <LoginView />
        </C.View_Panel>
    );
};
