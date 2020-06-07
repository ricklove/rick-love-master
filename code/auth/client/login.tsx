import React, { useState, useEffect } from 'react';
import { C } from 'controls-react';
import { useAutoLoadingError } from 'utils-react/hooks';

type AuthenticationStatus = {
    isAuthenticated: boolean;
    requiresPasswordReset?: boolean;
    requiresVerifiedPhone?: boolean;
    requiredVerifiedEmail?: boolean;
};

type AuthClientState = {
    status: null | AuthenticationStatus;
}
type AuthServerAccess = {

    refreshStatus: () => Promise<{ result: AuthenticationStatus }>;

    // Unauthenticated
    login: (username: string, password: string) => Promise<{ result: AuthenticationStatus }>;
    createAccount: (username: string, password: string) => Promise<{ result: AuthenticationStatus }>;

    // Use exponential backoff for multiple requests
    requestPhoneLoginCode: (phone: string) => Promise<void>;
    loginWithPhoneCode: (phone: string, code: string) => Promise<{ result: AuthenticationStatus }>;

    // Use exponential backoff for multiple requests
    requestEmailLoginCode: (email: string) => Promise<void>;
    loginWithEmailCode: (email: string, code: string) => Promise<{ result: AuthenticationStatus }>;

    // Authenticated
    requestPhoneVerification: (phone: string) => Promise<{ result: AuthenticationStatus }>;
    verifyPhone: (phone: string, code: string) => Promise<{ result: AuthenticationStatus }>;

    requestEmailVerification: (email: string) => Promise<{ result: AuthenticationStatus }>;
    verifyEmail: (email: string) => Promise<{ result: AuthenticationStatus }>;
};
type AuthConfig = {
    requiresVerifiedPhone: boolean;
    requiresVerifiedEmail: boolean;
};

export const createAuthenticationClient = ({ serverAccess }: { serverAccess: AuthServerAccess }) => {
    const state: AuthClientState = { status: null as null | AuthenticationStatus };
    const props = { state, serverAccess };
    return {
        AuthenticationView: () => <AuthenticationView {...props} />,
    };
};

const AuthenticationView = ({ state, serverAccess }: { state: AuthClientState, serverAccess: AuthServerAccess }) => {

    const { loading, error, doWork } = useAutoLoadingError();
    useEffect(() => {
        if (!state.status) {
            doWork(async (stopIfObsolete) => {
                const s = state;
                s.status = await (await serverAccess.refreshStatus()).result;
            });
        }
    }, []);

    if (!state.status) {
        return (
            <>
                <C.Loading loading={loading} />
                <C.ErrorBox error={error} />
            </>
        );
    }

    if (!state.status.isAuthenticated) {
        return (
            <>
                <C.Loading loading={loading} />
                <C.ErrorBox error={error} />
                <LoginOrCreateAccount serverAccess={serverAccess} />
            </>
        );
    }

    return (
        <>
            <C.Loading loading={loading} />
            <C.ErrorBox error={error} />
        </>
    );
};

const LoginOrCreateAccount = ({ serverAccess }: { serverAccess: AuthServerAccess }) => {

    const [tab, setTab] = useState(`login` as 'login' | 'create' | 'forgot');
    if (tab === `create`) {
        return (
            <CreateAccountForm serverAccess={serverAccess} onGotoLogin={() => setTab(`login`)} />
        );
    }
    // if( tab === 'forgot'){
    //     return (
    //         <CreateAccountForm serverAccess={serverAccess}/>
    //     );
    // }
    return (
        <LoginForm serverAccess={serverAccess} onGotoCreateAccount={() => setTab(`create`)} onGotoForgotPassword={() => setTab(`forgot`)} />
    );
};

const LoginForm = (props: { serverAccess: AuthServerAccess, onGotoCreateAccount: () => void, onGotoForgotPassword: () => void }) => {

    const [username, setUsername] = useState(``);
    const [password, setPassword] = useState(``);

    const login = () => {
        console.log(`login`, { username, password });
    };

    return (
        <>
            <C.View_Form>
                <C.View_FormActionRow>
                    <C.Button_FormAction styleAlt onPress={props.onGotoCreateAccount}>Create Account</C.Button_FormAction>
                </C.View_FormActionRow>
                <C.View_FormFields>
                    <C.Text_FormTitle>Login</C.Text_FormTitle>
                    <C.View_FieldRow>
                        {/* <C.Text_FieldLabel>Username</C.Text_FieldLabel> */}
                        <C.Input_Username placeholder='Username' value={username} onChange={setUsername} onSubmit={login} />
                    </C.View_FieldRow>
                    <C.View_FieldRow>
                        {/* <C.Text_FieldLabel>Password</C.Text_FieldLabel> */}
                        <C.Input_Password placeholder='Password' value={password} onChange={setPassword} onSubmit={login} />
                        <C.Button_FieldInline styleAlt onPress={props.onGotoForgotPassword}>Forgot Password</C.Button_FieldInline>
                    </C.View_FieldRow>
                    {/* <C.View_FormActionRow>
                        <C.Button_FormAction onPress={props.onGotoForgotPassword}>Forgot Password</C.Button_FormAction>
                    </C.View_FormActionRow> */}
                </C.View_FormFields>
                <C.View_FormActionRow>
                    <C.Button_FormAction onPress={login}>Login</C.Button_FormAction>
                </C.View_FormActionRow>
            </C.View_Form>
        </>
    );
};


const CreateAccountForm = (props: { serverAccess: AuthServerAccess, onGotoLogin: () => void }) => {

    const [username, setUsername] = useState(``);
    const [password, setPassword] = useState(``);
    const [password2, setPassword2] = useState(``);
    const [passwordError, setPasswordError] = useState(null as null | 'missing' | 'must-match');

    const createAccount = () => {
        if (!password.trim()) {
            setPasswordError(`missing`);
            return;
        }
        if (password !== password2) {
            setPasswordError(`must-match`);
            return;
        }

        console.log(`create Account`, { username, password });
    };

    return (
        <>
            <C.View_Form>
                <C.View_FormActionRow>
                    <C.Button_FormAction styleAlt onPress={props.onGotoLogin}>Login</C.Button_FormAction>
                </C.View_FormActionRow>
                <C.View_FormFields>
                    <C.Text_FormTitle>Create Account</C.Text_FormTitle>
                    <C.View_FieldRow>
                        {/* <C.Text_FieldLabel>Username</C.Text_FieldLabel> */}
                        <C.Input_Username placeholder='Username' value={username} onChange={setUsername} onSubmit={createAccount} />
                    </C.View_FieldRow>
                    <C.View_FieldRow>
                        {/* <C.Text_FieldLabel>Password</C.Text_FieldLabel> */}
                        <C.Input_Password placeholder='Password' value={password} onChange={setPassword} onSubmit={createAccount} />
                    </C.View_FieldRow>
                    {passwordError === `missing` && (<C.ErrorMessage>Please Enter a Password</C.ErrorMessage>)}
                    <C.View_FieldRow>
                        {/* <C.Text_FieldLabel>Confirm Password</C.Text_FieldLabel> */}
                        <C.Input_Password placeholder='Confirm Password' value={password2} onChange={setPassword2} onSubmit={createAccount} />
                    </C.View_FieldRow>
                    {passwordError === `must-match` && (<C.ErrorMessage>Passwords Must Match</C.ErrorMessage>)}
                </C.View_FormFields>
                <C.View_FormActionRow>
                    <C.Button_FormAction onPress={createAccount}>Create Account</C.Button_FormAction>
                </C.View_FormActionRow>
            </C.View_Form>
        </>
    );
};
