// eslint-disable-next-line @typescript-eslint/naming-convention
export type SecureToken = string & { __type: 'SecureToken'; format: 'CryptoRandom256BitInBase64' };
