import { PaymentStorageProviderApi, PaymentProviderApi, PaymentUserTokenData, PaymentMethodStorageData, PaymentMethodStorageKey } from '../common/types';
import { createStripePaymentProviderApi, StripePaymentProviderConfig, StripePaymentProviderStorage } from '../providers/stripe/server/stripe-payment-provider';
import { StripeCustomerBillingDetails } from '../providers/stripe/client/stripe-client-tokens';
import { createPaymentApi_inner_underUserContext } from './payment-api';

const createPaymentApi_underUserContext_combineProviders = (dependencies: {
    storage: PaymentStorageProviderApi;
    stripe?: {
        config: StripePaymentProviderConfig;
        storage: StripePaymentProviderStorage;
    };
    paypal?: {
        // config: PaypalPaymentProviderConfig;
        // storage: PaypalPaymentProviderStorage;
    };
}) => {
    const { storage, stripe, paypal } = dependencies;

    const providers = [] as PaymentProviderApi[];

    if (stripe) {
        providers.push(createStripePaymentProviderApi(stripe));
    }
    if (paypal) {
        // providers.push(createPaypalPaymentProviderApi(paypal));
    }

    const paymentApi = createPaymentApi_inner_underUserContext({
        providers,
        storage,
    });

    return paymentApi;
};

const createPaymentApi_underUserContext = (dependencies: {
    getStripeSecretKey: () => string;
    getUserBillingDetails: () => Promise<StripeCustomerBillingDetails>;
    getUserKeyValueStorage: () => Promise<{
        getValue: (key: string) => Promise<string | null>;
        setValue: (key: string, value: string) => Promise<void>;
    }>;
}) => {
    const { getUserKeyValueStorage } = dependencies;
    const getValue = async<T>(key: string) => {
        const value = await (await getUserKeyValueStorage()).getValue(key);
        if (!value) { return null; }
        return JSON.parse(value) as T;
    };
    const setValue = async <T>(key: string, value: T) => {
        const valueJson = JSON.stringify(value);
        await (await getUserKeyValueStorage()).setValue(key, valueJson);
    };

    // This is self-storage, so it can operate independently
    const storage: PaymentStorageProviderApi = {
        getUserToken: async ({ providerName }) => await getValue<PaymentUserTokenData>(`Payment:userToken_${providerName}`),
        setUserToken: async (data) => await setValue<PaymentUserTokenData>(`Payment:userToken_${data.providerName}`, data),
        getSavedPaymentMethods: async () => await getValue<PaymentMethodStorageData[]>(`Payment:savedPaymentMethods`) ?? [],
        savePaymentMethod: async (data) => {
            const items = await storage.getSavedPaymentMethods();
            const ids = items.map(x => Number.parseInt(x.key, 10));
            const maxId = ids.length <= 0 ? 100 : Math.max(...ids);
            const nextId = maxId + 1;
            items.push({ ...data, key: (`${nextId}`) as PaymentMethodStorageKey });
            await setValue<PaymentMethodStorageData[]>(`Payment:savedPaymentMethods`, items);
        },
        deleteSavedPaymentMethod: async (data) => {
            const items = await storage.getSavedPaymentMethods();
            const newItems = items.filter(x => x.key !== data.key);
            await setValue<PaymentMethodStorageData[]>(`Payment:savedPaymentMethods`, newItems);
        },
    };

    return createPaymentApi_underUserContext_combineProviders({
        storage,
        stripe: {
            config: { getStripeSecretKey: dependencies.getStripeSecretKey },
            storage: { getUserBillingDetails: dependencies.getUserBillingDetails },
        },
    });
};

export const createPaymentApi = createPaymentApi_underUserContext;
export type CreatePaymentApiDependencies = Parameters<typeof createPaymentApi>[0];

// export const createPaymentApiFactory = (dependencies: {
//     getStripeSecretKey: () => string;
// }) => (userContextDependencies: {
//     getUserContext: () => Promise<{
//         getUserBillingDetails: () => Promise<StripeCustomerBillingDetails>;
//         getUserKeyValueStorage: () => Promise<{
//             getValue: (key: string) => Promise<string | null>;
//             setValue: (key: string, value: string) => Promise<void>;
//         }>;
//     }>;
// }) => {
//         return createPaymentApi_underUserContext({
//             getStripeSecretKey: dependencies.getStripeSecretKey,
//             getUserBillingDetails: async () => await (await userContextDependencies.getUserContext()).getUserBillingDetails(),
//             getUserKeyValueStorage: async () => await (await userContextDependencies.getUserContext()).getUserKeyValueStorage(),
//         });
//     };
