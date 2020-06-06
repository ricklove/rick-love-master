import React, { useState } from 'react';
import { C } from 'controls-react';

// type PaymentMethodViewServerAccess = {
//     getPaymentMethods: () => Promise<PaymentMethodClientInfo[]>;
//     deletePaymentMethod: (key: PaymentMethodStorageKey) => Promise<void>;
//     onSetupPayment: () => Promise<PaymentProviderSavedPaymentMethodClientSetupToken>;
//     onPaymentMethodReady: (paymentMethodToken: PaymentProviderSavedPaymentMethodClientToken) => Promise<void>;
// };
export const Component = () => {
    return {
        LoginView,
    };
};

export const LoginView = () => {

    const [username, setUsername] = useState(``);
    const [password, setPassword] = useState(``);

    const login = () => {
        console.log(`login`, { username, password });
    };

    return (
        <>
            <C.View_Form>
                <C.View_FormFields>
                    <C.View_FieldRow>
                        <C.Text_FieldLabel>Username</C.Text_FieldLabel>
                        <C.Input_Username value={username} onChange={setUsername} onSubmit={login} />
                    </C.View_FieldRow>
                    <C.View_FieldRow>
                        <C.Text_FieldLabel>Password</C.Text_FieldLabel>
                        <C.Input_Password value={password} onChange={setPassword} onSubmit={login} />
                    </C.View_FieldRow>
                </C.View_FormFields>
                <C.View_FormActionRow>
                    <C.Button_FormAction onPress={login}>Login</C.Button_FormAction>
                </C.View_FormActionRow>
            </C.View_Form>
        </>
    );
};
