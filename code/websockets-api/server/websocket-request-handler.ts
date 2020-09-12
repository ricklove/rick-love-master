import AWS from 'aws-sdk';
import { WebsocketConnectionData } from '../client/types';

const s3 = new AWS.S3({ signatureVersion: `v4` });

const settings = {
    // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // bucket: process.env.BUCKET!,
};
export type WebsocketEvent = {
    requestContext: {
        connectionId: string;
        domainName: string;
        stage: string;
    };
    body: string;
};
export const handleWebsocketEvent = async (event: WebsocketEvent) => {
    console.log(`handleWebsocketEvent`, { body: event.body, requestContext: event.requestContext });

    const data = JSON.parse(event.body) as WebsocketConnectionData;

    const webSocketClient = new AWS.ApiGatewayManagementApi({
        // apiVersion: `2018-11-29`,
        endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
    });

    // Echo all messages to every client
    await webSocketClient
        .postToConnection({
            ConnectionId: event.requestContext.connectionId,
            Data: `${event.body}`,
        })
        .promise();
};
