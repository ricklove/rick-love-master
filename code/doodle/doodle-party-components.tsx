import React, { useState, useEffect } from 'react';
import { C } from 'controls-react';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { DoodlePartyController } from './doodle-party-state';

export const DoodlePartyStatusBar = (props: { controller: DoodlePartyController }) => {
    const { gameState } = props.controller;
    const { clientPlayer, role } = gameState.client;

    return (
        <>
            <View key={clientPlayer.clientKey} style={{ padding: 4, flexDirection: `row`, alignItems: `center` }}>
                {role === `player` && clientPlayer ? (
                    <>
                        <View style={{ width: 36 }}>
                            <Text style={{ fontSize: 24 }} >{clientPlayer.emoji}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16 }}>{clientPlayer.name}</Text>
                        </View>
                    </>
                ) : (
                        <>
                            <View>
                                <Text style={{ fontSize: 16 }}>{role}</Text>
                            </View>
                        </>
                    )}
                <View style={{ flex: 1 }} />
                {/* <View>
                    <Text style={{ fontSize: 16 }}>{gameState.client.clientPlayer.clientKey}</Text>
                </View> */}
                <View>
                    <Text style={{ fontSize: 16 }}>{gameState.masterClientKey === gameState.client.clientPlayer.clientKey ? `🟢` : ``}</Text>
                </View>
            </View>
        </>
    );
};
