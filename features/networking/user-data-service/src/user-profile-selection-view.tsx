import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from '@ricklove/react-native-lite';
import { useAsyncWorker } from '@ricklove/utils-react';
import { UserDataService, UserProfileInfo } from './user-data-service';
import { UserProfileManagerView } from './user-profile-manager-view';

const styles = {
  container: {
    flexDirection: `row`,
    flexWrap: `wrap`,
    justifyContent: `space-around`,
  },
  profileContainer: {
    flexDirection: `column`,
    alignItems: `center`,
  },
  profileCharacterView: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderStyle: `solid`,
    borderColor: `#888888`,
  },
  profileCharacterText: {
    fontSize: 48,
    textAlign: `center`,
  },
  profileNameView: {},
  profileNameText: {},
} as const;

export const UserProfileSelectionView = (props: { onUserSelected: () => void }) => {
  const { loading, error, doWork } = useAsyncWorker();
  const [userProfiles, setUserProfiles] = useState(null as null | UserProfileInfo[]);
  const [isManagerVisible, setIsManagerVisible] = useState(false);

  const reload = () =>
    doWork(async (stopIfObsolete) => {
      await UserDataService.get().setup();
      stopIfObsolete();

      const profiles = await UserDataService.get().getUserProfiles();
      setUserProfiles(profiles);
    });

  const selectUser = (key: string) =>
    doWork(async (stopIfObsolete) => {
      await UserDataService.get().setActiveUser(key);
      stopIfObsolete();
      props.onUserSelected();
    });

  const onEditProfiles = () => {
    setIsManagerVisible(true);
  };

  useEffect(() => {
    reload();
  }, []);

  if (!userProfiles) {
    return <></>;
  }

  if (isManagerVisible) {
    return (
      <UserProfileManagerView
        onClose={() => {
          setIsManagerVisible(false);
          reload();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {userProfiles.map((x) => (
        <TouchableOpacity key={x.key} onPress={() => selectUser(x.key)}>
          <View style={styles.profileContainer}>
            <View style={styles.profileCharacterView}>
              <Text style={styles.profileCharacterText}>{x.emoji ?? `👤`}</Text>
            </View>
            <View style={styles.profileNameView}>
              <Text style={styles.profileNameText}>{x.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={onEditProfiles}>
        <View style={styles.profileContainer}>
          <View style={styles.profileCharacterView}>
            <Text style={styles.profileCharacterText}>{` 👤 `}</Text>
          </View>
          <View style={styles.profileNameView}>
            <Text style={styles.profileNameText}>Edit</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
