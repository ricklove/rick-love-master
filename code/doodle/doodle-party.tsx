/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native-lite';
import { useDoodlePartyController, DoodlePartyController } from './doodle-party-state';
import { DoodlePartyProfileView } from './doodle-party-user-profile';
import { DoodlePartyStatusBar, DoodlePartyPlayView, PartyViewer } from './doodle-party-components';

export const DoodlePartyView = () => {

    const controller = useDoodlePartyController();
    return (
        <>
            <DoodlePartyStatusBar controller={controller} />
            <DoodlePartyView_Inner controller={controller} />
        </>
    );
};

export const DoodlePartyView_Inner = ({ controller }: { controller: DoodlePartyController }) => {

    const [mode, setMode] = useState(`profile` as 'profile' | 'play' | 'viewer');

    const onProfileDone = () => {
        // console.log(`onProfileDone`);
        setMode(`play`);
    };

    if (controller.loading) {
        return (
            <ActivityIndicator size='large' color='#FFFF00' />
        );
    }

    // Debug
    if (controller.gameState.client.role === `debug`) {
        return (
            <DebugView controller={controller} />
        );
    }

    // Viewer
    if (controller.gameState.client.role === `viewer`) {
        return (
            <PartyViewer controller={controller} />
        );
    }

    // Player

    // Profile
    if (mode === `profile`) {
        // console.log(`DoodlePartyView profile`, { controller });
        return (
            <DoodlePartyProfileView controller={controller} onDone={onProfileDone} />
        );
    }

    // // Waiting
    // if (controller.gameState.players.some(x => !x.isReady)) {
    //     return (
    //         <PartyViewer controller={controller} />
    //     );
    // }

    // Play View
    return (
        <DoodlePartyPlayView controller={controller} />
    );
};

const DebugView = (props: { controller: DoodlePartyController }) => {
    const { gameState, _messages, _events } = props.controller;
    return (
        <>
            <PartyViewer controller={props.controller} />
            <View style={{ marginTop: 64, background: `#555555` }}>

                <Text style={{ fontSize: 20 }}>Debug</Text>
                <View>
                    <Text>{`Query: ${JSON.stringify(gameState.client._query)}`}</Text>
                    <Text>{`Room: ${gameState.client.room}`}</Text>
                    <Text>{`Role: ${gameState.client.role}`}</Text>
                </View>
                <Text style={{ fontSize: 20 }}>Web Sockets</Text>
                <View>
                    <View style={{ padding: 4 }}>
                        <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Events</Text>
                        {_events.map((x, i) => (
                            <Text key={i} style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{JSON.stringify(x)}</Text>
                        ))}
                    </View>
                    <View style={{ padding: 4 }}>
                        <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Messages</Text>
                        {_messages.map((x, i) => (
                            <Text key={i} style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`${x.timestamp} ${x.receivedAtTimestamp - x.timestamp}: ${JSON.stringify(x)}`}</Text>
                        ))}
                    </View>
                </View>
            </View>
        </>
    );
};
