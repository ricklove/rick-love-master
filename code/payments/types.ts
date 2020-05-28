
/** This token is used to identify the client as it negotiates directly with the provider to enter payment method data */
export type PaymentProviderSavedPaymentMethodClientSetupToken = unknown & { __type: 'PaymentProviderSavedPaymentMethodClientSetupToken' };
/** This token is used to identify the payment method obtained on the client from the provider */
export type PaymentProviderSavedPaymentMethodClientToken = unknown & { __type: 'PaymentProviderSavedPaymentMethodClientToken' };
/** This token is used to identify the payment method long term after being verified by the provider on the server */
export type PaymentProviderSavedPaymentMethodStorageToken = unknown & { __type: 'PaymentProviderSavedPaymentMethodStorageToken' };

export type PaymentMethodData = { name: string, providerName: string, paymentMethod: PaymentProviderSavedPaymentMethodStorageToken };

/** Payment Client to Server Calls
 * 
 * These are the calls made on the client to the server
 */
export type PaymentApi = {
    // Normal Flow
    setupSavedPaymentMethod: () => Promise<PaymentProviderSavedPaymentMethodClientSetupToken>;
    saveSavedPaymentMethod: (params: { name: string, paymentMethodClientToken: PaymentProviderSavedPaymentMethodClientToken }) => Promise<void>;

    // Management of Payment Methods
    getSavedPaymentMethods: () => Promise<{ name: string }[]>;
    deleteSavedPaymentMethod: (params: { name: string }) => Promise<void>;
}

/** Payment Server to Payment Provider Api Calls
 * 
 * This wraps the provider-specific server code
 */
export type PaymentProviderApi = {
    setupSavePaymentMethod: () => Promise<PaymentProviderSavedPaymentMethodClientSetupToken>;
    obtainSavedPaymentMethod: (clientToken: PaymentProviderSavedPaymentMethodClientToken) => Promise<PaymentProviderSavedPaymentMethodStorageToken>;
    chargeSavedPaymentMethod: (token: PaymentProviderSavedPaymentMethodStorageToken) => Promise<void>;
}

// /** Payment Server Dependencies */
// export type PaymentServerDependencies = {
//     savePaymentMethod: (params: PaymentMethodData) => Promise<void>;
//     getSavedPaymentMethods: () => Promise<PaymentMethodData[]>;
//     deleteSavedPaymentMethod: (params: { name: string }) => Promise<void>;
// }
