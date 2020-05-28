import { PaymentApi, PaymentProviderApi } from '../types';

export const createPaymentApi = (dependencies: { paymentProvider: PaymentProviderApi }): PaymentApi => {

    const setupSavedPaymentMethod = async () => dependencies.paymentProvider.setupSavePaymentMethod();

    const paymentApi: PaymentApi = {
    };
    return paymentApi;
};
