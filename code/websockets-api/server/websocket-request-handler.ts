import AWS from 'aws-sdk';
import { WebsocketConnectionData } from '../client/types';


const settings = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    table: process.env.TABLE!,
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

    const connectionIds = await getConnectionIds_DynamoDb({ websocketKey: data.key, connectionId: event.requestContext.connectionId });

    // Echo all messages to every client
    await Promise.all(connectionIds.connectionIds.map(async () => {
        return await webSocketClient
            .postToConnection({
                ConnectionId: event.requestContext.connectionId,
                Data: `${event.body}`,
            })
            .promise();
    }));

};

// DynamoDB
const db = new AWS.DynamoDB();
const getConnectionIds_DynamoDb = async ({
    websocketKey,
    connectionId,
}: {
    websocketKey: string;
    connectionId: string;
}): Promise<{ connectionIds: string[] }> => {

    type ItemKeyType = {
        key: {
            S: string;
        };
    };
    type ItemType = {
        key: {
            S: string;
        };
        value: {
            S: string;
        };
    };
    type ValueJsonType = {
        connectionIds: string[];
    };

    const key: ItemKeyType = { key: { S: websocketKey } };

    const result = await db.getItem({
        TableName: settings.table,
        Key: key,
    }).promise();

    const existingItem = result.Item as undefined | ItemType;
    const existingConnectionIds = existingItem ? (JSON.parse(existingItem.value.S) as ValueJsonType).connectionIds : [];
    let allIds = existingConnectionIds;

    if (!existingConnectionIds.includes(connectionId)) {
        allIds = [...existingConnectionIds, connectionId];
        const valueJsonObj: ValueJsonType = {
            connectionIds: allIds,
        };
        const item: ItemType = { ...key, value: { S: JSON.stringify(valueJsonObj) } };
        await db.putItem({
            TableName: settings.table,
            Item: item,
        }).promise();
    }

    return { connectionIds: allIds };
};
