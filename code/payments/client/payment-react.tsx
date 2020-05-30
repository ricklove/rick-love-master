import React from 'react';
import { PaymentClientComponents } from '../common/types-react';
import { createPaymentClientComponents_stripe } from '../providers/stripe/client/stripe-payment-react';

export const createPaymentClientComponents = (params: { stripePublicKey: string }): PaymentClientComponents => {

    const compStripe = createPaymentClientComponents_stripe(params);

    const components: PaymentClientComponents = {
        AppWrapperComponent: ({ children }) => {
            if (!compStripe.AppWrapperComponent) { return (<>{children}</>); }
            return (<compStripe.AppWrapperComponent>{children}</compStripe.AppWrapperComponent>);
        },
        PaymentMethodEntryComponent: (props) => {
            return (
                <compStripe.PaymentMethodEntryComponent {...props} />
            );
        },
    };

    return components;
};
