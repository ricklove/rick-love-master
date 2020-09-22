import { WebsocketConnectionEvent } from './types';
import { createWebsocketClient } from './websocket-client';

export const createWebsocketConnection_smart = <TWebsocketMessage>(config: { websocketsApiUrl: string, channelKey: string }, messageHandler: (message: TWebsocketMessage) => void) => {
    const messages = [] as (TWebsocketMessage & { receivedAtTimestamp: number })[];
    const events = [] as WebsocketConnectionEvent[];
    const sendRef = {
        send: null as null | ((message: TWebsocketMessage) => void),
    };
    const outbox = [] as TWebsocketMessage[];

    const connection = createWebsocketClient({ websocketsApiUrl: config.websocketsApiUrl })
        .connect<TWebsocketMessage>({ channelKey: config.channelKey });

    const unsubMessages = connection.subscribeMessages(message => {
        messageHandler(message);
        messages.push({ ...message, receivedAtTimestamp: Date.now() });
    });
    const unsubEvents = connection.subscribeConnectionEvents(event => {
        sendRef.send = connection.isConnected() ? connection.send : null;
        events.push(event);
    });

    const unsubscribe = () => {
        sendRef.send = null;
        unsubMessages.unsubscribe();
        unsubEvents.unsubscribe();
        connection.close();
    };

    const sendMessageWithOutbox = (message: TWebsocketMessage) => {
        if (!sendRef.send) {
            outbox.push(message);
            return;
        }
        for (const x of outbox) {
            sendRef.send(x);
        }
        sendRef.send(message);
    };
    return {
        send: sendMessageWithOutbox,
        unsubscribe,
        history: {
            messages,
            events,
        },
    };
};
