import '@babel/polyfill';
import { APIGatewayEvent } from 'aws-lambda';
import { handleUploadApiWebRequest } from 'upload-api/server/web-request-handler';
import { corsHeaders } from '../helpers';

export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
    try {
        console.log(`handler START`);
        console.log(`event.body ${event?.body ?? `null`}`);
        const data = JSON.parse(event?.body ?? `{}`);
        const result = await handleUploadApiWebRequest(data);
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.error(`Request FAILED`, { err: error });
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: `Server Error`, error }),
        };
    }
};
