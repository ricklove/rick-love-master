// Based on https://stackoverflow.com/a/57117594/567524

export type Exact<T> = T;


// Tests
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
const test = () => {

    const asCallback = (onGetPublicValue: () => Exact<{ publicKey: string }>) => {
        console.log(`Hello World!`, { allTheThings: onGetPublicValue() });
    };

    const shareSecrets = (secrets: { publicKey: string, privateKey: string }) => {
        return secrets;
    };
    const protectSecrets = (secrets: { publicKey: string, privateKey: string }) => {
        return { publicKey: secrets.publicKey };
    };

    const secrets = { publicKey: `keep it secret`, privateKey: `keep it safe` };

    // This should fail type safety
    asCallback(() => shareSecrets(secrets));
    // This should pass
    asCallback(() => protectSecrets(secrets));

    // As Return Value
    type SecretKeeper = {
        getThePublicStuff: () => Exact<{ publicKey: string }>;
    };

    // This should fial type safety
    const badSecretKeeper: SecretKeeper = { getThePublicStuff: () => shareSecrets(secrets) };

    // This should pass
    const goodSecretKeeper: SecretKeeper = { getThePublicStuff: () => protectSecrets(secrets) };

};
/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-enable no-console */
