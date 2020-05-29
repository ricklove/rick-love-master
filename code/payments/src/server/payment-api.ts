import { PaymentApi, PaymentProviderApi, PaymentStorageProviderApi, PaymentError } from '../common/types';
import { wrapProcessStep_CreateSavedPaymentMethod, ProcessSteps_CreateSavedPaymentMethod } from '../common/process-steps';

export const createPaymentApi = (dependencies: { paymentProviders: PaymentProviderApi[], storageProvider: PaymentStorageProviderApi }): PaymentApi => {

    const getProvider = (providerName: string) => {
        const provider = dependencies.paymentProviders.find(x => x.providerName === providerName);
        if (!provider) { throw new PaymentError(`Provider not found: ${providerName}`, { providerName, paymentProviders: dependencies.paymentProviders.map(x => x.providerName) }); }
        return provider;
    };

    const paymentApi: PaymentApi = {
        setupSavedPaymentMethod: async ({ providerName }) => {
            const setupToken = await wrapProcessStep_CreateSavedPaymentMethod(
                ProcessSteps_CreateSavedPaymentMethod._02_Server_SetupSavedPaymentMethod,
                async () => {
                    const userToken = await dependencies.storageProvider.getUserToken({ providerName });
                    const setup = await getProvider(providerName).setupSavedPaymentMethod(userToken?.userToken ?? null);
                    if (setup.newUserToken) {
                        await dependencies.storageProvider.setUserToken({ providerName, userToken: setup.newUserToken });
                    }
                    return setup.setupToken;
                });
            return setupToken;
        },
        saveSavedPaymentMethod: async ({ providerName, title, paymentMethodClientToken }) => {
            const paymentMethodStorageToken = await wrapProcessStep_CreateSavedPaymentMethod(
                ProcessSteps_CreateSavedPaymentMethod._04_Server_ObtainPaymentMethod,
                async () => {
                    const userToken = await dependencies.storageProvider.getUserToken({ providerName });
                    if (!userToken) {
                        throw new PaymentError(`saveSavedPaymentMethod: User Token was not found`, { providerName });
                    }
                    return await getProvider(providerName).obtainSavedPaymentMethod(userToken.userToken, paymentMethodClientToken);
                });

            await wrapProcessStep_CreateSavedPaymentMethod(
                ProcessSteps_CreateSavedPaymentMethod._05_Server_SavePaymentMethod,
                async () => {
                    await dependencies.storageProvider.savePaymentMethod({
                        providerName,
                        title,
                        paymentMethodStorageToken,
                    });
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
