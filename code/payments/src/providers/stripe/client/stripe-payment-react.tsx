import React from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, PaymentMethod, PaymentMethodCreateParams } from '@stripe/stripe-js';
import { PaymentClientComponents } from '../../../types-react';
import { PaymentError } from '../../../types';
import { stripeDecodeClientSetupToken, stripeEncodeClientToken } from './stripe-client-tokens';

export const createPaymentClientComponents_stripe = (params: { stripePublicKey: string }): PaymentClientComponents => {

    const stripePromise = loadStripe(params.stripePublicKey);

    const components: PaymentClientComponents = {
        AppWrapperComponent: ({ children }) => (<Elements stripe={stripePromise}>{children}</Elements>),
        PaymentMethodEntryComponent: ({ style, paymentMethodSetupToken, onPaymentMethodReady }) => {
            const stripe = useStripe();
            const elements = useElements();

            const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                if (!stripe || !elements) { return; }

                const setupInfo = stripeDecodeClientSetupToken(paymentMethodSetupToken);

                const result = await stripe.confirmCardSetup(setupInfo.clientSecret, {
                    payment_method: {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        card: elements.getElement(CardElement)!,
                        billing_details: setupInfo.customerBillingDetails,
                    },
                });

                if (result.error || !result.setupIntent) {
                    throw new PaymentError(`Stripe Payment Error`);
                }

                onPaymentMethodReady(stripeEncodeClientToken({ setupIntent: result.setupIntent }));
            };

            const s = style;
            const inputStyle = {
                base: {
                    color: s.textColor,
                    fontSize: `${s.fontSize}px`,
                    fontFamily: s.fontFamily,
                    fontSmoothing: `antialiased`,
                    "::placeholder": {
                        color: s.textColor,
                        opacity: 0.8,
                    },
                },
                invalid: {
                    color: s.textColor_invalid,
                    iconColor: s.textColor_invalid,
                },
            };
            const buttonStyle = {
                color: s.textColor,
                fontSize: `${s.fontSize}px`,
                fontFamily: s.fontFamily,
                fontSmoothing: `antialiased`,
                padding: s.textPadding,
                margin: s.elementPadding,
            };
            const buttonJustifyContent = s.buttonAlignment === `left` ? `flex-start`
                : (s.buttonAlignment === `right` ? `flex-end`
                    : `center`);

            return (
                <form onSubmit={handleSubmit}>
                    <div style={{ padding: s.textPadding, borderWidth: 1, borderStyle: `solid`, borderColor: s.borderColor, margin: s.elementPadding }}>
                        <CardElement options={{ style: inputStyle }} />
                    </div>
                    <div style={{ display: `flex`, flexDirection: `row`, justifyContent: buttonJustifyContent }}>
                        <button type='submit' disabled={!stripe || !elements} style={buttonStyle}>{s.buttonText ?? `Subscribe`}</button>
                    </div>
                </form>
            );
        },
    };

    return components;
};
