import { ReactNode } from 'react';
import { PaymentProviderSavedPaymentMethodClientSetupToken, PaymentProviderSavedPaymentMethodClientToken } from './types';

export type PaymentComponentStyle = {
    borderColor: string;
    backgroundColor: string;
    textColor: string;
    textPadding: number;
};

export type PaymentClientComponents = {
    AppWrapperComponent?: (props: { children: ReactNode }) => JSX.Element;
    PaymentMethodEntryComponent: (props: {
        style: PaymentComponentStyle;
        paymentMethodSetupToken: PaymentProviderSavedPaymentMethodClientSetupToken;
        onPaymentMethodReady: (paymentMethodClientToken: PaymentProviderSavedPaymentMethodClientToken) => void;
    }) => JSX.Element;
};
