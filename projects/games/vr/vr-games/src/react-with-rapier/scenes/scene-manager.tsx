import React, { Suspense, useRef, useState } from 'react';
import { Box, Sphere, Stars, Stats, Text } from '@react-three/drei';
import { useFrame, Vector3 } from '@react-three/fiber';
import { CuboidCollider, Physics, RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Billboard, Hud } from '../../components/hud';
import { ScenePerspective } from '../../components/perspective';
import { GestureOptions, GesturesProvider, useGestures } from '../../gestures/gestures';
import { DebugConsole } from '../../utils/logger';
import { Player, PlayerComponentContext } from '../components/player';
import { Scene00ReactWithRapier } from './scene00/scene';

export const SceneManager = () => {
  const [scene, setScene] = useState(undefined as undefined | { SceneComponent: () => JSX.Element });

  return (
    <GesturesProvider options={GestureOptions.all}>
      <SceneExit onExitScene={() => setScene(undefined)} />
      <Stats showPanel={0} />
      <ambientLight intensity={0.5} />
      <pointLight
        position={[5 - 10 * Math.random(), 10 + 5 * Math.random(), 5 - 10 * Math.random()]}
        color={Math.round(0xffffff * Math.random())}
        distance={30}
      />
      <ScenePerspective perspective={`1st`}>
        {!!scene && <scene.SceneComponent />}
        {!scene && <SceneSelector onChange={setScene} />}
      </ScenePerspective>
      <Hud position={[0, 1, 4]}>
        <DebugConsole visible={false} />
      </Hud>
      <SkyBox />
    </GesturesProvider>
  );
};

const SceneExit = ({ onExitScene }: { onExitScene: () => void }) => {
  const gestures = useGestures();
  useFrame(() => {
    if (
      gestures.left.fingerExtendedThumb.state === `extended` &&
      gestures.left.fingerExtendedIndex.state === `closed` &&
      gestures.left.fingerExtendedMiddle.state === `closed` &&
      gestures.left.fingerExtendedRing.state === `closed` &&
      gestures.left.fingerExtendedPinky.state === `extended` &&
      gestures.right.fingerExtendedThumb.state === `extended` &&
      gestures.right.fingerExtendedIndex.state === `closed` &&
      gestures.right.fingerExtendedMiddle.state === `closed` &&
      gestures.right.fingerExtendedRing.state === `closed` &&
      gestures.right.fingerExtendedPinky.state === `extended`
    ) {
      onExitScene();
    }
  });
  return <></>;
};

const SkyBox = () => {
  return <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />;
};

export const SceneSelector = ({ onChange }: { onChange: (scene: { SceneComponent: () => JSX.Element }) => void }) => {
  const cols = Math.ceil(Math.sqrt(scenes.length));
  const size = 1.2;

  return (
    <>
      <Sphere position={[0, 1, -90]} />
      <Suspense>
        <Physics colliders='ball' gravity={[0, 0, 0]}>
          <PlayerComponentContext.Provider>
            <Player />
            <RigidBody type='fixed' colliders='cuboid'>
              <Box position={[0, -100, 0]} args={[10000, 200, 10000]}>
                <meshStandardMaterial color={`#333333`} />
              </Box>
            </RigidBody>
            {scenes.map((x, i) => (
              <React.Fragment key={x.name}>
                <PhysicalSelection
                  text={x.name}
                  onSelect={() => onChange(x)}
                  position={[size * (i % cols), 0, -5 - size * Math.floor(i / cols)]}
                />
              </React.Fragment>
            ))}
          </PlayerComponentContext.Provider>
        </Physics>
      </Suspense>
    </>
  );
};

const scenes = [
  { name: `Scene 00 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
  { name: `Scene 01 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
  { name: `Scene 02 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
  { name: `Scene 03 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
  { name: `Scene 04 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
  { name: `Scene 05 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
];

export const PhysicalSelection = ({
  text,
  onSelect,
  position,
}: {
  text: string;
  onSelect: () => void;
  position: Vector3;
}) => {
  const ref = useRef<RapierRigidBody>(null);
  const playerContext = PlayerComponentContext.useContext();

  return (
    <group position={position}>
      <group position={[0, 0.5, 0]}>
        <RigidBody
          ref={ref}
          colliders={false}
          onCollisionEnter={(e) => {
            if (!e.rigidBody) {
              return;
            }
            if (e.rigidBody === playerContext.player.staffPalmAttachment.left) {
              onSelect();
              return;
            }
            if (e.rigidBody === playerContext.player.staffPalmAttachment.right) {
              onSelect();
              return;
            }
          }}
        >
          <CuboidCollider args={[0.5, 0.5, 0.5]} />
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial color={`#706bff`} />
          </Box>
          <Billboard>
            <Text position={[0, 0.75, 0]} fontSize={0.05}>
              {text}
            </Text>
          </Billboard>
        </RigidBody>
      </group>
    </group>
  );
};
