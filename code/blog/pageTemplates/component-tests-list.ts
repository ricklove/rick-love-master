export const componentTestList = [
    { name: `stripe`, load: async () => (await import(`payments/providers/stripe/client-test/stripe-example`)).StripeExamplePage },
    { name: `payment`, load: async () => (await import(`payments/test/full-stack-test-client`)).PaymentFullStackTesterHost },
    { name: `code-space`, load: async () => (await import(`code-space-views/code-space-component`)).CodeSpaceComponent },
    // { name: `theme`, load: async () => (await import(`themes/theme-example`)).ThemeExample },
];
