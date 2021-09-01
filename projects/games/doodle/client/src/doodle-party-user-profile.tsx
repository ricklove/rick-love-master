import React, { useState, useEffect } from 'react';
import { C } from 'controls-react';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { DoodlePartyController, PlayerState } from './doodle-party-state';

export const DoodlePartyProfileView = (props: { controller: DoodlePartyController, onDone: () => void }) => {
    const { clientPlayer } = props.controller.clientState.client;
    const [userProfile, setUserProfile] = useState({ ...clientPlayer } as UserProfileData);
    const [usedEmojis, setUsedEmojis] = useState(props.controller.meshState?.players.filter(x => x.clientKey !== clientPlayer.clientKey).map(x => x.emoji) ?? []);

    const changeUserProfile = (value: UserProfileData) => {
        setUserProfile(value);
        props.controller.setClientPlayer({ ...value, isReady: false });
    };
    const onDone = () => {
        props.controller.setClientPlayer({ ...clientPlayer, isReady: true });
        props.onDone();
    };

    useEffect(() => {
        setUsedEmojis(props.controller.meshState?.players.filter(x => x.clientKey !== clientPlayer.clientKey).map(x => x.emoji) ?? []);
    }, [props.controller.renderId]);

    // console.log(`DoodlePartyProfileView`, { userProfile, usedEmojis });
    return (
        <>
            <C.View_Panel>
                <C.Text_FormTitle >User</C.Text_FormTitle>
                <UserProfileView
                    userProfile={userProfile}
                    onUserProfileChange={changeUserProfile}
                    usedEmojis={usedEmojis}
                />
                <C.View_FormActionRow>
                    <C.Button_FormAction onPress={onDone}>Ready</C.Button_FormAction>
                </C.View_FormActionRow>
            </C.View_Panel>
            <DoodlePartyPlayerList {...props} />
        </>
    );
};

export const DoodlePartyPlayerList = (props: { controller: DoodlePartyController, hideInactive?: boolean }) => {

    const getPlayerIcon = (p: PlayerState) => {
        if (!p.isActive) return `❌`;
        if (!p.isReady) return `◻`;
        if (p.assignment && (p.assignment && (!p.assignment.doodle)) && p.assignment.kind === `doodle`) return `🎨`;
        if (p.assignment && (p.assignment && (!p.assignment.prompt)) && p.assignment.kind === `describe`) return `✏`;
        return `✔`;
    };

    return (
        <>
            <View>
                {props.controller.meshState?.players.filter(x => !props.hideInactive || x.isActive).map(x => (
                    <View key={x.clientKey} style={{ flexDirection: `row`, alignItems: `center` }}>
                        <View>
                            <Text style={{ fontSize: 24 }} >{getPlayerIcon(x)}</Text>
                        </View>
                        <View style={{ width: 48 }}>
                            <Text style={{ fontSize: 32 }} >{x.emoji}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16 }}>{x.name}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </>
    );
};

type UserProfileData = {
    name: string;
    emoji: string;
};

const userProfileEmojis = `
🐵 🐶 🐺 🐱 🦁 🐯 🦒 🦊 🦝 🐮 🐷 🐗 🐭 🐹 🐰 🐻 🐨 🐼 🐸 🦓 🐴 🦄 🐔 🐲 
🤖 👽 👻 🍕 🍔 🌭 🥓 🌮 🍖 🥩 🍦 🍩 🍰 🧁 🥝 🥥 🍒 🍓 🍄 🥦 🥑 🥕 
🚗 🚑 🚒 🚜 🦼 🚲 🚂 🛩 🚀 🛸 🛰 🪐 🧯 🧷  🪑 🛎 ☂ ⛄
`.replace(/\n/g, ``).split(` `).map(x => x.trim()).filter(x => x);

const UserProfileView = ({ userProfile, onUserProfileChange, usedEmojis }: { userProfile: UserProfileData, onUserProfileChange: (value: UserProfileData) => void, usedEmojis: string[] }) => {
    const [availableEmojis, setAvailableEmojis] = useState(userProfileEmojis);
    const [isShowingEmojiSelection, setIsShowingEmojiSelection] = useState(false);

    const selectCharacter = (emoji: string) => {
        setIsShowingEmojiSelection(false);
        onUserProfileChange({ ...userProfile, emoji });
    };

    useEffect(() => {
        setAvailableEmojis(userProfileEmojis.filter(x => !usedEmojis.includes(x)));
    }, [usedEmojis]);

    // console.log(`UserProfileView`, { usedEmojis });

    if (isShowingEmojiSelection) {
        return (
            <>
                <C.View_Form>
                    <View style={{ flexDirection: `row`, flexWrap: `wrap` }}>
                        {availableEmojis.map(x => (
                            <TouchableOpacity key={x} onPress={() => selectCharacter(x)} >
                                <View>
                                    <Text style={{ fontSize: 32 }} >{x}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </C.View_Form>
            </>
        );
    }

    return (
        <>
            <C.View_Form>
                <C.View_FieldRow>
                    <TouchableOpacity onPress={() => setIsShowingEmojiSelection(true)} >
                        <View>
                            <Text style={{ fontSize: 32 }} >{userProfile.emoji}</Text>
                        </View>
                    </TouchableOpacity>
                    <UserProfileName userProfile={userProfile} onNameChange={(x) => onUserProfileChange({ ...userProfile, name: x })} />
                </C.View_FieldRow>
            </C.View_Form>
        </>
    );
};

const UserProfileName = ({ userProfile, onNameChange }: { userProfile: UserProfileData, onNameChange: (value: string) => void }) => {
    const [name, setName] = useState(userProfile.name || `Player`);
    const [isEditing, setIsEditing] = useState(false);

    const changeName = () => {
        onNameChange(name);
        setIsEditing(false);
    };

    return (
        <>
            <C.Input_Text value={name} onChange={setName} onSubmit={changeName} onFocus={() => { setName(``); setIsEditing(true); }} />
            {isEditing && (
                <C.Button_FieldInline onPress={changeName}>Set Name</C.Button_FieldInline>
            )}
        </>
    );
};
