/* eslint-disable no-console */
import React from 'react';
import { createPaymentClientComponents_stripe } from '../client/stripe-payment-react';
import { stripeEncodeClientSetupToken } from '../client/stripe-client-tokens';

export const StripeExamplePage = (props: {}) => {
    const comp = createPaymentClientComponents_stripe({ stripePublicKey: `spkey_12345` });
    const setupToken = stripeEncodeClientSetupToken({ clientSecret: `I like pizza`, customerBillingDetails: { phone: `987-555-1234` } });
    const AppWrapperComponent = comp.AppWrapperComponent ?? (({ children }) => (<>{children}</>));
    return (
        <AppWrapperComponent>
            <div>
                <div>Page and Stuff</div>
                <div> <comp.PaymentMethodEntryComponent style={{}} paymentMethodSetupToken={setupToken} onPaymentMethodReady={(params) => { console.log(`onPaymentMethodReady`, params); }} /> </div>
            </div>
        </AppWrapperComponent>
    );
};
