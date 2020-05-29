import { PaymentStorageProviderApi, PaymentProviderApi, PaymentUserTokenData, PaymentMethodStorageData, PaymentMethodStorageKey } from '../common/types';
import { createStripePaymentProviderApi, StripePaymentProviderConfig, StripePaymentProviderStorage } from '../providers/stripe/server/stripe-payment-provider';
import { StripeCustomerBillingDetails } from '../providers/stripe/client/stripe-client-tokens';
import { createPaymentApi_inner } from './payment-api';

export const createPaymentApi = (dependencies: {
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

    const paymentApi = createPaymentApi_inner({
        providers,
        storage,
    });

    return paymentApi;
};

export const createPaymentApi_simple = (dependencies: {
    getStripeSecretKey: () => string;
    getUserBillingDetails: () => StripeCustomerBillingDetails;
    userKeyValueStorage: {
        getValue: (key: string) => Promise<string>;
        setValue: (key: string, value: string) => Promise<void>;
    };
}) => {
    const { userKeyValueStorage } = dependencies;
    const getValue = async<T>(key: string) => {
        const value = await userKeyValueStorage.getValue(key);
        if (!value) { return null; }
        return JSON.parse(value) as T;
    };
    const setValue = async <T>(key: string, value: T) => {
        const valueJson = JSON.stringify(value);
        await userKeyValueStorage.setValue(key, valueJson);
    };

    // This is self-storage, so it can operate independently
    const storage: PaymentStorageProviderApi = {
        getUserToken: async ({ providerName }) => await getValue<PaymentUserTokenData>(`Payment:userToken_${providerName}`),
        setUserToken: async (data) => await setValue<PaymentUserTokenData>(`Payment:userToken_${data.providerName}`, data),
        getSavedPaymentMethods: async () => await getValue<PaymentMethodStorageData[]>(`Payment:savedPaymentMethods`) ?? [],
        savePaymentMethod: async (data) => {
            const items = await storage.getSavedPaymentMethods();
            const ids = items.map(x => parseInt(x.key));
            const nextId = Math.max(...ids) + 1;
            items.push({ ...data, key: ('' + nextId) as PaymentMethodStorageKey });
            await setValue<PaymentMethodStorageData[]>(`Payment:savedPaymentMethods`, items);
        },
        deleteSavedPaymentMethod: async (data) => {
            const items = await storage.getSavedPaymentMethods();
            const newItems = items.filter(x => x.key !== data.key);
            await setValue<PaymentMethodStorageData[]>(`Payment:savedPaymentMethods`, newItems);
        },
    };

    return createPaymentApi({
        storage: ,
    });
};
