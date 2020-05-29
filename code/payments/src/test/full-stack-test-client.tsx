/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { mainTheme } from 'themes/colors';
import { createJsonRpcClient } from 'json-rpc/json-rpc-client';
import { createPaymentApi_simple } from '../server/create-payment-api';
import { createPaymentClientComponents } from '../client/payment-react';
import { PaymentComponentStyle, PaymentClientComponents } from '../common/types-react';
import { PaymentProviderSavedPaymentMethodClientSetupToken, PaymentProviderName, PaymentApi, PaymentProviderSavedPaymentMethodClientToken, PaymentMethodClientInfo, PaymentMethodStorageKey } from '../common/types';
import { getFullStackTestConfig, FullStackTestConfig } from './full-stack-test-config';

export const PaymentFullStackTesterHost = (props: {}) => {

    const [serverAccess, setServerAccess] = useState(null as null | PaymantViewServerAccess);
    const [config, setConfig] = useState(null as null | FullStackTestConfig);

    useEffect(() => {
        (async () => {
            const c = await getFullStackTestConfig();
            setConfig(c);
            const server = createJsonRpcClient<PaymentApi>({
                serverUrl: c.serverUrl,
                appendMethodNameToUrl: true,
            }, {
                setupSavedPaymentMethod: `setupSavedPaymentMethod`,
                saveSavedPaymentMethod: `saveSavedPaymentMethod`,
                getSavedPaymentMethods: `getSavedPaymentMethods`,
                deleteSavedPaymentMethod: `deleteSavedPaymentMethod`,
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
            <div style={{ padding: 16, background: mainTheme.colors.background, color: mainTheme.colors.text }}>
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
        borderColor: mainTheme.colors.border,
        backgroundColor: mainTheme.colors.background_field,
        textColor: mainTheme.colors.text,
    } as PaymentComponentStyle);

    const [paymentMethods, setPaymentMethods] = useState(null as null | PaymentMethodClientInfo[]);
    const populatePaymentMethods = async () => {
        const result = await props.serverAccess.getPaymentMethods();
        setPaymentMethods(result);
    };
    useEffect(() => {
        (async () => { await populatePaymentMethods(); })();
    }, []);

    const deletePaymentMethod = async (key: PaymentMethodStorageKey) => {
        await props.serverAccess.deletePaymentMethod(key);
        await populatePaymentMethods();
    };

    const [setupToken, setSetupToken] = useState(null as null | PaymentProviderSavedPaymentMethodClientSetupToken);
    const setupPayment = async () => {
        const result = await props.serverAccess.onSetupPayment();
        console.log(`setupPayment`, { result });
        setSetupToken(result);
    };

    const onPaymentMethodReady = async (paymentMethodToken: PaymentProviderSavedPaymentMethodClientToken) => {
        await props.serverAccess.onPaymentMethodReady(paymentMethodToken);
        setSetupToken(null);
        await populatePaymentMethods();
    };

    return (
        <>
            {paymentMethods && paymentMethods.map(x => (
                <div key={x.key} style={mainTheme.div_fieldRow}>
                    <span style={mainTheme.span_fieldInfo}>{x.title}</span>
                    <span style={mainTheme.span_fieldInfo}>Expires: {`${x.expiration.month}`.padStart(2, `0`)}/{x.expiration.year}</span>
                    <button style={mainTheme.button_fieldInline} type='button' onClick={() => deletePaymentMethod(x.key)}>Remove</button>
                </div>
            ))}
            {!setupToken && <div style={mainTheme.div_formActionRow}><button style={mainTheme.button_formAction} type='button' onClick={setupPayment}>Add Payment Method</button></div>}
            {setupToken && <props.comp.PaymentMethodEntryComponent style={style} paymentMethodSetupToken={setupToken} onPaymentMethodReady={onPaymentMethodReady} />}
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
