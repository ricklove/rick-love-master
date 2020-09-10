import { randomBytes } from 'crypto';

export type SecureToken = string & { __type: 'SecureToken', format: 'CryptoRandom256BitInBase64' };

export async function generateSecureToken(): Promise<SecureToken> {
    const randomBytesData = await new Promise<Buffer>((resolve) => randomBytes(32, (err, buffer) => resolve(buffer)));
    const base64UrlSafe = randomBytesData.toString(`base64`).replace(/\//g, `_`).replace(/\+/g, `-`);
    return base64UrlSafe as SecureToken;
}


export async function generateHumanReadableRandomCode(digits = 8): Promise<string> {
    const randomBytesData = await new Promise<Buffer>((resolve) => randomBytes(digits * 3, (err, buffer) => resolve(buffer)));
    const base64UrlSafe = randomBytesData.toString(`base64`)
        .replace(/\//g, `_`)
        .replace(/\+/g, `-`)
        .replace(/[a-z]/g, x => x.toUpperCase())
        .replace(/[0Oo]/g, `Z`)
        .replace(/[5Ss]/g, `S`)
        .replace(/[1Ll]/g, `L`)
        .replace(/\d/g, `N`)
        .replace(/[^A-Z]/g, ``)
        ;
    const code = base64UrlSafe.substr(0, digits);
    return code;
}

// // Test
// const test = async () => {
//     const code = await generateHumanReadableRandomCode(8);
//     console.log(`code`, { code });
// };

// test();
