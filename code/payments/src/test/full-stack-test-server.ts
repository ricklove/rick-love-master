import { createPaymentApi_simple } from '../server/create-payment-api';

export const run = () => {
    const server = createPaymentApi_simple({
        getStripeSecretKey: () => props.state.stripeSecretKey,
        getUserBillingDetails: async () => ({ phone: `555-867-5309` }),
        userKeyValueStorage: storage,
    });
};
