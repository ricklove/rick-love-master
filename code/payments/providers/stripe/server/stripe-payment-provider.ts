import Stripe from 'stripe';
import { PaymentProviderApi, PaymentProviderName, PaymentError, PaymentTransaction } from '../../../common/types';
import { stripeDecodeUserToken, stripeEncodeUserToken, stripeEncodeStorageToken, stripeDecodeStorageToken } from './stripe-server-tokens';
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
    const providerName = `stripe` as PaymentProviderName;
    const providerApi: PaymentProviderApi = {
        providerName,
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
        chargeSavedPaymentMethod: async (userToken, paymentToken, amount) => {

            const { customerId } = stripeDecodeUserToken(userToken);
            const { paymentMethod } = stripeDecodeStorageToken(paymentToken);

            if (amount.currency !== `usd`) {
                throw new PaymentError(`stripe.chargeSavedPaymentMethod: Only Usd is accepted`, { amount, customerId });
            }

            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amount.usdCents,
                    currency: `usd`,
                    customer: customerId,
                    payment_method: paymentMethod,
                    // User not here
                    off_session: true,
                    // Attempt to confirm Immediately
                    confirm: true,
                });

                // Successful
                return;
            } catch (error) {
                // Error code will be authentication_required if authentication is needed
                // console.log(`Error code is:`, error.code);
                const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(error.raw.payment_intent.id);
                // console.log(`PI retrieved:`, paymentIntentRetrieved.id);

                throw new PaymentError(`stripe.chargeSavedPaymentMethod: Failed`, { errorCode: error?.code, error, paymentIntentRetrieved });
            }
        },
        getPayments: async (userToken) => {
            const { customerId } = stripeDecodeUserToken(userToken);
            const result = await stripe.paymentIntents.list({ customer: customerId });
            const p: PaymentTransaction[] = result.data.map(x => ({
                providerName,
                created: new Date(x.created * 1000),
                amount: { currency: x.currency as 'usd', usdCents: x.amount },
                status: x.status === `succeeded` ? `success`
                    : (x.status === `canceled` ? `terminated`
                        : `incomplete`),
            }));
            return p;
        },
    };
    return providerApi;
};
