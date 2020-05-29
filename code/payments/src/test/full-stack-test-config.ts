
// Place in [SameFileName].secret.ts
export type FullStackTestConfig = {
    stripeSecretKey: string;
    stripePublicKey: string;
    serverUrl: string;
}

export const getFullStackTestConfig = async (): Promise<FullStackTestConfig> => {
    const config = (await import(`./full-stack-test-config.secret`))?.fullStackTestConfig as FullStackTestConfig;
    if (!config) {
        throw new Error(`Create config file`);
    }
    return config;
};
