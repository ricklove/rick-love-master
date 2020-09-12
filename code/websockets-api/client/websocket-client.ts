import { createSubscribable } from 'utils/subscribable';
import { AppError } from 'utils/error';
import { WebsocketApi, WebsocketConnectionEvent, WebsocketConnectionData } from './types';

export const createWebsocketClient = (config: { websocketsApiUrl: string }): WebsocketApi => {

    const api: WebsocketApi = {
        connect: <T>({ key }: WebsocketConnectionData) => {
            // With this implementation, the server simply echos all messages to all clients
            // The client will filter those messages client-side with the key
            // NOTE: When the server filters via keys (providing privacy), this will continue to work without changes

            type MessageContainer = {
                message: T;
                key: string;
            };

            const subscribable = createSubscribable<T>();
            const subscribableEvents = createSubscribable<WebsocketConnectionEvent>();

            // Connect to websocket (and reconnect, etc.)
            let socket = new WebSocket(`${config.websocketsApiUrl}`);

            // Connection opened
            socket.addEventListener(`open`, (event) => {
                subscribableEvents.onStateChange({ connectionStatus: `opened` });
            });
            socket.addEventListener(`close`, (event) => {
                subscribableEvents.onStateChange({ connectionStatus: `closed` });

                // Try to reconnect
                setTimeout(() => {
                    socket = new WebSocket(config.websocketsApiUrl);
                }, 50);
            });
            socket.addEventListener(`error`, (event) => {
                subscribableEvents.onStateChange({ connectionStatus: `error`, error: { message: `Websocket Error`, error: event } });

                // Try to reconnect
                setTimeout(() => {
                    socket = new WebSocket(config.websocketsApiUrl);
                }, 50);
            });

            // Listen for messages
            socket.addEventListener(`message`, (event) => {
                const m = JSON.parse(event.data) as MessageContainer;
                if (m.key !== key) { return; }
                subscribable.onStateChange(m.message);
            });

            // Send Messages
            const send = (message: T) => {
                if (socket.readyState !== WebSocket.OPEN) {
                    throw new AppError(`Websocket is not open`);
                }
                const messageContainer: MessageContainer = {
                    message,
                    key,
                };
                socket.send(JSON.stringify(messageContainer));
            };

            return {
                send,
                subscribeMessages: subscribable.subscribe,
                subscribeConnectionEvents: subscribableEvents.subscribe,
            };
        },
    };

    return api;
};
