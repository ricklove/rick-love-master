/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { theme } from 'themes/theme';
import { formatDate } from 'utils/dates';
import { useAutoLoadingError } from 'utils-react/hooks';
import { C } from 'controls-react';
import { createJsonRpcClient } from 'json-rpc/json-rpc-client-stack';
import { createPaymentClientComponents, createPaymentClientExtraComponents, PaymentViewServerAccess } from '../client/payment-react';
import { PaymentComponentStyle, PaymentClientComponents } from '../common/types-react';
import {
    PaymentProviderSavedPaymentMethodClientSetupToken, PaymentProviderName, PaymentClientApi,
    PaymentProviderSavedPaymentMethodClientToken, PaymentMethodClientInfo, PaymentMethodStorageKey,
    PaymentTransaction,
} from '../common/types';
import { getFullStackTestConfig, FullStackTestConfig } from './full-stack-test-config';

export const PaymentFullStackTesterHost = (props: {}) => {

    const [serverAccess, setServerAccess] = useState(null as null | PaymentViewServerAccess);
    const [config, setConfig] = useState(null as null | FullStackTestConfig);

    useEffect(() => {
        (async () => {
            const c = await getFullStackTestConfig();
            setConfig(c);
            const server = createJsonRpcClient<PaymentClientApi>({
                serverUrl: c.serverUrl,
                // Use Cookies
                // sessionTokenStorage: {
                //     getSessionToken: async () => { try { return JSON.parse(localStorage.PaymentFullStackTesterHost_Credentials); } catch{ return null; } },
                //     setSessionToken: async (value) => { localStorage.PaymentFullStackTesterHost_Credentials = JSON.stringify(value); },
                //     resetSessionToken: async () => { localStorage.PaymentFullStackTesterHost_Credentials = undefined; },
                // },
                apiMethodNames: {
                    setupSavedPaymentMethod: `setupSavedPaymentMethod`,
                    saveSavedPaymentMethod: `saveSavedPaymentMethod`,
                    getSavedPaymentMethods: `getSavedPaymentMethods`,
                    deleteSavedPaymentMethod: `deleteSavedPaymentMethod`,
                    debug_triggerPayment: `debug_triggerPayment`,
                    getPayments: `getPayments`,
                },
            });

            const providerName = `stripe` as PaymentProviderName;
            const access: PaymentViewServerAccess = {
                onSetupPayment: async () => {
                    console.log(`onSetupPayment START`);
                    const result = await server.setupSavedPaymentMethod({ providerName });
                    console.log(`onSetupPayment END`, { result });
                    return result;
                },
                onPaymentMethodReady: async (token) => {
                    console.log(`onPaymentMethodReady START`);
                    const result = await server.saveSavedPaymentMethod({ providerName, paymentMethodClientToken: token });
                    console.log(`onPaymentMethodReady END`, { result });
                    return result;
                },
                getPaymentMethods: async () => {
                    console.log(`getPaymentMethods START`);
                    const result = await server.getSavedPaymentMethods();
                    console.log(`getPaymentMethods END`, { result });
                    return result;
                },
                deletePaymentMethod: async (key: PaymentMethodStorageKey) => {
                    console.log(`deletePaymentMethod`);
                    await server.deleteSavedPaymentMethod({ key });
                },
                // onMakePurchase: async (amount: number) => {
                //     console.log(`onMakePurchase`);
                //     await server.debug_triggerPayment({ amount: { currency: `usd`, usdCents: Math.floor(amount * 100) } });
                // },
                getPayments: async () => {
                    console.log(`getPayments START`);
                    const result = await server.getPayments();
                    console.log(`getPayments END`, { result });
                    return result;
                },
            };

            setServerAccess(access);
        })();
    }, []);

    return (
        <div>
            {(!config || !serverAccess) && (<div>Loading...</div>)}
            {config && serverAccess && <PaymentFullStackTester config={config} serverAccess={serverAccess} />}
        </div>
    );
};

export const PaymentFullStackTester = (props: { config: FullStackTestConfig, serverAccess: PaymentViewServerAccess }) => {

    const comp = createPaymentClientExtraComponents({ stripePublicKey: props.config.stripePublicKey, serverAccess: props.serverAccess });
    const AppWrapperComponent = comp.AppWrapperComponent ?? (({ children }) => (<>{children}</>));

    return (
        <AppWrapperComponent>
            <C.View_Panel>
                <C.View_Form>
                    <C.Text_FormTitle>Page and Stuff...</C.Text_FormTitle>
                </C.View_Form>
                <comp.PaymentMethodView />
                <comp.PaymentHistoryView />
            </C.View_Panel>
            {/* <TestControls /> */}
        </AppWrapperComponent>
    );
};
