import { Subscription } from 'utils/subscribable';
import { ErrorState } from 'utils/error';

export type WebsocketApi = {
    connect: <T>(data: WebsocketConnectionData) => {
        send: (message: T) => void;
        isConnected: () => boolean;
        subscribeMessages: (subscription: Subscription<T>) => { unsubscribe: () => void };
        subscribeConnectionEvents: (subscription: Subscription<WebsocketConnectionEvent>) => { unsubscribe: () => void };
    };
};

export type WebsocketConnectionEvent = { connectionStatus: 'opened' | 'closed' | 'error', error?: ErrorState };
export type WebsocketConnectionData = { key: string };
