/* eslint-disable no-console */
/* eslint-disable no-useless-return */
import http from 'http';
import { createJsonRpcServer } from 'json-rpc/json-rpc-server-stack';
import { JsonRpcSessionToken, JsonRpcSessionRequestBody } from 'json-rpc/types';
import { JsonTyped } from 'utils/json';
import { PaymentError } from '../common/types';
import { createPaymentApiFactory } from '../server/create-payment-api';
import { getFullStackTestConfig } from './full-stack-test-config';

const createServerAccessFactory_withUserContext = () => {

    type UserStorageState = { [key: string]: string | undefined };
    const storageState = {} as { [userId: string]: { userStorageState: UserStorageState } | undefined };
    const userSessions = {} as { [sessionId: string]: { userId: string } | undefined };
    // const userAccounts = {} as { [username: string]: { password: string, userId: string } };

    const getUserIdFromCredentials = async (credentials?: JsonRpcSessionToken): Promise<{ userId: string } | undefined> => {
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

    const getUserStorageFromCredentials = async (credentials?: JsonRpcSessionToken) => {
        const userIdResult = await getUserIdFromCredentials(credentials);
        if (!userIdResult) { throw new PaymentError(`Invalid Credentials`); }
        return getUserStorage(userIdResult.userId);
    };

    const createServerAccess_withUserContext_fromCredentials = async (sessionToken?: JsonRpcSessionToken) => {
        let newSessionToken = undefined as undefined | JsonRpcSessionToken;

        if (!sessionToken) {
            // Just create a new user for mock purposes
            const newSessionId = `${Math.random()}`;
            userSessions[newSessionId] = { userId: `anon_${newSessionId}` };
            newSessionToken = { sessionId: newSessionId } as unknown as JsonRpcSessionToken;
        }

        const credentials = sessionToken ?? newSessionToken;

        // Check credentials
        const userIdResult = await getUserIdFromCredentials(credentials);
        if (!userIdResult) {
            // Reject the client credentials
            return {
                context: {},
                newSessionToken: `reset` as const,
            };
        }

        return {
            context: {
                getUserContext: async () => {
                    console.log(`createServerAccess_withUserContext_fromCredentials.getUserContext`);
                    return ({
                        getUserBillingDetails: async () => ({ phone: `555-867-5309` }),
                        getUserKeyValueStorage: async () => await getUserStorageFromCredentials(credentials),
                    });
                },
            },
            newSessionToken,
        };
    };

    // // A Mock auth Api to demonstrate what could happen for unauthenticated requests
    // const createServerAccess_unauthenticated = async () => {
    //     let newCredentials = null as null | JsonRpcSessionToken;

    //     return {
    //         // This would probably have a callback function: onNewCredentials, etc.
    //         authApi: {
    //             login: async (username: string, password: string) => {
    //                 // This ain't no way to check a password, let's assume hash and security is actually here (this is just mock)
    //                 const user = userAccounts[username];
    //                 if (user.password === password) {
    //                     // Note: Quoting Gandalf does not improve security => This is not secure
    //                     throw new PaymentError(`You shall not pass!`);
    //                 }
    //                 // Obviously not secure
    //                 const sessionId = `${Math.random()}`;
    //                 userSessions[sessionId] = { userId: user.userId };
    //                 newCredentials = { sessionId } as unknown as JsonRpcSessionToken;
    //             },
    //         },
    //         getNewCredentials: async () => {
    //             return newCredentials;
    //         },
    //     };
    // };

    // // This will create an anonymous user and session (this could also be merged with the original, by just letting it do the same if credentials is null)
    // const createServerAccess_anonymousCredentials = async () => {
    //     const newSessionId = `${Math.random()}`;
    //     userSessions[newSessionId] = { userId: `anon_${newSessionId}` };
    //     const newCredentials = { sessionId: newSessionId } as unknown as JsonRpcSessionToken;

    //     return {
    //         ... await createServerAccess_withUserContext_fromCredentials(newCredentials),
    //         getNewCredentials: async () => {
    //             return newCredentials;
    //         },
    //     };
    // };

    // const verifyAndRefreshCredentials = async (credentials: null | JsonRpcSessionToken) => {
    //     if (!credentials) {
    //         // Allow Anonymouse
    //         return null;
    //         // throw new PaymentError(`Unknown Credentials - First Login`);
    //     }
    //     // Check credentials
    //     const userIdResult = await getUserIdFromCredentials(credentials);
    //     if (!userIdResult) {
    //         // Reject the client credentials
    //         return `reset`;
    //     }

    //     // Refresh?
    //     return null;
    // };

    return {
        // verifyAndRefreshCredentials,
        createServerAccess_withUserContext_fromCredentials,
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

    const server = createJsonRpcServer({
        // TODO: Define the type for this
        contextProvider: {
            getContext: async (sessionToken) => {
                try {
                    const { context, newSessionToken } = await serverUserAccess.createServerAccess_withUserContext_fromCredentials(sessionToken);
                    return {
                        context,
                        newSessionToken,
                    };
                } catch (error) {
                    return {
                        context: {},
                        error,
                    };
                }
            },
        },
        apiAccess: {
            execute: async (method, params, context) => {
                const api = apiFactory({ getUserContext: (context as any).getUserContext }).paymentClientApi;
                const result = await api[method as keyof typeof api](params as any);
                return { result };
            },
        },
        // verifyAndRefreshCredentials: serverUserAccess.verifyAndRefreshCredentials,
        // createHandler: async (credentials) => {

        //     // if (!credentials) {
        //     //     // If this endpoint can handle unauthenticated requests
        //     //     const { getNewCredentials, authApi } = await serverUserAccess.createServerAccess_unauthenticated();

        //     //     return {
        //     //         api: authApi,
        //     //         getNewCredentials,
        //     //     };
        //     // }

        //     // if (!credentials) {
        //     //     throw new Error(`This endpoint only supports authenticated requests`);
        //     // }

        //     if (!credentials) {
        //         const { getUserContext, getNewCredentials } = await serverUserAccess.createServerAccess_anonymousCredentials();
        //         return {
        //             api: apiFactory({ getUserContext }).paymentClientApi,
        //             getNewCredentials,
        //         };
        //     }

        //     const { getUserContext, getNewCredentials } = await serverUserAccess.createServerAccess_withUserContext_fromCredentials(credentials);
        //     return {
        //         api: apiFactory({ getUserContext }).paymentClientApi,
        //         getNewCredentials,
        //     };
        // },
    });

    // create a server object:
    const port = 3000;
    http.createServer((req, res) => {
        console.log(`${req.url} ${req.method} START`);

        // Set CORS headers
        // res.setHeader(`Access-Control-Allow-Origin`, `*`);
        res.setHeader(`Access-Control-Allow-Origin`, `${req.headers.origin}`);
        res.setHeader(`Access-Control-Allow-Credentials`, `${true}`);
        // res.setHeader(`Access-Control-Request-Method`, `*`);
        res.setHeader(`Access-Control-Allow-Methods`, `OPTIONS, POST`);
        // res.setHeader(`Access-Control-Allow-Headers`, `*`);
        res.setHeader(`Access-Control-Allow-Headers`, `Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With`);
        if (req.method === `OPTIONS`) {
            res.writeHead(200);
            res.end();
            return;
        }

        if (req.method === `POST`) {

            const handleRequest = async (requestBody: string, requestCookie?: string) => {
                console.log(`${req.url}`, { requestBody });
                try {
                    const cookieJson = undefined;
                    const response = await server.respond(requestBody as JsonTyped<JsonRpcSessionRequestBody>, cookieJson as undefined | JsonTyped<JsonRpcSessionToken>);
                    res.writeHead(200, {
                        'Content-Type': `application/json; charset=utf8`,
                        // TODO: Fix Cookie (httpOnly, Secure)
                        // 'Cookie': response.responseCookieJson,
                    });
                    res.write(response.responseBodyJson);
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
                await handleRequest(body, req.headers.cookie);
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
