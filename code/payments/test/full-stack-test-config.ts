import { FullStackTestConfig } from './full-stack-test-config-types';

export const getFullStackTestConfig = async (): Promise<FullStackTestConfig> => {
    const config = (await import(`./full-stack-test-config.secret`))?.fullStackTestConfig as FullStackTestConfig;
    if (!config) {
        throw new Error(`Create config file`);
    }
    return config;
};
