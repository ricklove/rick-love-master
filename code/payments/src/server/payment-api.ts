import { PaymentApi, PaymentProviderApi, PaymentStorageProviderApi, PaymentError } from '../common/types';
import { wrapProcessStep_CreateSavedPaymentMethod, ProcessSteps_CreateSavedPaymentMethod } from '../common/process-steps';

export const createPaymentApi_inner = (dependencies: { providers: PaymentProviderApi[], storage: PaymentStorageProviderApi }): PaymentApi => {

    const getProvider = (providerName: string) => {
        const provider = dependencies.providers.find(x => x.providerName === providerName);
        if (!provider) { throw new PaymentError(`Provider not found: ${providerName}`, { providerName, paymentProviders: dependencies.providers.map(x => x.providerName) }); }
        return provider;
    };

    const paymentApi: PaymentApi = {
        setupSavedPaymentMethod: async ({ providerName }) => {
            const setupToken = await wrapProcessStep_CreateSavedPaymentMethod(
                ProcessSteps_CreateSavedPaymentMethod._02_Server_SetupSavedPaymentMethod,
                async () => {
                    const userToken = await dependencies.storage.getUserToken({ providerName });
                    const setup = await getProvider(providerName).setupSavedPaymentMethod(userToken?.userToken ?? null);
                    if (setup.newUserToken) {
                        await dependencies.storage.setUserToken({ providerName, userToken: setup.newUserToken });
                    }
                    return setup.setupToken;
                });
            return setupToken;
        },
        saveSavedPaymentMethod: async ({ providerName, title, paymentMethodClientToken }) => {
            const paymentMethodStorageToken = await wrapProcessStep_CreateSavedPaymentMethod(
                ProcessSteps_CreateSavedPaymentMethod._04_Server_ObtainPaymentMethod,
                async () => {
                    const userToken = await dependencies.storage.getUserToken({ providerName });
                    if (!userToken) {
                        throw new PaymentError(`saveSavedPaymentMethod: User Token was not found`, { providerName });
                    }
                    return await getProvider(providerName).obtainSavedPaymentMethod(userToken.userToken, paymentMethodClientToken);
                });

            await wrapProcessStep_CreateSavedPaymentMethod(
                ProcessSteps_CreateSavedPaymentMethod._05_Server_SavePaymentMethod,
                async () => {
                    await dependencies.storage.savePaymentMethod({
                        providerName,
                        title,
                        paymentMethodStorageToken,
                    });
                });
        },
        getSavedPaymentMethods: async () => {
            const stored = await dependencies.storage.getSavedPaymentMethods();
            return stored
                .map(x => ({
                    key: x.key,
                    providerName: x.providerName,
                    title: x.title,
                    extra: `ok`,
                }));
        },
        deleteSavedPaymentMethod: async ({ key }) => {
            await dependencies.storage.deleteSavedPaymentMethod({ key });
        },

    };
    return paymentApi;
};
