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
        AuthenticationView: (onChange: (status: AuthenticationStatus) => void) => <AuthenticationView {...props} onChange={onChange} />,
    };
};

const AuthenticationView = ({ state, serverAccess, onChange }: { state: AuthClientState, serverAccess: AuthServerAccess, onChange: (status: AuthenticationStatus) => void }) => {

    const { loading, error, doWork } = useAutoLoadingError();
    useEffect(() => {
        if (!state.status) {
            doWork(async (stopIfObsolete) => {
                const s = state;
                s.status = (await serverAccess.refreshStatus()).result;
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
                <LoginOrCreateAccount serverAccess={serverAccess} onChange={onChange} />
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

const LoginOrCreateAccount = ({ serverAccess, onChange }: { serverAccess: AuthServerAccess, onChange: (status: AuthenticationStatus) => void }) => {

    const [tab, setTab] = useState(`login` as 'login' | 'create' | 'forgot');
    if (tab === `create`) {
        return (
            <CreateAccountForm serverAccess={serverAccess} onGotoLogin={() => setTab(`login`)} onChange={onChange} />
        );
    }
    if (tab === `forgot`) {
        return (
            <ForgotPasswordForm serverAccess={serverAccess} onGotoLogin={() => setTab(`login`)} onChange={onChange} />
        );
    }
    return (
        <LoginForm serverAccess={serverAccess} onGotoCreateAccount={() => setTab(`create`)} onGotoForgotPassword={() => setTab(`forgot`)} onChange={onChange} />
    );
};

const LoginForm = (props: { serverAccess: AuthServerAccess, onGotoCreateAccount: () => void, onGotoForgotPassword: () => void, onChange: (status: AuthenticationStatus) => void }) => {

    const [username, setUsername] = useState(``);
    const [password, setPassword] = useState(``);
    const { loading, error, doWork } = useAutoLoadingError();

    const login = () => {
        doWork(async (stopIfObsolete) => {
            const result = await props.serverAccess.login(username, password);
            stopIfObsolete();

            props.onChange(result.result);
        });

    };

    return (
        <>
            <C.View_Form>
                <C.View_FormActionRow>
                    <C.Button_FormAction styleAlt onPress={props.onGotoCreateAccount}>Create Account</C.Button_FormAction>
                </C.View_FormActionRow>
                <C.View_FormFields>
                    <C.Text_FormTitle>Login</C.Text_FormTitle>
                    <C.Loading loading={loading} />
                    <C.ErrorBox error={error} />
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


const CreateAccountForm = (props: { serverAccess: AuthServerAccess, onGotoLogin: () => void, onChange: (status: AuthenticationStatus) => void }) => {

    const [username, setUsername] = useState(``);
    const [password, setPassword] = useState(``);
    const [password2, setPassword2] = useState(``);
    const [passwordError, setPasswordError] = useState(null as null | 'missing' | 'must-match');
    const { loading, error, doWork } = useAutoLoadingError();

    const createAccount = () => {
        if (!password.trim()) {
            setPasswordError(`missing`);
            return;
        }
        if (password !== password2) {
            setPasswordError(`must-match`);
            return;
        }
        setPasswordError(null);

        doWork(async (stopIfObsolete) => {
            const result = await props.serverAccess.createAccount(username, password);
            stopIfObsolete();

            props.onChange(result.result);
        });
    };

    return (
        <>
            <C.View_Form>
                <C.View_FormActionRow>
                    <C.Button_FormAction styleAlt onPress={props.onGotoLogin}>Login</C.Button_FormAction>
                </C.View_FormActionRow>
                <C.View_FormFields>
                    <C.Text_FormTitle>Create Account</C.Text_FormTitle>
                    <C.Loading loading={loading} />
                    <C.ErrorBox error={error} />
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

const ForgotPasswordForm = (props: { serverAccess: AuthServerAccess, onGotoLogin: () => void, onChange: (status: AuthenticationStatus) => void }) => {

    const [phone, setPhone] = useState(``);
    const [sentCode, setSentCode] = useState(false);
    const [code, setCode] = useState(``);
    const { loading, error, doWork } = useAutoLoadingError();

    const requestCode = () => {
        doWork(async (stopIfObsolete) => {
            const result = await props.serverAccess.requestPhoneLoginCode(phone);
            stopIfObsolete();

            setSentCode(true);
        });
    };

    const verifyCode = () => {
        doWork(async (stopIfObsolete) => {
            const result = await props.serverAccess.verifyPhone(phone, code);
            stopIfObsolete();

            props.onChange(result.result);
        });
    };

    return (
        <>
            <C.View_Form>
                <C.View_FormActionRow>
                    <C.Button_FormAction styleAlt onPress={props.onGotoLogin}>Login</C.Button_FormAction>
                </C.View_FormActionRow>
                <C.View_FormFields>
                    <C.Text_FormTitle>Forgot Password</C.Text_FormTitle>
                    <C.Loading loading={loading} />
                    <C.ErrorBox error={error} />
                    <C.View_FieldRow>
                        <C.Input_Text placeholder='Phone Number' editable={!sentCode} value={phone} onChange={setPhone} onSubmit={requestCode} />
                    </C.View_FieldRow>
                    {sentCode && (
                        <C.View_FieldRow>
                            <C.Input_Text placeholder='Verification Code' value={code} onChange={setCode} onSubmit={verifyCode} />
                        </C.View_FieldRow>
                    )}
                </C.View_FormFields>
                <C.View_FormActionRow>
                    {!sentCode && <C.Button_FormAction onPress={requestCode}>Request Code</C.Button_FormAction>}
                    {sentCode && <C.Button_FormAction onPress={verifyCode}>Verify Code</C.Button_FormAction>}
                </C.View_FormActionRow>
            </C.View_Form>
        </>
    );
};
