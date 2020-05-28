import { ReactNode } from 'react';
import { PaymentProviderSavedPaymentMethodClientSetupToken, PaymentProviderSavedPaymentMethodClientToken } from './types';

export type PaymentComponentStyle = {
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
};

export type PaymentClientComponents = {
    AppWrapperComponent?: (props: { children: ReactNode }) => JSX.Element;
    PaymentMethodEntryComponent: (props: {
        style: PaymentComponentStyle;
        paymentMethodSetupToken: PaymentProviderSavedPaymentMethodClientSetupToken;
        onPaymentMethodReady: (paymentMethodClientToken: PaymentProviderSavedPaymentMethodClientToken) => void;
    }) => JSX.Element;
};
