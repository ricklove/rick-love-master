import Stripe from 'stripe';
import { PaymentProviderApi, PaymentProviderName, PaymentError } from '../../../common/types';
import { stripeDecodeUserToken, stripeEncodeUserToken, stripeEncodeStorageToken } from './stripe-server-tokens';
import { stripeEncodeClientSetupToken, StripeCustomerBillingDetails, stripeDecodeClientToken } from '../client/stripe-client-tokens';
import { wrapProcessStep_CreateSavedPaymentMethod_Stripe, ProcessSteps_CreateSavedPaymentMethod_Stripe } from '../common/stripe-process-steps';

export type StripePaymentProviderConfig = {
    getStripeSecretKey: () => string;
};
export type StripePaymentProviderStorage = {
    getUserBillingDetails: () => Promise<StripeCustomerBillingDetails>;
};
export const createStripePaymentProviderApi = (dependencies: {
    config: StripePaymentProviderConfig;
    storage: StripePaymentProviderStorage;
}): PaymentProviderApi => {
    const stripe = new Stripe(dependencies.config.getStripeSecretKey(), { apiVersion: `2020-03-02` });
    const providerApi: PaymentProviderApi = {
        providerName: `stripe` as PaymentProviderName,
        setupSavedPaymentMethod: async (userToken) => {
            const userTokenData = userToken ? stripeDecodeUserToken(userToken) : null;

            const newUser = await wrapProcessStep_CreateSavedPaymentMethod_Stripe(
                ProcessSteps_CreateSavedPaymentMethod_Stripe._02A_Server_GetOrCreateCustomer,
                async () => {
                    if (userTokenData) { return null; }
                    // Create Customer if new
                    const customer = await stripe.customers.create();
                    const newUserTokenData = {
                        customerId: customer.id,
                    };
                    return { newUserTokenData, newUserToken: stripeEncodeUserToken(newUserTokenData) };
                });

            const setupToken = await wrapProcessStep_CreateSavedPaymentMethod_Stripe(
                ProcessSteps_CreateSavedPaymentMethod_Stripe._02B_Server_CreateSetupIntent,
                async () => {
                    const intent = await stripe.setupIntents.create({
                        customer: userTokenData?.customerId || newUser?.newUserTokenData?.customerId,
                    });
                    if (!intent.client_secret) {
                        throw new PaymentError(`setupSavedPaymentMethod: intent.client_secret is missing`);
                    }
                    return stripeEncodeClientSetupToken({ clientSecret: intent.client_secret, customerBillingDetails: await dependencies.storage.getUserBillingDetails() });
                });

            return { newUserToken: newUser?.newUserToken, setupToken };
        },
        obtainSavedPaymentMethod: async (userToken, clientToken) => {
            const paymentMethodId = await wrapProcessStep_CreateSavedPaymentMethod_Stripe(
                ProcessSteps_CreateSavedPaymentMethod_Stripe._04A_Server_ObtainPaymentMethod,
                async () => {
                    const { setupIntent } = stripeDecodeClientToken(clientToken);
                    if (!setupIntent.payment_method) {
                        throw new PaymentError(`obtainSavedPaymentMethod: setupIntent.payment_method is missing`);
                    }
                    // console.log(`obtainSavedPaymentMethod`, { title });
                    return setupIntent.payment_method;
                });

            const paymentMethodInfo = await wrapProcessStep_CreateSavedPaymentMethod_Stripe(
                ProcessSteps_CreateSavedPaymentMethod_Stripe._04B_Server_ObtainPaymentMethodDetails,
                async () => {
                    const result = await stripe.paymentMethods.retrieve(paymentMethodId);
                    if (!result) {
                        throw new PaymentError(`obtainSavedPaymentMethod: paymentMethod was not found`);
                    }
                    if (!result.card) {
                        throw new PaymentError(`obtainSavedPaymentMethod: paymentMethod.card is missing`);
                    }
                    // console.log(`obtainSavedPaymentMethod`, { title });
                    return {
                        title: `Last4: ...${result.card.last4}`,
                        expiration: { year: result.card.exp_year, month: result.card.exp_month },
                    };
                });

            return {
                token: stripeEncodeStorageToken({ paymentMethod: paymentMethodId }),
                title: paymentMethodInfo.title,
                expiration: paymentMethodInfo.expiration,
            };
        },
        chargeSavedPaymentMethod: async () => {
            throw new Error(`Not Implemented`);
        },
    };
    return providerApi;
};