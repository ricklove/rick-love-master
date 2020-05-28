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
            // const buttonStyle = {
            //     margin: s.button.view.margin,
            //     padding: s.button.view.padding,
            //     minWidth: s.button.view.minWidth,
            //     color: s.button.text.color,
            //     backgroundColor: s.button.view.backgroundColor,

            //     borderWidth: s.button.view.borderWidth ?? 0,
            //     borderColor: s.button.view.borderColor,
            //     borderRadius: s.button.view.borderRadius,

            //     flexGrow: s.button.view.flexGrow,
            //     fontFamily: s.button.text.fontFamily,
            //     fontSize: s.button.text.fontSize,
            //     fontWeight: s.button.text.fontWeight,
            //     textAlign: s.button.text.textAlign,
            // };
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
                    color: `#fa755a`,
                    iconColor: `#fa755a`,
                },
            };

            return (
                <form onSubmit={handleSubmit}>
                    <div style={{ ...s.input.view, ...{ padding: s.input.text.padding } }}>
                        <CardElement options={{ style: inputStyle }} />
                    </div>
                    <div style={{ display: `flex`, marginTop: 8 }}>
                        <button type='submit' disabled={!stripe || !elements} style={buttonStyle}>{props.text}</button>
                    </div>
                </form>
            );
        },
    };

    return components;
};
