import { ErrorState, Subscription } from '@ricklove/utils-core';

export type WebsocketApi = {
    connect: <T>(data: WebsocketConnectionData) => {
        send: (message: T) => void;
        isConnected: () => boolean;
        subscribeMessages: (subscription: Subscription<T>) => { unsubscribe: () => void };
        subscribeConnectionEvents: (subscription: Subscription<WebsocketConnectionEvent>) => { unsubscribe: () => void };
        close: () => void;
    };
};

export type WebsocketConnectionEvent = { connectionStatus: 'opened' | 'closed' | 'error'; error?: ErrorState };
export type WebsocketConnectionData = { channelKey: string };
