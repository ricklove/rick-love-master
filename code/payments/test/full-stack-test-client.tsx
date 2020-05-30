/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { theme } from 'themes/theme';
import { createJsonRpcClient } from 'json-rpc/json-rpc-client';
import { formatDate } from 'utils/dates';
import { useAutoLoadingError } from 'utils-react/hooks';
import { C } from 'controls-react';
import { createPaymentClientComponents } from '../client/payment-react';
import { PaymentComponentStyle, PaymentClientComponents } from '../common/types-react';
import {
    PaymentProviderSavedPaymentMethodClientSetupToken, PaymentProviderName, PaymentClientApi,
    PaymentProviderSavedPaymentMethodClientToken, PaymentMethodClientInfo, PaymentMethodStorageKey,
    PaymentTransaction,
} from '../common/types';
import { getFullStackTestConfig, FullStackTestConfig } from './full-stack-test-config';

export const PaymentFullStackTesterHost = (props: {}) => {

    const [serverAccess, setServerAccess] = useState(null as null | PaymantViewServerAccess);
    const [config, setConfig] = useState(null as null | FullStackTestConfig);

    useEffect(() => {
        (async () => {
            const c = await getFullStackTestConfig();
            setConfig(c);
            const server = createJsonRpcClient<PaymentClientApi>({
                serverUrl: c.serverUrl,
                appendMethodNameToUrl: true,
            }, {
                setupSavedPaymentMethod: `setupSavedPaymentMethod`,
                saveSavedPaymentMethod: `saveSavedPaymentMethod`,
                getSavedPaymentMethods: `getSavedPaymentMethods`,
                deleteSavedPaymentMethod: `deleteSavedPaymentMethod`,
                debug_triggerPayment: `debug_triggerPayment`,
                getPayments: `getPayments`,
            });

            const providerName = `stripe` as PaymentProviderName;
            const access: PaymantViewServerAccess = {
                onSetupPayment: async () => {
                    console.log(`onSetupPayment`);
                    return await server.setupSavedPaymentMethod({ providerName });
                },
                onPaymentMethodReady: async (token) => {
                    console.log(`onPaymentMethodReady`);
                    return await server.saveSavedPaymentMethod({ providerName, paymentMethodClientToken: token });
                },
                getPaymentMethods: async () => {
                    console.log(`getPaymentMethods`);
                    return await server.getSavedPaymentMethods();
                },
                deletePaymentMethod: async (key: PaymentMethodStorageKey) => {
                    console.log(`deletePaymentMethod`);
                    await server.deleteSavedPaymentMethod({ key });
                },
                onMakePurchase: async (amount: number) => {
                    console.log(`onMakePurchase`);
                    await server.debug_triggerPayment({ amount: { currency: `usd`, usdCents: Math.floor(amount * 100) } });
                },
                getPayments: async () => {
                    console.log(`getPayments`);
                    return await server.getPayments();
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

export const PaymentFullStackTester = (props: { config: FullStackTestConfig, serverAccess: PaymantViewServerAccess }) => {

    const comp = createPaymentClientComponents({ stripePublicKey: props.config.stripePublicKey });
    const AppWrapperComponent = comp.AppWrapperComponent ?? (({ children }) => (<>{children}</>));

    return (
        <AppWrapperComponent>
            <div style={{ padding: 16, background: theme.colors.background, color: theme.colors.text }}>
                <div>Page and Stuff...</div>
                <hr />
                <div>Show me the Money!</div>
                <div >
                    <PaymantView comp={comp} serverAccess={props.serverAccess} />
                </div>
            </div>
            {/* <TestControls /> */}
        </AppWrapperComponent>
    );
};

type PaymantViewServerAccess = {
    getPaymentMethods: () => Promise<PaymentMethodClientInfo[]>;
    deletePaymentMethod: (key: PaymentMethodStorageKey) => Promise<void>;
    onSetupPayment: () => Promise<PaymentProviderSavedPaymentMethodClientSetupToken>;
    onPaymentMethodReady: (paymentMethodToken: PaymentProviderSavedPaymentMethodClientToken) => Promise<void>;
    onMakePurchase: (amount: number) => Promise<void>;
    getPayments: () => Promise<PaymentTransaction[]>;
};
const PaymantView = (props: {
    comp: PaymentClientComponents;
    serverAccess: PaymantViewServerAccess;
}) => {
    const [style, setStyle] = useState({
        textPadding: 4,
        elementPadding: 4,
        buttonAlignment: `right`,
        borderRadius: 4,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background_field,
        textColor: theme.colors.text,
        buttonText: `Save`,
    } as PaymentComponentStyle);

    const { loading, error, doWork } = useAutoLoadingError();

    const [paymentMethods, setPaymentMethods] = useState(null as null | PaymentMethodClientInfo[]);
    const populatePaymentMethods = () => doWork(async () => {
        const result = await props.serverAccess.getPaymentMethods();
        setPaymentMethods(result);
    });

    const deletePaymentMethod = (key: PaymentMethodStorageKey) => doWork(async () => {
        await props.serverAccess.deletePaymentMethod(key);
        populatePaymentMethods();
    });

    const [setupToken, setSetupToken] = useState(null as null | PaymentProviderSavedPaymentMethodClientSetupToken);
    const setupPayment = () => doWork(async () => {
        const result = await props.serverAccess.onSetupPayment();
        console.log(`setupPayment`, { result });
        setSetupToken(result);
    });

    const onPaymentMethodReady = (paymentMethodToken: PaymentProviderSavedPaymentMethodClientToken) => doWork(async () => {
        await props.serverAccess.onPaymentMethodReady(paymentMethodToken);
        setSetupToken(null);
        populatePaymentMethods();
    });

    const [payments, setPayments] = useState(null as null | PaymentTransaction[]);
    const populatePayments = () => doWork(async () => {
        const result = await props.serverAccess.getPayments();
        setPayments(result);
    });

    const [purchaseAmount, setPurchaseAmount] = useState(100);
    const makePurchase = () => doWork(async () => {
        await props.serverAccess.onMakePurchase(purchaseAmount);
        populatePayments();
    });

    useEffect(() => {
        populatePaymentMethods();
        populatePayments();
    }, []);

    return (
        <>
            <C.Loading loading={loading} />
            <C.ErrorBox error={error} />
            <C.View_Form>
                {paymentMethods && paymentMethods.map(x => (
                    <C.View_FieldRow key={x.key}>
                        <span style={theme.text_fieldLabel}>{x.title}</span>
                        <span style={theme.text_fieldLabel}>Expires: {`${x.expiration.month}`.padStart(2, `0`)}/{x.expiration.year}</span>
                        <button style={theme.button_fieldInline} type='button' onClick={() => deletePaymentMethod(x.key)}>Remove</button>
                    </C.View_FieldRow>
                ))}
                {!setupToken && <div style={theme.div_formActionRow}><button style={theme.button_formAction} type='button' onClick={setupPayment}>Add Payment Method</button></div>}
                {setupToken && <props.comp.PaymentMethodEntryComponent style={style} paymentMethodSetupToken={setupToken} onPaymentMethodReady={onPaymentMethodReady} />}
            </C.View_Form>

            <C.View_Form>
                <C.Text_FormTitle>Make Purchase</C.Text_FormTitle>
                <C.View_FieldRow>
                    <C.Text_FieldLabel>Amount $</C.Text_FieldLabel>
                    <C.Input_Currency value={purchaseAmount} onChange={(value) => setPurchaseAmount(value)} />
                    <input style={theme.input_fieldEntry} type='number' min='0.00' max='10000.00' step='0.01' value={purchaseAmount} onChange={(e) => setPurchaseAmount(Number.parseFloat(e.target.value))} />
                    <button style={theme.button_fieldInline} type='button' onClick={() => makePurchase()}>Purchase</button>
                </C.View_FieldRow>
                {payments && payments.map(x => (
                    <C.View_FieldRow key={`${x.created}`}>
                        <span style={theme.text_fieldLabel}>Created: {formatDate(x.created)}</span>
                        <span style={theme.text_fieldLabel}>${x.amount.usdCents / 100}</span>
                    </C.View_FieldRow>
                ))}
            </C.View_Form>
        </>
    );
};


// export const TestControls = ({ style, onChangeStyle }: { style: PaymentComponentStyle, onChangeStyle: (style: PaymentComponentStyle) => void }) => {
//     const [styleText, setStyleText] = useState(JSON.stringify(style, null, 2));
//     const [error, setError] = useState(null as null | { message: string, error: unknown });

//     const changeStyle = () => {
//         try {
//             if (error) {
//                 setError(null);
//             }

//             const s = JSON.parse(styleText);
//             onChangeStyle(s);
//         } catch (error_) {
//             setError({ message: `style error`, error: error_ });
//         }
//     };

//     return (
//         <div>
//             <div>Test Controls</div>

//             <div>Style</div>
//             <div>
//                 <textarea value={styleText} onChange={(e) => setStyleText(e.target.value)} />
//             </div>
//             <button type='button' onClick={(e) => { e.preventDefault(); changeStyle(); }}>Set Style</button>

//             <pre>
//                 {`
// PaymentComponentStyle = {
//     borderColor?: string;
//     backgroundColor?: string;
//     textColor?: string;
//     textColor_invalid?: string;
//     fontSize?: number;
//     fontFamily?: string;

//     textPadding?: number;
//     elementPadding?: number;
//     buttonAlignment?: 'left' | 'right' | 'center';

//     // Content
//     buttonText?: string;
// }
//                 `}
//             </pre>

//             {error && (
//                 <div style={{ color: `#FFCCCC` }}>
//                     <span>{error.message}</span>
//                     <pre>{JSON.stringify(error.error, null, 2)}</pre>
//                 </div>
//             )}
//         </div>
//     );
// };
