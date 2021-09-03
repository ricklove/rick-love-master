/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from '@ricklove/react-native-lite';
import { WebsocketsApiConfig } from '@ricklove/websockets-api-client';
import { createWebMeshClient } from './web-mesh-client';

const key = `${Date.now()}${Math.random()}`;

export const WebMeshClientTestView = ({ websocketsApiConfig }: { websocketsApiConfig: WebsocketsApiConfig }) => {
  type TestMessage = {
    text?: string;
    timestamp: number;
    receivedTimestamp?: number;
    senderKey: string;
  };
  type TestState = {
    history: TestMessage[];
    clients: { key: string; lastActivityTimestamp: number }[];
  };

  const [webSocketHistory, setWebSocketHistory] = useState(
    null as null | { history: { messages: unknown[]; events: unknown[] } },
  );
  const [meshState, setMeshState] = useState(null as null | TestState);
  const [clientKey, setClientKey] = useState(null as null | string);
  const send = useRef(null as null | ((message: TestMessage) => void));

  useEffect(() => {
    const webMeshClient = createWebMeshClient<TestState, TestMessage>({
      channelKey: `test`,
      initialState: { history: [], clients: [] },
      reduceState: (prev, m) => ({ ...prev, history: [...prev.history, { ...m, receivedTimestamp: Date.now() }] }),
      reduceClientsState: (prev, clients) => ({ ...prev, clients }),
      websocketsApiConfig,
    });
    setClientKey(webMeshClient.clientKey);
    const sub = webMeshClient.subscribe((m) => {
      setMeshState(m);
    });

    send.current = webMeshClient.sendMessage;

    const refreshWebsocketHistory = setInterval(() => {
      setWebSocketHistory({
        history: {
          messages: [...webMeshClient._webSocket.history.messages],
          events: [...webMeshClient._webSocket.history.events],
        },
      });
    }, 1000);

    return () => {
      sub.unsubscribe();
      webMeshClient.close();
      clearInterval(refreshWebsocketHistory);
    };
  }, []);

  const [messageText, setMessageText] = useState(``);
  const sendMessage = () => {
    if (!send.current) {
      return;
    }
    send.current?.({ text: messageText, timestamp: Date.now(), senderKey: key });
    setMessageText(``);
  };

  return (
    <View style={{ padding: 4 }}>
      <View style={{ padding: 4 }}>
        <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Messages</Text>
        {meshState?.history.map((x, i) => (
          <View key={i} style={{ padding: 4 }}>
            <Text style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`${x.timestamp} ${
              (x?.receivedTimestamp ?? x.timestamp) - x.timestamp
            }: ${x.text ?? JSON.stringify(x)}`}</Text>
          </View>
        ))}
      </View>
      <View style={{ padding: 4 }}>
        <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Send Message</Text>
        <View style={{ flexDirection: `row`, alignItems: `center` }}>
          <View style={{ flex: 1, paddingRight: 4 }}>
            <TextInput
              style={{ fontSize: 16 }}
              value={messageText}
              onChange={setMessageText}
              keyboardType='default'
              autoCompleteType='off'
              onSubmitEditing={sendMessage}
            />
          </View>
          <TouchableOpacity onPress={sendMessage}>
            <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ padding: 4 }}>
        <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Client Key</Text>
        <View style={{ padding: 4 }}>
          <Text style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`${clientKey}`}</Text>
        </View>
        <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Clients</Text>
        {meshState?.clients.map((x, i) => (
          <View key={i} style={{ padding: 4 }}>
            <Text style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`${x.key} @ ${x.lastActivityTimestamp}`}</Text>
          </View>
        ))}
      </View>

      <View style={{ padding: 4 }}>
        <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>WebSocket Events</Text>
        {webSocketHistory?.history.events.map((x, i) => (
          <View key={i} style={{ padding: 4 }}>
            <Text style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`${JSON.stringify(x)}`}</Text>
          </View>
        ))}
      </View>
      <View style={{ padding: 4 }}>
        <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>WebSocket Messages</Text>
        {webSocketHistory?.history.messages.map((x, i) => (
          <View key={i} style={{ padding: 4 }}>
            <Text style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`${JSON.stringify(x)}`}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
