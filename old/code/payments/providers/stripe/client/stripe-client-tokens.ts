import { PaymentMethodCreateParams, SetupIntent } from '@stripe/stripe-js';
import { PaymentProviderSavedPaymentMethodClientSetupToken, PaymentProviderSavedPaymentMethodClientToken } from '../../../common/types';

export type StripeCustomerBillingDetails = PaymentMethodCreateParams.BillingDetails;

export type StripePaymentClientSetupToken = {
    clientSecret: string;
    customerBillingDetails: StripeCustomerBillingDetails;
};

export const stripeEncodeClientSetupToken = (params: StripePaymentClientSetupToken): PaymentProviderSavedPaymentMethodClientSetupToken => {
    return params as unknown as PaymentProviderSavedPaymentMethodClientSetupToken;
};
export const stripeDecodeClientSetupToken = (params: PaymentProviderSavedPaymentMethodClientSetupToken): StripePaymentClientSetupToken => {
    return params as unknown as StripePaymentClientSetupToken;
};

export type StripePaymentClientToken = {
    setupIntent: SetupIntent;
};

export const stripeEncodeClientToken = (params: StripePaymentClientToken): PaymentProviderSavedPaymentMethodClientToken => {
    return params as unknown as PaymentProviderSavedPaymentMethodClientToken;
};
export const stripeDecodeClientToken = (params: PaymentProviderSavedPaymentMethodClientToken): StripePaymentClientToken => {
    return params as unknown as StripePaymentClientToken;
};
