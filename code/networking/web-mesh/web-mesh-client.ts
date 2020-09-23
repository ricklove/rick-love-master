import { createWebsocketConnection_smart } from 'websockets-api/client/websocket-client-smart';
import { createSubscribable } from 'utils/subscribable';
import { AppError } from 'utils/error';
import { websocketsApiConfig } from 'websockets-api/client/config';
import { distinct_key } from 'utils/arrays';

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
    const WEB_MESH_CLIENT_KEY = `_webMeshClientKey`;
    const clientKey = (localStorage.getItem(WEB_MESH_CLIENT_KEY) ?? (`${Date.now()}-${Math.floor(Math.random() * 999999)}`)) as ClientKey;
    localStorage.setItem(WEB_MESH_CLIENT_KEY, clientKey);

    const stateSub = createSubscribable<TMeshState>();
    const clientsSub = createSubscribable<{ clientKey: string, clients: { key: string }[] }>();
    const state = {
        meshState: initialMeshState,
        meshMetaData: {
            clients: [] as { key: string, lastActivityTimestamp: Timestamp }[],
            firstMessageTimestamp: 0 as Timestamp,
            lastMessageTimestamp: 0 as Timestamp,
        },
    };
    const messageHistory = [] as WebSocketMessageWithSenderInfo[];

    type WebSocketMessage = (
        { kind: 'join' }
        | { kind: 'close' }
        | { kind: 'sync', state: typeof state }
        | { kind: 'ping', clientKeys: string[] }
        | { kind: 'pong' }
        | { kind: 'drop', clientKeys: string[] }
        | { kind: 'message', message: TMeshMessage }
    );
    type WebSocketMessageWithSenderInfo = { t: Timestamp, c: ClientKey } & WebSocketMessage;

    const updateClients = (message: { c: ClientKey, t: Timestamp }) => {
        const oldClients = [...state.meshMetaData.clients];
        state.meshMetaData.clients = state.meshMetaData.clients.filter(x => x.key !== message.c);
        state.meshMetaData.clients.push({ key: message.c, lastActivityTimestamp: message.t });
        state.meshMetaData.clients.sort((a, b) => -(a.lastActivityTimestamp - b.lastActivityTimestamp));

        if (oldClients.map(x => x.key).join(`;`) !== state.meshMetaData.clients.map(x => x.key).join(`;`)) {
            clientsSub.onStateChange({ clientKey, clients: state.meshMetaData.clients });
        }
    };

    let sendSyncStateTimeoutId = setTimeout(() => { }, 0);
    const websocket = createWebsocketConnection_smart<WebSocketMessageWithSenderInfo>({ websocketsApiUrl: websocketsApiConfig.websocketsApiUrl, channelKey: `wm_${channelKey}` }, message => {

        if (message.kind === `close`) {
            clearTimeout(sendSyncStateTimeoutId);
            state.meshMetaData.clients = state.meshMetaData.clients.filter(x => x.key !== message.c);
            clientsSub.onStateChange({ clientKey, clients: state.meshMetaData.clients });
            return;
        }

        updateClients(message);

        if (message.kind === `pong`) {
            clearTimeout(pingPongDropTimeoutId ?? 0);
            pingPongDropTimeoutId = null;
            return;
        }
        if (message.kind === `ping`) {
            clearTimeout(pingPongDropTimeoutId ?? 0);
            pingPongDropTimeoutId = null;
            if (message.clientKeys.includes(clientKey)) {
                setTimeout(sendPong);
            }
            return;
        }
        if (message.kind === `drop`) {
            clearTimeout(pingPongDropTimeoutId ?? 0);
            pingPongDropTimeoutId = null;
            state.meshMetaData.clients = state.meshMetaData.clients.filter(x => !message.clientKeys.some(c => c === x.key));
            clientsSub.onStateChange({ clientKey, clients: state.meshMetaData.clients });
            return;
        }

        if (message.kind === `join`) {
            clearTimeout(sendSyncStateTimeoutId);

            // Is self, ignore
            if (message.c === clientKey) { return; }

            // Respond with sync
            const clientPriority = state.meshMetaData.clients.findIndex(x => x.key === clientKey) - 1;
            const waitTime = clientPriority >= 0 ? clientPriority * 2000 : 10 * 1000;
            sendSyncStateTimeoutId = setTimeout(sendSyncState, waitTime);
            return;
        }
        if (message.kind === `sync`) {
            // Is self, ignore
            if (message.c === clientKey) { return; }

            if (state.meshMetaData.firstMessageTimestamp
                && state.meshMetaData.firstMessageTimestamp < message.state.meshMetaData.firstMessageTimestamp) {
                // Ignore if the data is not complete (and send new sync message if needed)
                sendSyncStateTimeoutId = setTimeout(sendSyncState, 10 * 1000);
                return;
            }

            clearTimeout(sendSyncStateTimeoutId);

            state.meshMetaData.firstMessageTimestamp = message.state.meshMetaData.firstMessageTimestamp;
            state.meshMetaData.lastMessageTimestamp = message.state.meshMetaData.lastMessageTimestamp;
            // state.meshMetaData.clients = message.state.meshMetaData.clients;
            state.meshMetaData.clients = distinct_key([...state.meshMetaData.clients, ...message.state.meshMetaData.clients], x => x.key);
            state.meshState = message.state.meshState;

            // TODO: What about out of order messages?
            // Replay missing messages
            const missingMessages = messageHistory.filter(x => x.t > state.meshMetaData.lastMessageTimestamp);
            for (const m of missingMessages) {
                if (m.kind !== `message`) { return; }
                state.meshState = reduceState(state.meshState, m.message);
                state.meshMetaData.lastMessageTimestamp = m.t;
            }

            clientsSub.onStateChange({ clientKey, clients: state.meshMetaData.clients });
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
        state.meshMetaData.clients = state.meshMetaData.clients.filter(x => x.key !== clientKey);
        state.meshMetaData.clients.unshift({ key: clientKey, lastActivityTimestamp: Date.now() as Timestamp });

        sendWebSocketMessage({ kind: `sync`, state });
    };

    // Ping-pong (Keep Alive)
    const sendPong = () => {
        sendWebSocketMessage({ kind: `pong` });
    };
    let pingPongDropTimeoutId = null as null | ReturnType<typeof setTimeout>;
    const pingPongInterval = setInterval(() => {
        if (pingPongDropTimeoutId) { return; }

        const deadClients = state.meshMetaData.clients.filter(x => Date.now() > 45 * 1000 + x.lastActivityTimestamp);
        if (deadClients.length > 0) {
            // state.meshMetaData.clients = state.meshMetaData.clients.filter(x => !deadClients.some(d => d.key === x.key));
            const clientPriority = state.meshMetaData.clients.findIndex(x => x.key === clientKey);
            pingPongDropTimeoutId = setTimeout(() => {
                pingPongDropTimeoutId = null;
                const deadClients2 = state.meshMetaData.clients.filter(x => Date.now() > 45 * 1000 + x.lastActivityTimestamp);
                if (deadClients2.length <= 0) { return; }
                sendWebSocketMessage({ kind: `drop`, clientKeys: deadClients2.map(x => x.key) });
            }, clientPriority * 5000);
            return;
        }

        const oldClients = state.meshMetaData.clients.filter(x => Date.now() > 30 * 1000 + x.lastActivityTimestamp);
        if (oldClients.length <= 0) { return; }

        const clientPriority = state.meshMetaData.clients.findIndex(x => x.key === clientKey);
        pingPongDropTimeoutId = setTimeout(() => {
            pingPongDropTimeoutId = null;
            const oldClients2 = state.meshMetaData.clients.filter(x => Date.now() > 30 * 1000 + x.lastActivityTimestamp);
            if (oldClients2.length <= 0) { return; }

            sendWebSocketMessage({ kind: `ping`, clientKeys: oldClients2.map(x => x.key) });
        }, clientPriority * 5000);
    }, 5000);

    // Close
    let isClosed = false;
    const close = () => {
        if (isClosed) { return; }
        isClosed = true;
        sendWebSocketMessage({ kind: `close` });
        websocket.unsubscribe();
        clearInterval(pingPongInterval);
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
        subscribeClientsChange: clientsSub.subscribe,
        close,
    };
};


export const createWebMeshClient = createWebMeshClient_websocketOnly;
