import { createSubscribable } from 'utils/subscribable';
import { AppError } from 'utils/error';
import { WebsocketApi, WebsocketConnectionEvent, WebsocketConnectionData } from './types';

export const createWebsocketClient = (config: { websocketsApiUrl: string }): WebsocketApi => {

    const api: WebsocketApi = {
        connect: <T>({ channelKey }: WebsocketConnectionData) => {
            // With this implementation, the server simply echos all messages to all clients
            // The client will filter those messages client-side with the key
            // NOTE: When the server filters via keys (providing privacy), this will continue to work without changes

            type MessageContainer = {
                message: T | null;
                key: string;
            };

            const subscribable = createSubscribable<T>();
            const subscribableEvents = createSubscribable<WebsocketConnectionEvent>();

            // Connect to websocket (and reconnect, etc.)
            const createSocket = () => {
                const socket = new WebSocket(`${config.websocketsApiUrl}`);

                // Connection opened
                socket.addEventListener(`open`, (event) => {
                    if (socket !== activeSocket) {
                        socket.close();
                        return;
                    }

                    subscribableEvents.onStateChange({ connectionStatus: `opened` });

                    // Send a key message
                    const messageContainer: MessageContainer = {
                        message: null,
                        key: channelKey,
                    };
                    socket.send(JSON.stringify(messageContainer));

                });
                socket.addEventListener(`close`, (event) => {
                    if (socket !== activeSocket) {
                        socket.close();
                        return;
                    }

                    subscribableEvents.onStateChange({ connectionStatus: `closed` });
                    reconnect();
                });
                socket.addEventListener(`error`, (event) => {
                    if (socket !== activeSocket) {
                        socket.close();
                        return;
                    }

                    subscribableEvents.onStateChange({ connectionStatus: `error`, error: { message: `Websocket Error`, error: event } });
                    reconnect();
                });

                // Listen for messages
                socket.addEventListener(`message`, (event) => {
                    // console.log(`socket message`, { event });
                    if (socket !== activeSocket) {
                        socket.close();
                        return;
                    }

                    const m = JSON.parse(event.data) as MessageContainer;
                    if (m.key !== channelKey || !m.message) { return; }
                    subscribable.onStateChange(m.message);
                });

                return socket;
            };

            let isClosed = false;
            let activeSocket: null | WebSocket = createSocket();
            const reconnect = () => {
                if (isClosed) { return; }

                setTimeout(() => {
                    activeSocket = createSocket();
                }, 50);
            };

            // Send Messages
            const send = (message: T) => {
                if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) {
                    throw new AppError(`Websocket is not open`);
                }
                const messageContainer: MessageContainer = {
                    message,
                    key: channelKey,
                };
                activeSocket.send(JSON.stringify(messageContainer));
            };

            return {
                send,
                isConnected: () => activeSocket?.readyState === WebSocket.OPEN,
                subscribeMessages: subscribable.subscribe,
                subscribeConnectionEvents: subscribableEvents.subscribe,
                close: () => {
                    isClosed = true;
                    activeSocket?.close();
                    activeSocket = null;
                },
            };
        },
    };

    return api;
};
