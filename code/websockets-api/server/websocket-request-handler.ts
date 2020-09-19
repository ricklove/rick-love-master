import AWS from 'aws-sdk';
import { distinct, groupItems } from 'utils/arrays';
import { toKeyValueArray } from 'utils/objects';
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
        eventType: 'CONNECT' | 'DISCONNECT' | 'MESSAGE' | 'UNKNOWN';
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

    console.log(`handleWebsocketEvent - Getting connection info`, {});
    const connectionInfo = await getOrAddConnectionId_DynamoDb({ websocketKey: data.key, connectionIds: [event.requestContext.connectionId] });
    // console.log(`handleWebsocketEvent - connectionIds`, { connectionIds: connectionIds.connectionIds });

    // Echo all messages to every client
    console.log(`handleWebsocketEvent - Echo data to every client`, { data });
    let sendCount = 0;
    const sendFailureIds = [] as string[];
    const BATCH_COUNT = 10;
    const batches = toKeyValueArray(groupItems(connectionInfo.connectionIds.map((x, i) => ({ connectionId: x, batchId: i % BATCH_COUNT })), x => `${x.batchId}`));
    await Promise.all(batches.map(async (batch) => {
        console.log(`handleWebsocketEvent - Send to clients - Batch START`, { batchId: batch.key, length: batch.value.length });

        for (const item of batch.value.reverse()) {
            const { connectionId } = item;
            try {
                // eslint-disable-next-line no-await-in-loop
                await webSocketClient
                    .postToConnection({
                        ConnectionId: connectionId,
                        Data: `${event.body}`,
                    })
                    .promise();
                sendCount++;
            } catch{
                console.log(`handleWebsocketEvent - SEND ERROR - Failed to send to connection`, { x: connectionId });
                // Remove failed connections
                sendFailureIds.push(connectionId);

                if (sendFailureIds.length > 50) {
                    console.log(`handleWebsocketEvent - EARLY CLEAN - Many sendFailures found - Not able to send to all clients`, { x: connectionId });
                    return;
                    // eslint-disable-next-line no-await-in-loop
                    // await removeConnectionId_DynamoDb({ websocketKey: data.key, connectionIds: sendFailureIds });
                }
            }
        }

        console.log(`handleWebsocketEvent - Send to clients - Batch DONE`, { batchId: batch.key, length: batch.value.length });
    }));
    console.log(`handleWebsocketEvent - Send to clients`, { sendCount });

    // Periodically clean up clients (5 mins)
    if (sendFailureIds.length > 0
        || Date.now() > 5 * 60 * 1000 + (connectionInfo.lastConnectionCleanedTimestamp ?? 0)) {
        console.log(`handleWebsocketEvent - cleaning up clients list`, {});

        if (sendFailureIds.length > 0) {
            console.log(`Removing invalid connectionIds`, { sendFailureIds });
            await removeConnectionId_DynamoDb({ websocketKey: data.key, connectionIds: sendFailureIds });
        }

        const removedConnectionIds = [...sendFailureIds] as string[];
        const invalidConnectionIds = [] as string[];
        for (const connectionId of connectionInfo.connectionIds) {
            const x = connectionId;

            if (removedConnectionIds.includes(x)) {
                return;
            }

            try {
                // eslint-disable-next-line no-await-in-loop
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
                invalidConnectionIds.push(x);
            }

            if (invalidConnectionIds.length > 50) {
                const toRemove = invalidConnectionIds.splice(0, invalidConnectionIds.length);
                console.log(`Removing invalid connectionIds`, { toRemove });

                // eslint-disable-next-line no-await-in-loop
                await removeConnectionId_DynamoDb({ websocketKey: data.key, connectionIds: toRemove });
                removedConnectionIds.push(...toRemove);
            }
        }

        if (invalidConnectionIds.length > 0) {
            console.log(`Removing invalid connectionIds`, { invalidConnectionIds });
            await removeConnectionId_DynamoDb({ websocketKey: data.key, connectionIds: invalidConnectionIds });
        }
    }
};

type ConnectionInfo = {
    connectionIds: string[];
    lastConnectionChangeTimestamp: number;
    lastConnectionCleanedTimestamp?: number;
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

    const allIds = action === `add` ? distinct([...existingConnectionIds, ...connectionIds ?? []]) : distinct(existingConnectionIds.filter(x => !connectionIds.includes(x)));

    if (existingConnectionIds.length !== allIds.length) {
        // console.log(`updateConnectionIds - connectionIds changed`, {});

        const valueJsonObj: ConnectionInfo = {
            connectionIds: allIds,
            lastConnectionChangeTimestamp: Date.now(),
            lastConnectionCleanedTimestamp: action === `remove` ? Date.now() : existingConnectionInfo?.lastConnectionCleanedTimestamp,
        };
        const item: ItemType = { ...key, value: { S: JSON.stringify(valueJsonObj) } };
        await db.putItem({
            TableName: settings.table,
            Item: item,
        }).promise();

        // console.log(`updateConnectionIds - putItem`, { item });
    }

    return {
        connectionIds: allIds,
        lastConnectionChangeTimestamp: existingConnectionInfo?.lastConnectionChangeTimestamp ?? Date.now(),
        lastConnectionCleanedTimestamp: existingConnectionInfo?.lastConnectionCleanedTimestamp,
    };
};
