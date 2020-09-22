import { createWebsocketConnection_smart } from 'websockets-api/client/websocket-client-smart';
import { uploadApiConfig } from 'upload-api/client/config';
import { createSubscribable } from 'utils/subscribable';

type Timestamp = number & { __type: 'Timestamp' }
type ClientKey = string & { __type: 'ClientKey' }
const createWebMeshClient_websocketOnly = <TMeshState, TMeshMessage>(channelKey: string, initialMeshState: TMeshState, reduceState: (previousState: TMeshState, message: TMeshMessage) => TMeshState) => {
    const stateSub = createSubscribable<TMeshState>();
    const clientKey = (`${Date.now()}-${Math.floor(Math.random() * 999999)}`) as ClientKey;
    const state = {
        meshState: initialMeshState,
        meshMetaData: {
            clientKeys: [] as string[],
            firstMessageTimestamp: 0 as Timestamp,
            lastMessageTimestamp: 0 as Timestamp,
        },
    };

    type WebSocketMessage = (
        { kind: 'join' }
        | { kind: 'sync', state: typeof state }
        | { kind: 'message', message: TMeshMessage }
    );
    type WebSocketMessageWithSenderInfo = { t: Timestamp, c: ClientKey } & WebSocketMessage;

    const websocket = createWebsocketConnection_smart<WebSocketMessageWithSenderInfo>({ websocketsApiUrl: uploadApiConfig.uploadApiUrl, channelKey }, message => {
        let sendSyncStateTimeoutId = setTimeout(() => { }, 0);

        if (!state.meshMetaData.firstMessageTimestamp) {
            state.meshMetaData.firstMessageTimestamp = message.t;
        }
        state.meshMetaData.lastMessageTimestamp = message.t;

        if (message.kind === `join`) {
            clearTimeout(sendSyncStateTimeoutId);

            // Add Client Key
            state.meshMetaData.clientKeys = state.meshMetaData.clientKeys.filter(x => x !== message.c);
            state.meshMetaData.clientKeys.push(message.c);

            // Is self, ignore
            if (message.c === clientKey) { return; }

            // Respond with sync
            const clientPriority = state.meshMetaData.clientKeys.indexOf(clientKey);
            const waitTime = clientPriority >= 0 ? clientPriority * 2000 : 10 * 1000;
            sendSyncStateTimeoutId = setTimeout(sendSyncState, waitTime);
            return;
        }
        if (message.kind === `sync`) {
            clearTimeout(sendSyncStateTimeoutId);

            // Is self, ignore
            if (message.c === clientKey) { return; }

            if (state.meshMetaData.firstMessageTimestamp < message.state.meshMetaData.firstMessageTimestamp) {
                // Ignore if the data is not complete (and send new sync message if needed)
                sendSyncStateTimeoutId = setTimeout(sendSyncState, 10 * 1000);
                return;
            }

            state.meshMetaData = message.state.meshMetaData;
            state.meshState = message.state.meshState;
            stateSub.onStateChange(state.meshState);
            return;
        }
        if (message.kind === `message`) {
            // Accept own message when it returns

            state.meshState = reduceState(state.meshState, message.message);
            stateSub.onStateChange(state.meshState);
        }
    });

    const sendWebSocketMessage = (message: WebSocketMessage) => {
        websocket.send({ ...message, c: clientKey, t: Date.now() as Timestamp });
    };
    const connect = () => {
        sendWebSocketMessage({ kind: `join` });
    };
    const sendSyncState = () => {
        sendWebSocketMessage({ kind: `sync`, state });
    };
    const sendMessage = (message: TMeshMessage) => {
        sendWebSocketMessage({ kind: `message`, message });
    };

    // Begin
    connect();

    return {
        clientKey,
        sendMessage,
        subscribe: stateSub.subscribe,
    };
};


export const createWebMeshClient = createWebMeshClient_websocketOnly;
