/* eslint-disable react/no-array-index-key */
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native-lite';
import { createWebMeshClient } from './web-mesh-client';

const key = `${Date.now()}${Math.random()}`;

export const WebMeshClientTestView = (props: {}) => {

    type TestMessage = {
        text?: string;
        timestamp: number;
        receivedTimestamp?: number;
        senderKey: string;
    };
    type TestState = {
        history: TestMessage[];
    };

    const [webSocketHistory, setWebSocketHistory] = useState(null as null | { history: { messages: unknown[], events: unknown[] } });
    const [meshState, setMeshState] = useState(null as null | TestState);
    const send = useRef(null as null | ((message: TestMessage) => void));

    useEffect(() => {
        const webMeshClient = createWebMeshClient<TestState, TestMessage>({
            channelKey: `test`,
            initialState: { history: [] },
            reduceState: (prev, m) => ({ history: [...prev.history, { ...m, receivedTimestamp: Date.now() }] }),
        });
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
        if (!send.current) { return; }
        send.current?.({ text: messageText, timestamp: Date.now(), senderKey: key });
        setMessageText(``);
    };

    return (
        <View style={{ padding: 4 }}>
            <View style={{ padding: 4 }}>
                <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Messages</Text>
                {meshState?.history.map((x, i) => (
                    <View style={{ padding: 4 }}>
                        <Text key={i} style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`${x.timestamp} ${(x?.receivedTimestamp ?? x.timestamp) - x.timestamp}: ${x.text ?? JSON.stringify(x)}`}</Text>
                    </View>
                ))}
            </View>
            <View style={{ padding: 4 }}>
                <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Send Message</Text>
                <View style={{ flexDirection: `row`, alignItems: `center` }}>
                    <View style={{ flex: 1, paddingRight: 4 }}>
                        <TextInput style={{ fontSize: 16 }} value={messageText} onChange={setMessageText} keyboardType='default' autoCompleteType='off' onSubmitEditing={sendMessage} />
                    </View>
                    <TouchableOpacity onPress={sendMessage} >
                        <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ padding: 4 }}>
                <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>WebSocket Events</Text>
                {webSocketHistory?.history.events.map((x, i) => (
                    <View style={{ padding: 4 }}>
                        <Text key={i} style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`${JSON.stringify(x)}`}</Text>
                    </View>
                ))}
            </View>
            <View style={{ padding: 4 }}>
                <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>WebSocket Messages</Text>
                {webSocketHistory?.history.messages.map((x, i) => (
                    <View style={{ padding: 4 }}>
                        <Text key={i} style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`${JSON.stringify(x)}`}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};
