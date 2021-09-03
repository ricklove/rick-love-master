/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { DoodleConfig } from '@ricklove/doodle-common';
import { ActivityIndicator, Text, View } from '@ricklove/react-native-lite';
import { DoodlePartyPlayView, DoodlePartyStatusBar, PartyViewer } from './doodle-party-components';
import { DoodlePartyController, useDoodlePartyController } from './doodle-party-state';
import { DoodlePartyProfileView } from './doodle-party-user-profile';

export const DoodlePartyView = ({ config }: { config: DoodleConfig }) => {
  const controller = useDoodlePartyController(config);
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
    return <ActivityIndicator size='large' color='#FFFF00' />;
  }

  // Debug
  if (controller.clientState.client.role === `debug`) {
    return <DebugView controller={controller} />;
  }

  // Viewer
  if (controller.clientState.client.role === `viewer`) {
    return <PartyViewer controller={controller} />;
  }

  // Player

  // Profile
  if (mode === `profile`) {
    // console.log(`DoodlePartyView profile`, { controller });
    return <DoodlePartyProfileView controller={controller} onDone={onProfileDone} />;
  }

  // // Waiting
  // if (controller.gameState.players.some(x => !x.isReady)) {
  //     return (
  //         <PartyViewer controller={controller} />
  //     );
  // }

  // Play View
  return <DoodlePartyPlayView controller={controller} />;
};

const DebugView = (props: { controller: DoodlePartyController }) => {
  const { clientState, meshState, _events, _messages } = props.controller;

  const [_renderId, setRenderId] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRenderId((s) => s + 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <PartyViewer controller={props.controller} />
      <View style={{ marginTop: 64, background: `#555555` }}>
        <Text style={{ fontSize: 20 }}>Debug</Text>
        <View>
          <Text>{`Query: ${JSON.stringify(clientState.client._query)}`}</Text>
          <Text>{`Room: ${clientState.client.room}`}</Text>
          <Text>{`Role: ${clientState.client.role}`}</Text>
        </View>

        <View style={{ padding: 4 }}>
          <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Host</Text>
          <Text style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`'${meshState?.hostClientKey ?? ``}'`}</Text>

          <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Players</Text>
          {meshState?.players.map((x, i) => (
            <Text key={i} style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>
              {JSON.stringify(x)}
            </Text>
          ))}
        </View>

        <Text style={{ fontSize: 20 }}>Web Sockets</Text>
        <View>
          <View style={{ padding: 4 }}>
            <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Events</Text>
            {_events.map((x, i) => (
              <Text key={i} style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>
                {JSON.stringify(x)}
              </Text>
            ))}
          </View>
          <View style={{ padding: 4 }}>
            <Text style={{ whiteSpace: `pre-wrap`, fontSize: 18 }}>Messages</Text>
            {_messages.map((x, i) => (
              <Text key={i} style={{ whiteSpace: `pre-wrap`, fontSize: 14 }}>{`${x.t} ${x._r - x.t}: ${JSON.stringify(
                x,
              )}`}</Text>
            ))}
          </View>
        </View>
      </View>
    </>
  );
};
