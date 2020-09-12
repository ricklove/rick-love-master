import AWS from 'aws-sdk';
import { distinct } from 'utils/arrays';
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
        eventType: 'CONNECT' | 'DISCONNECT' | 'MESSAGE';
    };
    body: string;
};
export const handleWebsocketEvent = async (event: WebsocketEvent) => {
    console.log(`handleWebsocketEvent`, { body: event.body, requestContext: event.requestContext });

    // Connect and Disconnect don't have the key, so don't work with this table structure
    if (event.requestContext.eventType !== `MESSAGE`) {
        return;
    }

    const data = JSON.parse(event.body) as WebsocketConnectionData;

    const webSocketClient = new AWS.ApiGatewayManagementApi({
        // apiVersion: `2018-11-29`,
        endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
    });

    const connectionInfo = await getOrAddConnectionId_DynamoDb({ websocketKey: data.key, connectionIds: [event.requestContext.connectionId] });
    // console.log(`handleWebsocketEvent - connectionIds`, { connectionIds: connectionIds.connectionIds });

    // Echo all messages to every client
    await Promise.all(connectionInfo.connectionIds.map(async (x) => {
        try {
            await webSocketClient
                .postToConnection({
                    ConnectionId: x,
                    Data: `${event.body}`,
                })
                .promise();
        } catch{
            // Remove failed connections
            // await removeConnectionId_DynamoDb({ websocketKey: data.key, connectionId: x });
        }
    }));

    // Periodically clean up clients (5 mins)
    if (Date.now() > 5 * 60 * 1000 + connectionInfo.lastConnectionChangeTimestamp) {
        const invalidConnectionIds = [] as string[];
        await Promise.all(connectionInfo.connectionIds.map(async (x) => {
            try {
                const result = await webSocketClient
                    .getConnection({
                        ConnectionId: x,
                    })
                    .promise();
                if (!result.LastActiveAt) {
                    invalidConnectionIds.push(x);
                }
            } catch{
                // Remove failed connections
                // await removeConnectionId_DynamoDb({ websocketKey: data.key, connectionId: x });
            }
        }));

        if (invalidConnectionIds.length > 0) {
            console.log(`Removing invalid connectionIds`, { invalidConnectionIds });
            await removeConnectionId_DynamoDb({ websocketKey: data.key, connectionIds: invalidConnectionIds });
        }
    }
};

type ConnectionInfo = {
    connectionIds: string[];
    lastConnectionChangeTimestamp: number;
};

// DynamoDB
const db = new AWS.DynamoDB();
const getOrAddConnectionId_DynamoDb = async (args: { websocketKey: string, connectionIds: string[] }): Promise<ConnectionInfo> => {
    return await getAndUpdateConnectionInfo({ ...args, action: `add` });
};
const removeConnectionId_DynamoDb = async (args: { websocketKey: string, connectionIds: string[] }): Promise<ConnectionInfo> => {
    return await getAndUpdateConnectionInfo({ ...args, action: `remove` });
};

export const getAndUpdateConnectionInfo = async ({
    websocketKey,
    connectionIds,
    action,
}: {
    websocketKey: string;
    connectionIds: string[];
    action: 'add' | 'remove';
}): Promise<ConnectionInfo> => {
    // console.log(`updateConnectionIds`, { websocketKey, connectionId });

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

    const key: ItemKeyType = { key: { S: websocketKey } };

    const result = await db.getItem({
        TableName: settings.table,
        Key: key,
    }).promise();

    // console.log(`updateConnectionIds - existing`, { item: result.item, result });

    const existingItem = result.Item as undefined | ItemType;

    const existingConnectionInfo = existingItem ? (JSON.parse(existingItem.value.S) as ConnectionInfo) : null;
    const existingConnectionIds = existingConnectionInfo?.connectionIds ?? [];
    const allIds = action === `add` ? distinct([...existingConnectionIds, ...connectionIds]) : distinct(existingConnectionIds.filter(x => !connectionIds.includes(x)));

    if (existingConnectionIds.length !== allIds.length) {
        // console.log(`updateConnectionIds - connectionIds changed`, {});

        const valueJsonObj: ConnectionInfo = {
            connectionIds: allIds,
            lastConnectionChangeTimestamp: Date.now(),
        };
        const item: ItemType = { ...key, value: { S: JSON.stringify(valueJsonObj) } };
        await db.putItem({
            TableName: settings.table,
            Item: item,
        }).promise();

        // console.log(`updateConnectionIds - putItem`, { item });
    }

    return { connectionIds: allIds, lastConnectionChangeTimestamp: existingConnectionInfo?.lastConnectionChangeTimestamp ?? Date.now() };
};
