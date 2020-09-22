import { createWebsocketConnection_smart } from 'websockets-api/client/websocket-client-smart';
import { createSubscribable } from 'utils/subscribable';
import { AppError } from 'utils/error';
import { websocketsApiConfig } from 'websockets-api/client/config';

type Timestamp = number & { __type: 'Timestamp' }
type ClientKey = string & { __type: 'ClientKey' }
const createWebMeshClient_websocketOnly = <TMeshState, TMeshMessage>({
    channelKey,
    initialState: initialMeshState,
    reduceState,
}: {
    channelKey: string;
    initialState: TMeshState;
    reduceState: (previousState: TMeshState, message: TMeshMessage) => TMeshState;
}) => {
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
    const messageHistory = [] as WebSocketMessageWithSenderInfo[];

    type WebSocketMessage = (
        { kind: 'join' }
        | { kind: 'close' }
        | { kind: 'sync', state: typeof state }
        | { kind: 'message', message: TMeshMessage }
    );
    type WebSocketMessageWithSenderInfo = { t: Timestamp, c: ClientKey } & WebSocketMessage;

    let sendSyncStateTimeoutId = setTimeout(() => { }, 0);
    const websocket = createWebsocketConnection_smart<WebSocketMessageWithSenderInfo>({ websocketsApiUrl: websocketsApiConfig.websocketsApiUrl, channelKey: `wm_${channelKey}` }, message => {

        if (message.kind === `close`) {
            clearTimeout(sendSyncStateTimeoutId);
            state.meshMetaData.clientKeys = state.meshMetaData.clientKeys.filter(x => x !== message.c);
            return;
        }

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

            if (state.meshMetaData.firstMessageTimestamp
                && state.meshMetaData.firstMessageTimestamp < message.state.meshMetaData.firstMessageTimestamp) {
                // Ignore if the data is not complete (and send new sync message if needed)
                sendSyncStateTimeoutId = setTimeout(sendSyncState, 10 * 1000);
                return;
            }

            state.meshMetaData = message.state.meshMetaData;
            state.meshState = message.state.meshState;

            // TODO: What about out of order messages?
            // Replay missing messages
            const missingMessages = messageHistory.filter(x => x.t > state.meshMetaData.lastMessageTimestamp);
            for (const m of missingMessages) {
                if (m.kind !== `message`) { return; }
                state.meshState = reduceState(state.meshState, m.message);
                state.meshMetaData.lastMessageTimestamp = m.t;
            }

            stateSub.onStateChange(state.meshState);
            return;
        }
        if (message.kind === `message`) {
            // Accept own message into state once it returns
            messageHistory.push(message);

            state.meshState = reduceState(state.meshState, message.message);
            if (!state.meshMetaData.firstMessageTimestamp) { state.meshMetaData.firstMessageTimestamp = message.t; }
            state.meshMetaData.lastMessageTimestamp = message.t;
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
        // Move self to front of client list
        state.meshMetaData.clientKeys = state.meshMetaData.clientKeys.filter(x => x !== clientKey);
        state.meshMetaData.clientKeys.unshift(clientKey);

        sendWebSocketMessage({ kind: `sync`, state });
    };
    let isClosed = false;
    const close = () => {
        if (isClosed) { return; }
        isClosed = true;
        sendWebSocketMessage({ kind: `close` });
        websocket.unsubscribe();
    };
    const sendMessage = (message: TMeshMessage) => {
        if (isClosed) { throw new AppError(`The connection is closed`); }
        sendWebSocketMessage({ kind: `message`, message });
    };


    // Begin
    connect();

    return {
        _webSocket: {
            history: websocket.history,
        },
        clientKey,
        sendMessage,
        subscribe: stateSub.subscribe,
        close,
    };
};


export const createWebMeshClient = createWebMeshClient_websocketOnly;
