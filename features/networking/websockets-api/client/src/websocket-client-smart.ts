import { WebsocketConnectionEvent } from '@ricklove/websockets-api-common';
import { createWebsocketClient } from './websocket-client';

export const createWebsocketConnection_smart = <TWebsocketMessage>(
  config: { websocketsApiUrl: string; channelKey: string },
  messageHandler: (message: TWebsocketMessage) => void,
) => {
  const messages = [] as (TWebsocketMessage & { _r: number })[];
  const events = [] as WebsocketConnectionEvent[];
  const sendRef = {
    send: null as null | ((message: TWebsocketMessage) => void),
  };
  const outbox = [] as TWebsocketMessage[];

  const connection = createWebsocketClient({ websocketsApiUrl: config.websocketsApiUrl }).connect<TWebsocketMessage>({
    channelKey: config.channelKey,
  });

  const subMessages = connection.subscribeMessages((message) => {
    messageHandler(message);
    messages.push({ ...message, _r: Date.now() });
  });
  const subEvents = connection.subscribeConnectionEvents((event) => {
    sendRef.send = connection.isConnected() ? connection.send : null;
    events.push(event);
  });

  const sendIntervalId = setInterval(() => sendOutbox(), 250);

  const unsubscribe = () => {
    clearInterval(sendIntervalId);
    sendRef.send = null;
    subMessages.unsubscribe();
    subEvents.unsubscribe();
    connection.close();
  };

  const sendOutbox = () => {
    if (!sendRef.send) {
      return;
    }

    const o = outbox.splice(0, outbox.length);
    for (const x of o) {
      sendRef.send(x);
    }
  };

  const sendMessageWithOutbox = (message: TWebsocketMessage) => {
    if (!sendRef.send) {
      outbox.push(message);
      return;
    }

    sendOutbox();
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
