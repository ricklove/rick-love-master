import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { useAutoLoadingError } from 'utils-react/hooks';
import { C } from 'controls-react';
import { Icon } from 'controls-react/icon';
import { IconKind } from 'controls-react/icon-kind';
import { UserDataService, UserProfileInfo } from './user-data-service';
import { userProfileChracters } from './user-profile-emojis';


export const UserProfileManagerView = (props: { onClose?: () => void }) => {

    const { loading, error, doWork } = useAutoLoadingError();
    const [userProfiles, setUserProfiles] = useState(null as null | UserProfileInfo[]);

    const reload = () => doWork(async (stopIfObsolete) => {
        await UserDataService.get().setup();
        stopIfObsolete();

        const profiles = await UserDataService.get().getUserProfiles();
        setUserProfiles(profiles);
    });

    useEffect(() => {
        reload();
    }, []);

    return (
        <C.View_Panel>
            <C.Text_FormTitle >Users</C.Text_FormTitle>
            <C.LoadingInline loading={loading} />
            <C.ErrorBox error={error} />
            {userProfiles?.map(x => (
                <UserProfileView key={x.key} userProfile={x} onActiveUserChange={reload} onUserProfileChange={reload} />
            ))}
            <C.Text_FormTitle >Add User</C.Text_FormTitle>
            <AddUserProfileView onUserAdded={reload} />
            {!!props.onClose && (
                <C.View_FormActionRow>
                    <C.Button_FormAction onPress={() => props.onClose?.()}>Done</C.Button_FormAction>
                </C.View_FormActionRow>
            )}
        </C.View_Panel>
    );
};

const AddUserProfileView = (props: { onUserAdded: () => void }) => {
    const { loading, error, doWork } = useAutoLoadingError();
    const [shareCode, setShareCode] = useState(null as null | string);
    const addShareCode = () => {
        if (!shareCode) { return; }

        doWork(async (stopIfObsolete) => {
            await UserDataService.get().addUserFromShareCode(shareCode);
            stopIfObsolete();
            props.onUserAdded();
            setShareCode(null);
        });
    };

    return (
        <>
            <C.View_Form>
                <C.View_FieldRow>
                    <C.LoadingInline loading={loading} />
                    <C.Input_Text value={shareCode ?? ``} onChange={setShareCode} placeholder='Enter Share Code' />
                    <C.Button_FieldInline onPress={addShareCode}>Add User</C.Button_FieldInline>
                </C.View_FieldRow>
                <C.ErrorBox error={error} />
            </C.View_Form>
        </>
    );
};


const UserProfileView = ({ userProfile, onActiveUserChange, onUserProfileChange }: { userProfile: UserProfileInfo, onActiveUserChange: () => void, onUserProfileChange: () => void }) => {
    const { loading, error, doWork } = useAutoLoadingError();
    const [shareCode, setShareCode] = useState(null as null | string);
    const [characters, setCharacters] = useState(null as null | string[]);

    const createShareCode = () => doWork(async (stopIfObsolete) => {
        const result = await UserDataService.get().createShareCode(userProfile.key);
        stopIfObsolete();
        setShareCode(result.shareCode);
    });
    const makeActive = () => doWork(async (stopIfObsolete) => {
        await UserDataService.get().setActiveUser(userProfile.key);
        stopIfObsolete();
        onActiveUserChange();
    });

    const showCharacterSelection = () => {
        setCharacters(userProfileChracters);
    };
    const selectCharacter = (character: string) => doWork(async (stopIfObsolete) => {
        await UserDataService.get().setUserProfileInfo(userProfile.key, { emoji: character });

        setCharacters(null);
        onUserProfileChange();
    });

    if (characters) {
        return (
            <>
                <C.View_Form>
                    <View style={{ flexDirection: `row`, flexWrap: `wrap` }}>
                        {characters.map(x => (
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
                    <C.LoadingInline loading={loading} />
                    <TouchableOpacity onPress={makeActive}>
                        <Icon style={{ size: 32 }} kind={userProfile.isActive ? IconKind.checkChecked : IconKind.checkUnchecked} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showCharacterSelection} >
                        <View>
                            <Text style={{ fontSize: 32 }} >{userProfile.emoji}</Text>
                        </View>
                    </TouchableOpacity>
                    <UserProfileName userProfile={userProfile} onNameChange={onUserProfileChange} />
                    {!!shareCode && (
                        <C.Text_FieldLabel>{shareCode}</C.Text_FieldLabel>
                    )}
                    {!shareCode && (
                        <C.Button_FieldInline onPress={createShareCode}>Create Share Code</C.Button_FieldInline>
                    )}
                </C.View_FieldRow>
                <C.ErrorBox error={error} />
            </C.View_Form>
        </>
    );
};


export const UserProfileName = ({ userProfile, onNameChange }: { userProfile: UserProfileInfo, onNameChange: () => void }) => {
    const { loading, error, doWork } = useAutoLoadingError();
    const [name, setName] = useState(userProfile.name);
    const [isEditingName, setIsEditingName] = useState(false);

    const changeName = () => doWork(async (stopIfObsolete) => {
        console.log(`UserProfileName changeName`, { name });

        await UserDataService.get().setUserProfileInfo(userProfile.key, { name });

        setIsEditingName(false);
        onNameChange();
    });

    return (
        <>
            {!isEditingName && (
                <TouchableOpacity onPress={() => setIsEditingName(true)} >
                    <C.Text_FieldLabel>{userProfile.name}</C.Text_FieldLabel>
                </TouchableOpacity>
            )}
            {isEditingName && (
                <>
                    <C.Input_Text value={name} onChange={setName} onSubmit={changeName} />
                    <C.Button_FieldInline onPress={changeName}>Change</C.Button_FieldInline>
                </>
            )}
        </>
    );
};
