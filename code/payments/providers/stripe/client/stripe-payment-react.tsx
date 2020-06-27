import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, PaymentMethod, PaymentMethodCreateParams } from '@stripe/stripe-js';
import { PaymentClientComponents } from '../../../common/types-react';
import { PaymentError } from '../../../common/types';
import { stripeDecodeClientSetupToken, stripeEncodeClientToken } from './stripe-client-tokens';
import { wrapProcessStep_CreateSavedPaymentMethod_Stripe, ProcessSteps_CreateSavedPaymentMethod_Stripe } from '../common/stripe-process-steps';

export const createPaymentClientComponents_stripe = (params: { stripePublicKey: string }): PaymentClientComponents => {

    const stripePromise = loadStripe(params.stripePublicKey);

    const components: PaymentClientComponents = {
        AppWrapperComponent: ({ children }) => (<Elements stripe={stripePromise}>{children}</Elements>),
        PaymentMethodEntryComponent: ({ style, paymentMethodSetupToken, onPaymentMethodReady }) => {
            const stripe = useStripe();
            const elements = useElements();

            const [stripeError, setStripeError] = useState(null as null | { message: string, error: unknown });

            const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                if (!stripe || !elements) { return; }

                try {
                    // Completed SetupIntent -> Used to get PaymentMethod
                    const setupIntent = await wrapProcessStep_CreateSavedPaymentMethod_Stripe(
                        ProcessSteps_CreateSavedPaymentMethod_Stripe._03A_Client_CollectPaymentDetails,
                        async () => {

                            const setupInfo = stripeDecodeClientSetupToken(paymentMethodSetupToken);

                            const result = await stripe.confirmCardSetup(setupInfo.clientSecret, {
                                payment_method: {
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    card: elements.getElement(CardElement)!,
                                    billing_details: setupInfo.customerBillingDetails,
                                },
                            });

                            if (result.error || !result.setupIntent) {
                                throw new PaymentError(`Stripe Payment Error`, result.error);
                            }

                            return result.setupIntent;
                        });
                    if (!setupIntent) { return; }

                    onPaymentMethodReady(stripeEncodeClientToken({ setupIntent }));
                } catch (error) {
                    setStripeError({ message: `Stripe Payment Error`, error });
                }
            };

            const s = style;
            const inputStyle = {
                base: {
                    color: s.textColor,
                    fontSize: s.fontSize ? `${s.fontSize}px` : ``,
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
            const inputContainerStyle = {
                marginBottom: s.elementPadding,
                padding: s.textPadding,
                backgroundColor: s.backgroundColor,
                borderWidth: 1, borderStyle: `solid`, borderColor: s.borderColor, borderRadius: s.borderRadius,
            };
            const buttonStyle = {
                color: s.textColor,
                backgroundColor: s.backgroundColor,
                borderWidth: 1, borderStyle: `solid`, borderColor: s.borderColor, borderRadius: s.borderRadius,

                fontSize: s.fontSize ? `${s.fontSize}px` : ``,
                fontFamily: s.fontFamily,
                fontSmoothing: `antialiased`,
                fontWeight: `bold`,
                padding: s.textPadding,
                marginBottom: s.elementPadding,
            } as const;
            const buttonJustifyContent = s.buttonAlignment === `left` ? `flex-start`
                : (s.buttonAlignment === `right` ? `flex-end`
                    : `center`);

            const errorContainerStyle = {
                marginBottom: s.elementPadding,
                padding: s.textPadding,
                backgroundColor: s.backgroundColor,
                borderWidth: 1, borderStyle: `solid`, borderColor: s.borderColor, borderRadius: s.borderRadius,
            };
            const errorMessageStyle = {
                color: s.textColor_invalid,

                fontSize: s.fontSize ? `${s.fontSize}px` : ``,
                fontFamily: s.fontFamily,
                fontSmoothing: `antialiased`,
                fontWeight: `bold`,
                padding: s.textPadding,
                marginBottom: s.elementPadding,
            } as const;

            return (
                <form onSubmit={handleSubmit}>
                    <div style={inputContainerStyle}>
                        <CardElement options={{ style: inputStyle }} />
                    </div>
                    {stripeError && (
                        <>
                            <div style={errorContainerStyle}>
                                <span style={errorMessageStyle}>{stripeError.message}</span>
                            </div>
                        </>
                    )}

                    {!stripeError && (
                        <div style={{ display: `flex`, flexDirection: `row`, justifyContent: buttonJustifyContent }}>
                            <button type='submit' disabled={!stripe || !elements} style={buttonStyle}>{s.buttonText ?? `Subscribe`}</button>
                        </div>
                    )}
                </form>
            );
        },
    };

    return components;
};
