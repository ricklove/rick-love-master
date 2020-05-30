/* eslint-disable no-console */
/* eslint-disable no-useless-return */
import http from 'http';
import { createJsonRpcServer } from 'json-rpc/json-rpc-server';
import { createPaymentApi_simple } from '../server/create-payment-api';
import { getFullStackTestConfig } from './full-stack-test-config';

export const run = async () => {
    const config = await getFullStackTestConfig();
    const storage = {
        state: {} as { [key: string]: string },
        getValue: async (key: string) => storage.state[key],
        setValue: async (key: string, value: string) => {
            storage.state[key] = value;
            console.log(`storage.setValue`, { key, value, state: storage.state });
        },
    };
    const api = createPaymentApi_simple({
        getStripeSecretKey: () => config.stripeSecretKey,
        getUserBillingDetails: async () => ({ phone: `555-867-5309` }),
        userKeyValueStorage: storage,
    });

    const server = createJsonRpcServer({}, api);

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
