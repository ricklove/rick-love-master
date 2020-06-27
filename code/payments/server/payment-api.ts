import { PaymentClientApi, PaymentProviderApi, PaymentStorageProviderApi, PaymentError, PaymentServerApi, PaymentMethodClientInfo } from '../common/types';
import { wrapProcessStep_CreateSavedPaymentMethod, ProcessSteps_CreateSavedPaymentMethod } from '../common/process-steps';

export const createPaymentApi_inner_underUserContext = (dependencies: { providers: PaymentProviderApi[], storage: PaymentStorageProviderApi }): {
    paymentClientApi: PaymentClientApi;
    paymentServerApi: PaymentServerApi;
} => {

    const getProvider = (providerName: string) => {
        const provider = dependencies.providers.find(x => x.providerName === providerName);
        if (!provider) { throw new PaymentError(`Provider not found: ${providerName}`, { providerName, paymentProviders: dependencies.providers.map(x => x.providerName) }); }
        return provider;
    };

    const paymentServerApi: PaymentServerApi = {
        chargeUsingSavedPaymentMethods: async ({ amount }) => {
            const stored = await dependencies.storage.getSavedPaymentMethods();
            const errors = [] as { error: unknown, paymentMethod: PaymentMethodClientInfo }[];

            for (const x of stored) {
                // Attempt to make payment
                const { key, providerName, title, expiration } = x;
                const provider = getProvider(providerName);

                // eslint-disable-next-line no-await-in-loop
                const userToken = await dependencies.storage.getUserToken({ providerName });
                if (!userToken) {
                    throw new PaymentError(`saveSavedPaymentMethod: User Token was not found`, { providerName });
                }

                try {
                    // eslint-disable-next-line no-await-in-loop
                    await provider.chargeSavedPaymentMethod(userToken.userToken, x.paymentMethodStorageToken, amount);
                    return;
                } catch (error) {
                    errors.push({ error, paymentMethod: { key, providerName, title, expiration } });
                    console.log(`PaymentMethod failed, try next`, { error });
                }
            }

            // No method succeeded
            throw new PaymentError(`All Payment Methods Failed`, { errors });
        },
    };

    const paymentClientApi: PaymentClientApi = {
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
        saveSavedPaymentMethod: async ({ providerName, paymentMethodClientToken }) => {
            const paymentMethodData = await wrapProcessStep_CreateSavedPaymentMethod(
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
                        title: paymentMethodData.title,
                        expiration: paymentMethodData.expiration,
                        paymentMethodStorageToken: paymentMethodData.token,
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
                    expiration: x.expiration,
                    extra: `ok`,
                }));
        },
        deleteSavedPaymentMethod: async ({ key }) => {
            await dependencies.storage.deleteSavedPaymentMethod({ key });
        },

        debug_triggerPayment: async (params) => {
            await paymentServerApi.chargeUsingSavedPaymentMethods(params);
        },
        getPayments: async () => {

            const allPayments = (await Promise.all(dependencies.providers.map(async (x) => {
                const userToken = await dependencies.storage.getUserToken({ providerName: x.providerName });
                if (!userToken) {
                    // throw new PaymentError(`getPayments: User Token was not found`, { providerName });
                    return null;
                };
                return await x.getPayments(userToken.userToken);
            })))
                .flatMap(x => x ?? []);

            // Reverse sort by date
            const sorted = allPayments
                .sort((a, b) => -(a.created.getTime() - b.created.getTime()));

            return sorted;
        },

    };
    return { paymentClientApi, paymentServerApi };
};
