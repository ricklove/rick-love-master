import { PaymentApi, PaymentProviderApi, PaymentStorageProviderApi, PaymentError } from '../types';

export const createPaymentApi = (dependencies: { paymentProviders: PaymentProviderApi[], storageProvider: PaymentStorageProviderApi }): PaymentApi => {

    const getProvider = (providerName: string) => {
        const provider = dependencies.paymentProviders.find(x => x.providerName === providerName);
        if (!provider) { throw new PaymentError(`Provider not found: ${providerName}`, { providerName, paymentProviders: dependencies.paymentProviders.map(x => x.providerName) }); }
        return provider;
    };

    const paymentApi: PaymentApi = {
        setupSavedPaymentMethod: async ({ providerName }) => {
            return await getProvider(providerName).setupSavePaymentMethod();
        },
        saveSavedPaymentMethod: async ({ providerName, title, paymentMethodClientToken }) => {
            const paymentMethodStorageToken = await getProvider(providerName).obtainSavedPaymentMethod(paymentMethodClientToken);
            await dependencies.storageProvider.savePaymentMethod({
                providerName,
                title,
                paymentMethodStorageToken,
            });
        },
        getSavedPaymentMethods: async () => {
            const stored = await dependencies.storageProvider.getSavedPaymentMethods();
            return stored
                .map(x => ({
                    key: x.key,
                    providerName: x.providerName,
                    title: x.title,
                    extra: `ok`,
                }));
        },
        deleteSavedPaymentMethod: async ({ key }) => {
            await dependencies.storageProvider.deleteSavedPaymentMethod({ key });
        },

    };
    return paymentApi;
};
