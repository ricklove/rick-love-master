/* eslint-disable react/no-array-index-key */
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native-lite';
import { createWebsocketClient } from './websocket-client';
import { websocketsApiConfig } from './config';
import { WebsocketConnectionEvent } from './types';

const key = `${Date.now()}${Math.random()}`;

export const WebsocketClientTestView = (props: {}) => {

    type TestMessage = {
        text?: string;
        timestamp: number;
        senderKey: string;
    };
    const [messages, setMessages] = useState([] as (TestMessage & { receivedAtTimestamp: number })[]);
    const [events, setEvents] = useState([] as WebsocketConnectionEvent[]);
    const send = useRef(null as null | ((message: TestMessage) => void));


    useEffect(() => {
        const connection = createWebsocketClient({ websocketsApiUrl: websocketsApiConfig.websocketsApiUrl })
            .connect<TestMessage>({ key: `test` });

        send.current = connection.send;

        const unsubMessages = connection.subscribeMessages(message => {

            setMessages(s => [...s, { ...message, receivedAtTimestamp: Date.now() }]);
        });
        const unsubEvents = connection.subscribeConnectionEvents(event => {
            setEvents(s => [...s, event]);
        });
        return () => {
            send.current = null;
            unsubMessages.unsubscribe();
            unsubEvents.unsubscribe();
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
                <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Events</Text>
                {events.map((x, i) => (
                    <Text key={i} style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{JSON.stringify(x)}</Text>
                ))}
            </View>
            <View style={{ padding: 4 }}>
                <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Messages</Text>
                {messages.map((x, i) => (
                    <Text key={i} style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`${x.timestamp} ${x.receivedAtTimestamp - x.timestamp}: ${x.text ?? JSON.stringify(x)}`}</Text>
                ))}
            </View>
            <View style={{ padding: 4 }}>
                <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Send Message</Text>
                <View style={{ flexDirection: `row`, alignItems: `center` }}>
                    <View style={{ flex: 1, paddingRight: 4 }}>
                        <TextInput style={{ fontSize: 16 }} value={messageText} onChange={setMessageText} keyboardType='default' autoCompleteType='off' onBlur={sendMessage} onSubmitEditing={sendMessage} />
                    </View>
                    <TouchableOpacity onPress={sendMessage} >
                        <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
