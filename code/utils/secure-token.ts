import { randomBytes } from 'crypto';

export type SecureToken = string & { __type: 'SecureToken', format: 'CryptoRandom256BitInBase64' };

export async function generateSecureToken(): Promise<SecureToken> {
    const randomBytesData = await new Promise<Buffer>((resolve) => randomBytes(32, (err, buffer) => resolve(buffer)));
    const base64UrlSafe = randomBytesData.toString(`base64`).replace(/\//g, `_`).replace(/\+/g, `-`);
    return base64UrlSafe as SecureToken;
}
