/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native-lite';
import { DoodleBrowseView } from './doodle-view';
import { useDoodlePartyController, DoodlePartyController } from './doodle-party-state';
import { DoodlePartyProfileView, DoodlePartyPlayerList } from './doodle-party-user-profile';
import { DoodlePartyStatusBar } from './doodle-party-components';

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

    // Waiting
    if (controller.gameState.players.some(x => !x.isReady)) {
        return (
            <PartyViewer controller={controller} />
        );
    }

    // Play View
    return (
        <DebugView controller={controller} />
    );
};

const DebugView = (props: { controller: DoodlePartyController }) => {
    const { gameState, _messages, _events } = props.controller;
    return (
        <View style={{ padding: 8 }}>
            <PartyViewer controller={props.controller} />

            <Text style={{ fontSize: 20 }}>Setup</Text>
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
    );
};

const PartyViewer = (props: { controller: DoodlePartyController }) => {
    return (
        <View>
            <Text>Players</Text>
            <DoodlePartyPlayerList controller={props.controller} />
            <Text>Rounds</Text>
            <Text>{`${props.controller.gameState.history.rounds.length}`}</Text>
            {/* <DoodleBrowseView doodles={props.controller.gameState.doodles} /> */}
        </View>
    );
};
