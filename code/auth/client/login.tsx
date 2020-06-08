import React, { useState, useEffect } from 'react';
import { C } from 'controls-react';
import { useAutoLoadingError } from 'utils-react/hooks';
import { toStandardPhoneNumber, PhoneNumber } from 'utils/phone-number';
import { AuthenticationStatus, AuthServerAccess } from './auth-types';


type AuthClientState = {
    status: null | AuthenticationStatus;
}
type AuthConfig = {
    requiresVerifiedPhone: boolean;
    requiresVerifiedEmail: boolean;
};

export const createAuthenticationClient = ({ serverAccess }: { serverAccess: AuthServerAccess }) => {
    const state: AuthClientState = { status: null as null | AuthenticationStatus };
    const props = { state, serverAccess };
    return {
        AuthenticationView: ({ onAuthChange }: { onAuthChange?: (status: AuthenticationStatus) => void }) => <AuthenticationView {...props} onAuthChange={onAuthChange} />,
    };
};

const AuthenticationView = ({ state, serverAccess, onAuthChange }: { state: AuthClientState, serverAccess: AuthServerAccess, onAuthChange?: (status: AuthenticationStatus) => void }) => {

    const { loading, error, doWork } = useAutoLoadingError();
    useEffect(() => {
        if (!state.status) {
            doWork(async (stopIfObsolete) => {
                const s = state;
                s.status = (await serverAccess.refreshStatus()).result;
            });
        }
    }, []);

    const [renderId, setRenderId] = useState(0);
    const onAuthChangeInner = (status: AuthenticationStatus) => {
        console.log(`onAuthChangeInner`, { status });

        const s = state;
        s.status = status;
        onAuthChange?.(status);
        setRenderId(x => x + 1);
    };

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
                <UnauthenticatedView serverAccess={serverAccess} onAuthChange={onAuthChangeInner} />
            </>
        );
    }

    if (state.status.requiresPasswordReset) {
        return (
            <>
                <C.Loading loading={loading} />
                <C.ErrorBox error={error} />
                <ChangePasswordForm serverAccess={serverAccess} onAuthChange={onAuthChangeInner} label='Reset Password' />
            </>
        );
    }

    if (state.status.requiresVerifiedPhone) {
        return (
            <>
                <C.Loading loading={loading} />
                <C.ErrorBox error={error} />
                <RegisterPhoneForm serverAccess={serverAccess} onAuthChange={onAuthChangeInner} />
            </>
        );
    }

    return (
        <>
            <C.Loading loading={loading} />
            <C.ErrorBox error={error} />
            <AuthenticatedView serverAccess={serverAccess} status={state.status} onAuthChange={onAuthChangeInner} />
        </>
    );
};

const UnauthenticatedView = ({ serverAccess, onAuthChange }: { serverAccess: AuthServerAccess, onAuthChange: (status: AuthenticationStatus) => void }) => {

    const [tab, setTab] = useState(`login` as 'login' | 'create-account' | 'forgot-password');
    if (tab === `create-account`) {
        return (
            <CreateAccountForm serverAccess={serverAccess} onAuthChange={onAuthChange} onNavigate={(view) => setTab(view)} />
        );
    }
    if (tab === `forgot-password`) {
        return (
            <ForgotPasswordForm serverAccess={serverAccess} onAuthChange={onAuthChange} onNavigate={(view) => setTab(view)} />
        );
    }
    return (
        <LoginForm serverAccess={serverAccess} onAuthChange={onAuthChange} onNavigate={(view) => setTab(view)} />
    );
};

const AuthenticatedView = ({ serverAccess, status, onAuthChange }: { serverAccess: AuthServerAccess, status: AuthenticationStatus, onAuthChange: (status: AuthenticationStatus) => void }) => {

    const [tab, setTab] = useState(`logout` as 'logout' | 'change-username' | 'change-password' | 'change-phone' | 'change-email');
    if (tab === `change-password`) {
        return (
            <ChangePasswordForm serverAccess={serverAccess} onAuthChange={onAuthChange} onDone={() => setTab(`logout`)} navButtons={[{ label: `Cancel`, action: () => setTab(`logout`) }]} />
        );
    }
    if (tab === `change-phone`) {
        return (
            <ChangePhoneForm serverAccess={serverAccess} onAuthChange={onAuthChange} onDone={() => setTab(`logout`)} />
        );
    }
    return (
        <AccountInfoForm serverAccess={serverAccess} status={status} onAuthChange={onAuthChange} onNavigate={(view) => setTab(view)} />
    );
};

const LoginForm = (props: { serverAccess: AuthServerAccess, onAuthChange: (status: AuthenticationStatus) => void, onNavigate: (view: 'create-account' | 'forgot-password') => void }) => {

    const [username, setUsername] = useState(``);
    const [password, setPassword] = useState(``);
    const [hasFailed, setHasFailed] = useState(false);
    const { loading, error, doWork } = useAutoLoadingError();

    const login = () => {
        doWork(async (stopIfObsolete) => {
            setHasFailed(false);

            const result = await props.serverAccess.login(username, password);
            stopIfObsolete();

            if (!result.result.isAuthenticated) {
                setHasFailed(true);
                return;
            }

            props.onAuthChange(result.result);
        });

    };

    return (
        <>
            <C.View_Form>
                <C.View_FormActionRow>
                    <C.Button_FormAction styleAlt onPress={() => props.onNavigate(`create-account`)}>Create Account</C.Button_FormAction>
                </C.View_FormActionRow>
                <C.View_FormFields>
                    <C.Text_FormTitle>Login</C.Text_FormTitle>
                    <C.Loading loading={loading} />
                    <C.ErrorBox error={error} />
                    <C.View_FieldRow>
                        <C.Input_Username placeholder='Username' value={username} onChange={setUsername} onSubmit={login} />
                    </C.View_FieldRow>
                    <C.View_FieldRow>
                        <C.Input_Password placeholder='Password' value={password} onChange={setPassword} onSubmit={login} />
                        <C.Button_FieldInline styleAlt onPress={() => props.onNavigate(`forgot-password`)}>Forgot Password</C.Button_FieldInline>
                    </C.View_FieldRow>
                    {hasFailed && (<C.ErrorMessage>Incorrect username or password</C.ErrorMessage>)}
                </C.View_FormFields>
                <C.View_FormActionRow>
                    <C.Button_FormAction onPress={login}>Login</C.Button_FormAction>
                </C.View_FormActionRow>
            </C.View_Form>
        </>
    );
};


const CreateAccountForm = (props: { serverAccess: AuthServerAccess, onAuthChange: (status: AuthenticationStatus) => void, onNavigate: (view: 'login') => void }) => {

    const [username, setUsername] = useState(``);
    const [password, setPassword] = useState(``);
    const { loading, error, doWork } = useAutoLoadingError();

    const createAccount = () => {
        if (!username) {
            return;
        }
        if (!password) {
            return;
        }

        doWork(async (stopIfObsolete) => {
            const result = await props.serverAccess.createAccount(username, password);
            stopIfObsolete();

            props.onAuthChange(result.result);
        });
    };

    return (
        <>
            <C.View_Form>
                <C.View_FormActionRow>
                    <C.Button_FormAction styleAlt onPress={() => props.onNavigate(`login`)}> Login</C.Button_FormAction>
                </C.View_FormActionRow>
                <C.View_FormFields>
                    <C.Text_FormTitle>Create Account</C.Text_FormTitle>
                    <C.Loading loading={loading} />
                    <C.ErrorBox error={error} />
                    <C.View_FieldRow>
                        <C.Input_Username placeholder='Username' value={username} onChange={setUsername} onSubmit={createAccount} />
                    </C.View_FieldRow>
                    <PasswordFields password={password} onPasswordChange={setPassword} />
                </C.View_FormFields>
                <C.View_FormActionRow>
                    <C.Button_FormAction onPress={createAccount}>Create Account</C.Button_FormAction>
                </C.View_FormActionRow>
            </C.View_Form>
        </>
    );
};


const ChangePasswordForm = (props: {
    serverAccess: AuthServerAccess;
    onAuthChange: (status: AuthenticationStatus) => void;
    label?: string;
    onDone?: () => void;
    navButtons?: { label: string, action: () => void }[];
}) => {

    const [password, setPassword] = useState(``);
    const { loading, error, doWork } = useAutoLoadingError();

    const changePassword = (newPassword?: string) => {
        //  console.log(`changePassword`, { newPassword });
        if (newPassword) {
            setPassword(newPassword);
        }
        const pw = newPassword ?? password;
        if (!pw) {
            return;
        }

        doWork(async (stopIfObsolete) => {
            const result = await props.serverAccess.changePassword(pw);
            stopIfObsolete();

            props.onAuthChange(result.result);
            props.onDone?.();
        });
    };

    return (
        <>
            <C.View_Form>
                <C.View_FormActionRow>
                    {props.navButtons?.map(x => (
                        <C.Button_FormAction key={x.label} styleAlt onPress={x.action}>{x.label}</C.Button_FormAction>
                    ))}
                </C.View_FormActionRow>
                <C.View_FormFields>
                    <C.Text_FormTitle>{props.label ?? `Change Password`}</C.Text_FormTitle>
                    <C.Loading loading={loading} />
                    <C.ErrorBox error={error} />
                    <PasswordFields password={password} onPasswordChange={changePassword} />
                </C.View_FormFields>
                <C.View_FormActionRow>
                    <C.Button_FormAction onPress={changePassword}>{props.label ?? `Change Password`}</C.Button_FormAction>
                </C.View_FormActionRow>
            </C.View_Form>
        </>
    );
};


const PasswordFields = (props: { password: string, onPasswordChange: (password: string) => void }) => {

    const [password, setPassword] = useState(props.password);
    const [password2, setPassword2] = useState(``);
    const [passwordError, setPasswordError] = useState(null as null | 'missing' | 'must-match');

    const changePassword = () => {
        if (!password.trim()) {
            setPasswordError(`missing`);
            return;
        }
        if (!password2) { return; }
        if (password !== password2) {
            setPasswordError(`must-match`);
            return;
        }
        setPasswordError(null);

        if (password !== props.password) {
            props.onPasswordChange(password);
        }
    };

    return (
        <>
            <C.View_FieldRow>
                <C.Input_Password placeholder='Password' value={password} onChange={setPassword} onSubmit={changePassword} onBlur={changePassword} />
            </C.View_FieldRow>
            {passwordError === `missing` && (<C.ErrorMessage>Please Enter a Password</C.ErrorMessage>)}
            <C.View_FieldRow>
                <C.Input_Password placeholder='Confirm Password' value={password2} onChange={setPassword2} onSubmit={changePassword} onBlur={changePassword} />
            </C.View_FieldRow>
            {passwordError === `must-match` && (<C.ErrorMessage>Passwords Must Match</C.ErrorMessage>)}
        </>
    );
};

const ForgotPasswordForm = (props: { serverAccess: AuthServerAccess, onNavigate: (view: 'login') => void, onAuthChange: (status: AuthenticationStatus) => void }) => {
    return (
        <VerifyPhoneForm
            requestCode={props.serverAccess.requestPhoneLoginCode}
            verifyCode={props.serverAccess.loginWithPhoneCode}
            onAuthChange={props.onAuthChange}
            label='Forgot Password'
            navButtons={[{ label: `Login`, action: () => props.onNavigate(`login`) }]}
        />
    );
};


const RegisterPhoneForm = (props: { serverAccess: AuthServerAccess, onAuthChange: (status: AuthenticationStatus) => void }) => {
    return (
        <VerifyPhoneForm
            requestCode={props.serverAccess.registerPhoneAndSendVerification}
            verifyCode={props.serverAccess.verifyPhone}
            onAuthChange={props.onAuthChange}
            label='Register Phone'
        />
    );
};

const ChangePhoneForm = (props: { serverAccess: AuthServerAccess, onAuthChange: (status: AuthenticationStatus) => void, onDone: () => void }) => {
    return (
        <VerifyPhoneForm
            requestCode={props.serverAccess.registerPhoneAndSendVerification}
            verifyCode={props.serverAccess.verifyPhone}
            onAuthChange={props.onAuthChange}
            onDone={props.onDone}
            label='Change Phone'
            navButtons={[{ label: `Cancel`, action: props.onDone }]}
        />
    );
};

const VerifyPhoneForm = (props: {
    requestCode: (phone: PhoneNumber) => Promise<void>;
    verifyCode: (phone: PhoneNumber, code: string) => Promise<{ result: AuthenticationStatus }>;
    onAuthChange: (status: AuthenticationStatus) => void;
    label?: string;
    onDone?: () => void;
    navButtons?: { label: string, action: () => void }[];
}) => {

    const [phone, setPhone] = useState(toStandardPhoneNumber(``));
    const [sentCode, setSentCode] = useState(false);
    const [code, setCode] = useState(``);
    const { loading, error, doWork } = useAutoLoadingError();

    const requestCode = () => {
        doWork(async (stopIfObsolete) => {
            await props.requestCode(phone);
            stopIfObsolete();

            setSentCode(true);
        });
    };

    const verifyCode = () => {
        doWork(async (stopIfObsolete) => {
            const result = await props.verifyCode(phone, code);
            stopIfObsolete();

            props.onAuthChange(result.result);
            props.onDone?.();
        });
    };

    return (
        <>
            <C.View_Form>
                <C.View_FormActionRow>
                    {props.navButtons?.map(x => (
                        <C.Button_FormAction key={x.label} styleAlt onPress={x.action}>{x.label}</C.Button_FormAction>
                    ))}
                </C.View_FormActionRow>
                <C.View_FormFields>
                    <C.Text_FormTitle>{props.label ?? `Change Phone`}</C.Text_FormTitle>
                    <C.Loading loading={loading} />
                    <C.ErrorBox error={error} />
                    <C.View_FieldRow>
                        <C.Input_Phone placeholder='Phone Number' editable={!sentCode} value={phone} onChange={setPhone} onSubmit={requestCode} />
                    </C.View_FieldRow>
                    {sentCode && (
                        <C.View_FieldRow>
                            <C.Input_Text placeholder='Verification Code' value={code} onChange={setCode} onSubmit={verifyCode} />
                        </C.View_FieldRow>
                    )}
                </C.View_FormFields>
                <C.View_FormActionRow>
                    {!sentCode && <C.Button_FormAction onPress={requestCode}>Send Verification Code</C.Button_FormAction>}
                    {sentCode && <C.Button_FormAction onPress={verifyCode}>Verify</C.Button_FormAction>}
                </C.View_FormActionRow>
            </C.View_Form>
        </>
    );
};


const AccountInfoForm = (props: {
    serverAccess: AuthServerAccess;
    status: AuthenticationStatus;
    onAuthChange: (status: AuthenticationStatus) => void;
    onNavigate: (view: 'change-username' | 'change-password' | 'change-phone' | 'change-email') => void;
}) => {

    const { loading, error, doWork } = useAutoLoadingError();

    const logout = () => {
        doWork(async (stopIfObsolete) => {
            const result = await props.serverAccess.logout();
            stopIfObsolete();

            props.onAuthChange(result.result);
        });
    };

    return (
        <>
            <C.View_Form>
                <C.View_FormFields>
                    <C.Text_FormTitle>User Account</C.Text_FormTitle>
                    <C.Loading loading={loading} />
                    <C.ErrorBox error={error} />
                    <C.View_FieldRow>
                        <C.Input_Text editable={false} value={props.status.username ?? ``} onChange={() => { }} />
                        <C.Button_FieldInline styleAlt onPress={() => props.onNavigate(`change-username`)}>Change Username</C.Button_FieldInline>
                        <C.Button_FieldInline styleAlt onPress={() => props.onNavigate(`change-password`)}>Change Password</C.Button_FieldInline>
                    </C.View_FieldRow>
                    <C.View_FieldRow>
                        <C.Input_Phone editable={false} value={props.status.phone ?? toStandardPhoneNumber(``)} onChange={() => { }} />
                        <C.Button_FieldInline styleAlt onPress={() => props.onNavigate(`change-phone`)}>Change Phone</C.Button_FieldInline>
                    </C.View_FieldRow>
                    <C.View_FieldRow>
                        <C.Input_Text editable={false} value={props.status.email ?? ``} onChange={() => { }} />
                        <C.Button_FieldInline styleAlt onPress={() => props.onNavigate(`change-email`)}>Change Email</C.Button_FieldInline>
                    </C.View_FieldRow>
                </C.View_FormFields>
                <C.View_FormActionRow>
                    <C.Button_FormAction onPress={logout}>Log Out</C.Button_FormAction>
                </C.View_FormActionRow>
            </C.View_Form>
        </>
    );
};
