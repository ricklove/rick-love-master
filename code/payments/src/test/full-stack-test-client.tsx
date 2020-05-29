/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { mainTheme } from 'themes/colors';
import { createJsonRpcClient } from 'json-rpc/json-rpc-client';
import { createPaymentApi_simple } from '../server/create-payment-api';
import { createPaymentClientComponents } from '../client/payment-react';
import { PaymentComponentStyle, PaymentClientComponents } from '../common/types-react';
import { PaymentProviderSavedPaymentMethodClientSetupToken, PaymentProviderName } from '../common/types';
import { getFullStackTestConfig } from './full-stack-test-config';

export const PaymentFullStackTesterHost = (props: {}) => {

    const [configState, setConfigState] = useState(null as null | FullStackConfig);
    // const [stripePublicKey, setStripePublicKey] = useState(``);
    // const [stripeSecretKey, setStripeSecretKey] = useState(``);

    // const saveConfig = () => {

    //     // localStorage.stripePublicKey = stripePublicKey;
    //     // localStorage.stripeSecretKey = stripeSecretKey;
    //     setConfigState({
    //         stripePublicKey,
    //         //  stripeSecretKey,
    //     });
    // };

    useEffect(() => {
        (async () => {
            const config = await getFullStackTestConfig();

            const server = createJsonRpcClient(props.config.serverUrl, {});
            const serverAccess: PaymantViewServerAccess = {
                onSetupPayment: async () => {
                    console.log(`onSetupPayment`);
                    return server.setupSavedPaymentMethod({ providerName });
                },
            };
        })();
    }, []);

    return (
        <div>
            <div>
                <div>Loading Config...</div>
                {/* <span >Stripe Public Key</span>
                <input type='text' value={stripePublicKey} onChange={(e) => setStripePublicKey(e.target.value)} /> */}
                {/* <span >Stripe Secret Key</span>
                <input type='text' value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} /> */}
                {/* <button type='button' onClick={saveConfig}>Save</button> */}
            </div>
            {configState && <PaymentFullStackTester config={configState} />}
        </div>
    );
};

export const PaymentFullStackTester = (props: { serverAccess: FullStackServerAccess }) => {

    const comp = createPaymentClientComponents({ stripePublicKey: props.config.stripePublicKey });
    const storage = {
        state: {} as { [key: string]: string },
        getValue: async (key: string) => storage.state[key],
        setValue: async (key: string, value: string) => { storage.state[key] = value; },
    };
    // const server = createPaymentApi_simple({
    //     getStripeSecretKey: () => props.state.stripeSecretKey,
    //     getUserBillingDetails: async () => ({ phone: `555-867-5309` }),
    //     userKeyValueStorage: storage,
    // });
    const AppWrapperComponent = comp.AppWrapperComponent ?? (({ children }) => (<>{children}</>));

    const providerName = `stripe` as PaymentProviderName;

    return (
        <AppWrapperComponent>
            <div style={{ padding: 16, background: mainTheme.colors.background, color: mainTheme.colors.text }}>
                <div>Page and Stuff...</div>
                <hr />
                <div>Show me the Money!</div>
                <div >
                    <PaymantView comp={comp} serverAccess={serverAccess} />
                </div>
            </div>
            {/* <TestControls /> */}
        </AppWrapperComponent>
    );
};

type PaymantViewServerAccess = {
    onSetupPayment: () => Promise<PaymentProviderSavedPaymentMethodClientSetupToken>;
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

    const [setupToken, setSetupToken] = useState(null as null | PaymentProviderSavedPaymentMethodClientSetupToken);
    const setupPayment = async () => {
        const result = await props.serverAccess.onSetupPayment();
        setSetupToken(result);
    };

    return (
        <>
            {!setupToken && <button type='button' onClick={setupPayment}>Add Payment Method</button>}
            {setupToken && <props.comp.PaymentMethodEntryComponent style={style} paymentMethodSetupToken={setupToken} onPaymentMethodReady={(params) => { console.log(`onPaymentMethodReady`, params); }} />}
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
