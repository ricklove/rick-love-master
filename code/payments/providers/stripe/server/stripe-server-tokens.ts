import { PaymentProviderUserToken, PaymentProviderSavedPaymentMethodStorageToken } from '../../../common/types';

export type StripeUserToken = {
    customerId: string;
};

export const stripeEncodeUserToken = (params: StripeUserToken): PaymentProviderUserToken => {
    return params as unknown as PaymentProviderUserToken;
};
export const stripeDecodeUserToken = (params: PaymentProviderUserToken): StripeUserToken => {
    return params as unknown as StripeUserToken;
};


export type StripePaymentStorageToken = {
    paymentMethod: string;
};

export const stripeEncodeStorageToken = (params: StripePaymentStorageToken): PaymentProviderSavedPaymentMethodStorageToken => {
    return params as unknown as PaymentProviderSavedPaymentMethodStorageToken;
};
export const stripeDecodeStorageToken = (params: PaymentProviderSavedPaymentMethodStorageToken): StripePaymentStorageToken => {
    return params as unknown as StripePaymentStorageToken;
};
