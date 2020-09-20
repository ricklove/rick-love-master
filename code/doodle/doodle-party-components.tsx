/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native-lite';
import { C } from 'controls-react';
import { groupItems } from 'utils/arrays';
import { toKeyValueArray } from 'utils/objects';
import { DoodlePartyController, PlayerState } from './doodle-party-state';
import { DoodlePartyPlayerList } from './doodle-party-user-profile';
import { DoodleGameView_DrawWord } from './doodle-components';
import { encodeDoodleDrawing, decodeDoodleDrawing } from './doodle';
import { DoodleDisplayView } from './doodle-view';

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

export const PartyViewer = (props: { controller: DoodlePartyController }) => {

    const allItems = props.controller.gameState.history.rounds.flatMap((x, iRound) => x.completed.map(y => ({ iRound, item: y, chainKey: y.assignment?.chainKey })));
    const chains = toKeyValueArray(groupItems(allItems, x => x.chainKey ?? ``)).map(x => ({ chain: x.key, items: x.value.sort((a, b) => a.iRound - b.iRound) }));

    return (
        <View>
            <Text>Players</Text>
            <DoodlePartyPlayerList controller={props.controller} />
            <Text>Rounds</Text>
            <Text>{`${props.controller.gameState.history.rounds.length}`}</Text>
            {/* {props.controller.gameState.history.rounds.map((x, i) => (
                <View key={`${i}`} style={{ flexDirection: `row`, alignItems: `center` }}>
                    {x.completed.map(p => (
                        <AssignmentView key={p.clientKey} player={p} />
                    ))}
                </View>
            ))} */}
            <Text>Chains</Text>
            <View style={{ margin: 4, padding: 4, background: `#444444` }}>
                {chains.map((x, i) => (
                    <View key={`${i}`} style={{ flexDirection: `row`, alignItems: `center` }}>
                        {x.items.map(p => (
                            <AssignmentView key={p.item.clientKey} player={p.item} />
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const AssignmentView = (props: { player: PlayerState }) => {
    const p = props.player;
    const { assignment } = props.player;
    return (
        <View style={{ flexDirection: `column`, alignItems: `center` }}>
            <Text>{p.name}</Text>
            <Text>{p.emoji}</Text>
            {assignment?.kind === `doodle` && (
                <Text style={{ color: `#FFFF00`, whiteSpace: `pre-wrap` }}>{assignment?.prompt ?? ``}</Text>
            )}
            {!!assignment?.doodle && (
                <DoodleDisplayView style={{ width: 104, height: 104, color: `#FFFFFF`, backgroundColor: `#000000` }} drawing={decodeDoodleDrawing(assignment.doodle)} shouldAnimate enableRedraw />
            )}
            {assignment?.kind === `describe` && (
                <Text style={{ color: `#FFFF00`, whiteSpace: `pre-wrap` }}>{assignment?.prompt ?? ``}</Text>
            )}
        </View>
    );
};

export const DoodlePartyPlayView = (props: { controller: DoodlePartyController }) => {
    const { gameState } = props.controller;
    const { clientKey } = gameState.client.clientPlayer;
    const assigment = gameState.players.find(x => x.clientKey === clientKey)?.assignment;
    const [text, setText] = useState(``);

    useEffect(() => {
        setText(``);
    }, [assigment]);

    if (!assigment) {
        return (
            <>
                <View style={{ padding: 8 }}>
                    <Text>Please Wait Until Next Round</Text>
                </View>
                <PartyViewer controller={props.controller} />
            </>
        );
    }

    if (assigment.kind === `describe` && assigment.doodle) {
        const onDoneDescribe = () => {
            assigment.prompt = text;
            props.controller.sendAssignment(assigment);
        };

        return (
            <>
                <View style={{ flexDirection: `column`, alignItems: `center` }}>
                    <Text style={{ fontSize: 20, margin: 8 }}>Describe</Text>
                    <DoodleDisplayView style={{ width: 312, height: 312, color: `#FFFFFF`, backgroundColor: `#000000` }} drawing={decodeDoodleDrawing(assigment.doodle)} shouldAnimate enableRedraw />
                    {!assigment.prompt && (
                        <>
                            <Text style={{ fontSize: 20, margin: 8, color: `#FFFF00` }}>What is this?</Text>
                            <C.Input_Text value={text} onChange={setText} onSubmit={onDoneDescribe} />
                            <C.Button_FieldInline onPress={onDoneDescribe}>Done</C.Button_FieldInline>
                        </>
                    )}
                    {assigment.prompt && (
                        <Text style={{ fontSize: 20, margin: 8, color: `#FFFF00` }}>{assigment.prompt}</Text>
                    )}
                </View>
            </>
        );
    }

    // Doodle
    if (assigment.doodle) {
        return (
            <>
                <View style={{ flexDirection: `column`, alignItems: `center` }}>
                    <Text style={{ fontSize: 20, margin: 8 }}>Draw</Text>
                    <DoodleDisplayView style={{ width: 312, height: 312, color: `#FFFFFF`, backgroundColor: `#000000` }} drawing={decodeDoodleDrawing(assigment.doodle)} shouldAnimate enableRedraw />
                    <Text style={{ fontSize: 20, margin: 8, color: `#FFFF00` }}>Waiting for other players</Text>
                    <ActivityIndicator size='large' color='#FFFF00' />
                </View>
            </>
        );
    }

    return (
        <>
            <Text style={{ fontSize: 20, margin: 8 }}>Draw</Text>
            <DoodleGameView_DrawWord prompt={assigment.prompt ?? ``} onDone={(x) => {
                assigment.doodle = encodeDoodleDrawing(x);
                props.controller.sendAssignment(assigment);
            }} />
        </>
    );
};
