/* eslint-disable no-console */
/* eslint-disable no-useless-return */
import http from 'http';
import { createJsonRpcWebServer } from 'json-rpc/json-rpc-server.ts.old';
import { JsonRpcClientCredentials } from 'json-rpc/types';
import { PaymentError } from '../common/types';
import { createPaymentApiFactory } from '../server/create-payment-api';
import { getFullStackTestConfig } from './full-stack-test-config';

const createServerAccessFactory_withUserContext = () => {

    type UserStorageState = { [key: string]: string | undefined };
    const storageState = {} as { [userId: string]: { userStorageState: UserStorageState } | undefined };
    const userSessions = {} as { [sessionId: string]: { userId: string } | undefined };
    const userAccounts = {} as { [username: string]: { password: string, userId: string } };

    const getUserIdFromCredentials = async (credentials: JsonRpcClientCredentials): Promise<{ userId: string } | undefined> => {
        const { sessionId } = (credentials ?? {}) as unknown as { sessionId: string };
        return userSessions[sessionId];
    };

    const getUserStorage = (userId: string) => ({
        getValue: async (key: string) => storageState[userId]?.userStorageState?.[key] ?? null,
        setValue: async (key: string, value: string) => {
            if (!storageState[userId]) {
                storageState[userId] = { userStorageState: {} };
            }
            const userStorage = storageState[userId]?.userStorageState ?? {};
            userStorage[key] = value;
            console.log(`storage.setValue`, { key, value, userStorage });
        },
    });

    const getUserStorageFromCredentials = async (credentials: JsonRpcClientCredentials) => {
        const userIdResult = await getUserIdFromCredentials(credentials);
        if (!userIdResult) { throw new PaymentError(`Invalid Credentials`); }
        return getUserStorage(userIdResult.userId);
    };

    const createServerAccess_withUserContext_fromCredentials = async (credentials: JsonRpcClientCredentials) => {
        if (!credentials) {
            throw new PaymentError(`Unknown Credentials - First Login`);
        }

        let newCredentials = null as null | 'reject' | JsonRpcClientCredentials;

        // Check credentials
        const userIdResult = await getUserIdFromCredentials(credentials);
        if (!userIdResult) {
            // Reject the client credentials
            newCredentials = `reject`;
            throw new PaymentError(`Invalid Credentials - Rejected`);
        }

        return {
            getUserContext: async () => {
                console.log(`createServerAccess_withUserContext_fromCredentials.getUserContext`);
                return ({
                    getUserBillingDetails: async () => ({ phone: `555-867-5309` }),
                    getUserKeyValueStorage: async () => await getUserStorageFromCredentials(credentials),
                });
            },
            getNewCredentials: async () => {
                return newCredentials;
            },
        };
    };

    // A Mock auth Api to demonstrate what could happen for unauthenticated requests
    const createServerAccess_unauthenticated = async () => {
        let newCredentials = null as null | JsonRpcClientCredentials;

        return {
            // This would probably have a callback function: onNewCredentials, etc.
            authApi: {
                login: async (username: string, password: string) => {
                    // This ain't no way to check a password, let's assume hash and security is actually here (this is just mock)
                    const user = userAccounts[username];
                    if (user.password === password) {
                        // Note: Quoting Gandalf does not improve security => This is not secure
                        throw new PaymentError(`You shall not pass!`);
                    }
                    // Obviously not secure
                    const sessionId = `${Math.random()}`;
                    userSessions[sessionId] = { userId: user.userId };
                    newCredentials = { sessionId } as unknown as JsonRpcClientCredentials;
                },
            },
            getNewCredentials: async () => {
                return newCredentials;
            },
        };
    };

    // This will create an anonymous user and session (this could also be merged with the original, by just letting it do the same if credentials is null)
    const createServerAccess_anonymousCredentials = async () => {
        const newSessionId = `${Math.random()}`;
        userSessions[newSessionId] = { userId: `anon_${newSessionId}` };
        const newCredentials = { sessionId: newSessionId } as unknown as JsonRpcClientCredentials;

        return {
            ... await createServerAccess_withUserContext_fromCredentials(newCredentials),
            getNewCredentials: async () => {
                return newCredentials;
            },
        };
    };

    const verifyAndRefreshCredentials = async (credentials: null | JsonRpcClientCredentials) => {
        if (!credentials) {
            // Allow Anonymouse
            return null;
            // throw new PaymentError(`Unknown Credentials - First Login`);
        }
        // Check credentials
        const userIdResult = await getUserIdFromCredentials(credentials);
        if (!userIdResult) {
            // Reject the client credentials
            return `reject`;
        }

        // Refresh?
        return null;
    };

    return {
        verifyAndRefreshCredentials,
        createServerAccess_withUserContext_fromCredentials,
        createServerAccess_unauthenticated,
        createServerAccess_anonymousCredentials,
    };
};

export const run = async () => {
    const config = await getFullStackTestConfig();
    const serverUserAccess = createServerAccessFactory_withUserContext();

    const apiFactory = createPaymentApiFactory({
        getStripeSecretKey: () => config.stripeSecretKey,
        // getUserContext: () => ({} as PaymentUserContext),
        // getUserBillingDetails: async (user) => ({ phone: `555-867-5309` }),
        // getUserKeyValueStorage: (user) => storage,
    });

    const server = createJsonRpcWebServer({
        verifyAndRefreshCredentials: serverUserAccess.verifyAndRefreshCredentials,
        createHandler: async (credentials) => {

            // if (!credentials) {
            //     // If this endpoint can handle unauthenticated requests
            //     const { getNewCredentials, authApi } = await serverUserAccess.createServerAccess_unauthenticated();

            //     return {
            //         api: authApi,
            //         getNewCredentials,
            //     };
            // }

            // if (!credentials) {
            //     throw new Error(`This endpoint only supports authenticated requests`);
            // }

            if (!credentials) {
                const { getUserContext, getNewCredentials } = await serverUserAccess.createServerAccess_anonymousCredentials();
                return {
                    api: apiFactory({ getUserContext }).paymentClientApi,
                    getNewCredentials,
                };
            }

            const { getUserContext, getNewCredentials } = await serverUserAccess.createServerAccess_withUserContext_fromCredentials(credentials);
            return {
                api: apiFactory({ getUserContext }).paymentClientApi,
                getNewCredentials,
            };
        },
    });

    // create a server object:
    const port = 3000;
    http.createServer((req, res) => {
        console.log(`${req.url} ${req.method} START`);

        // Set CORS headers
        res.setHeader(`Access-Control-Allow-Origin`, `*`);
        res.setHeader(`Access-Control-Request-Method`, `*`);
        res.setHeader(`Access-Control-Allow-Methods`, `OPTIONS, POST`);
        res.setHeader(`Access-Control-Allow-Headers`, `*`);
        if (req.method === `OPTIONS`) {
            res.writeHead(200);
            res.end();
            return;
        }

        if (req.method === `POST`) {

            const handleRequest = async (requestBody: string) => {
                console.log(`${req.url}`, { requestBody });
                try {
                    const response = await server.requestHandler({ requestBody });
                    res.writeHead(200, { 'Content-Type': `application/json; charset=utf8` });
                    res.write(response.responseBody);
                    res.end();
                    return;
                } catch (error) {
                    console.log(`${req.url} ${req.method} ERROR`, { error });

                    res.writeHead(500, { 'Content-Type': `application/json; charset=utf8` });
                    res.write(JSON.stringify({ error }));
                    res.end();
                    return;
                }
            };

            let body = ``;
            req.on(`data`, chunk => {
                body += chunk.toString(); // convert Buffer to string
            });
            req.on(`end`, async () => {
                await handleRequest(body);
            });
            return;
        }

        res.writeHead(500, { 'Content-Type': `application/json; charset=utf8` });
        res.write(`¯\\_(ツ)_/¯`);
        res.end();
        return;

    }).listen(port, () => {
        console.log(`Server listening at: https://localhost:${port}`);
    });

};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
