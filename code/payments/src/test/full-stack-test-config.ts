
// Place in [SameFileName].secret.ts
export type FullStackTestConfig = {
    stripeSecretKey: string;
    stripePublicKey: string;
}

export const getFullStackTestConfig = async (): Promise<FullStackTestConfig> => {
    const path = `./full-stack-test-config.secret`;
    const config = (await import(path))?.fullStackTestConfig as FullStackTestConfig;
    if (!config) {
        throw new Error(`Create config file at ${path}`);
    }
    return config;
};
