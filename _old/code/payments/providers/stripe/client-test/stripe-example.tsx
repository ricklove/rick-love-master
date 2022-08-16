/* eslint-disable no-console */
import React, { useState } from 'react';
import { theme } from 'themes/theme';
import { PaymentComponentStyle } from '../../../common/types-react';
import { createPaymentClientComponents_stripe } from '../client/stripe-payment-react';
import { stripeEncodeClientSetupToken } from '../client/stripe-client-tokens';

export const StripeExamplePage = (props: {}) => {
    const comp = createPaymentClientComponents_stripe({ stripePublicKey: `spkey_12345` });
    const setupToken = stripeEncodeClientSetupToken({ clientSecret: `I like pizza`, customerBillingDetails: { phone: `987-555-1234` } });
    const AppWrapperComponent = comp.AppWrapperComponent ?? (({ children }) => (<>{children}</>));
    const [style, setStyle] = useState({
        textPadding: 4,
        elementPadding: 4,
        buttonAlignment: `right`,
        borderRadius: 4,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background_field,
        textColor: theme.colors.text,
    } as PaymentComponentStyle);

    return (
        <AppWrapperComponent>
            <div style={{ padding: 16, background: theme.colors.background, color: theme.colors.text }}>
                <div>Page and Stuff...</div>
                <hr />
                <div>Show me the Money!</div>
                <div> <comp.PaymentMethodEntryComponent style={style} paymentMethodSetupToken={setupToken} onPaymentMethodReady={(params) => { console.log(`onPaymentMethodReady`, params); }} /> </div>
            </div>
            <TestControls key='STATIC' style={style} onChangeStyle={setStyle} />
        </AppWrapperComponent>
    );
};


export const TestControls = ({ style, onChangeStyle }: { style: PaymentComponentStyle, onChangeStyle: (style: PaymentComponentStyle) => void }) => {
    const [styleText, setStyleText] = useState(JSON.stringify(style, null, 2));
    const [error, setError] = useState(null as null | { message: string, error: unknown });

    const changeStyle = () => {
        try {
            if (error) {
                setError(null);
            }

            const s = JSON.parse(styleText);
            onChangeStyle(s);
        } catch (error_) {
            setError({ message: `style error`, error: error_ });
        }
    };

    return (
        <div>
            <div>Test Controls</div>

            <div>Style</div>
            <div>
                <textarea value={styleText} onChange={(e) => setStyleText(e.target.value)} />
            </div>
            <button type='button' onClick={(e) => { e.preventDefault(); changeStyle(); }}>Set Style</button>

            <pre>
                {`
PaymentComponentStyle = {
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    textColor_invalid?: string;
    fontSize?: number;
    fontFamily?: string;

    textPadding?: number;
    elementPadding?: number;
    buttonAlignment?: 'left' | 'right' | 'center';

    // Content
    buttonText?: string;
}
                `}
            </pre>

            {error && (
                <div style={{ color: `#FFCCCC` }}>
                    <span>{error.message}</span>
                    <pre>{JSON.stringify(error.error, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};
