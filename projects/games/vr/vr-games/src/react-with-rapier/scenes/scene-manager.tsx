import React, { ReactNode, useState } from 'react';
import { Box, Sphere, Stars, Stats, Text } from '@react-three/drei';
import { useFrame, Vector3 } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useCamera, usePlayer } from '../../components/camera';
import { Billboard, Hud } from '../../components/hud';
import { ScenePerspective } from '../../components/perspective';
import { GestureOptions, GesturesProvider, useGestures } from '../../gestures/gestures';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { DebugConsole } from '../../utils/logger';
import { SelectableContext, SelectionMode } from '../components/selectable';
import { SceneCrafting } from './scene-crafting';
import { SceneLayout } from './scene-layout';
import { Scene00ReactWithRapier } from './scene00/scene';
import { Scene00PlayerAvatar } from './test-scenes/scene-00-player-avatar';
import { Scene01PlayerAvatar } from './test-scenes/scene-01-player';
import { Scene02NoPhysics } from './test-scenes/scene-02-no-physics';
import { Scene03PhysicsOnly } from './test-scenes/scene-03-physics-only';

export const SceneManager = () => {
  const [scene, setScene] = useState(defaultScene as undefined | { SceneComponent: () => JSX.Element });

  return (
    <GesturesProvider options={GestureOptions.all}>
      <Stats showPanel={0} />
      <ambientLight intensity={0.5} />
      <pointLight
        position={[5 - 10 * Math.random(), 10 + 5 * Math.random(), 5 - 10 * Math.random()]}
        color={Math.round(0xffffff * Math.random())}
        distance={30}
      />
      <ScenePerspective perspective={`1st`}>
        <SceneExit onExitScene={() => setScene(undefined)} />
        {!!scene && (
          <ScenePlayerReset>
            <scene.SceneComponent />
          </ScenePlayerReset>
        )}
        {!scene && (
          <ScenePlayerReset>
            <SceneSelector onChange={setScene} />
          </ScenePlayerReset>
        )}
      </ScenePerspective>
      <Hud position={[0, 1, 4]}>
        <DebugConsole visible={false} />
      </Hud>
      <SkyBox />
    </GesturesProvider>
  );
};

const ScenePlayerReset = ({ children }: { children: ReactNode }) => {
  const player = usePlayer();
  const camera = useCamera();

  useIsomorphicLayoutEffect(() => {
    player.position.set(0, 0, 0);
    if (camera.position.y === 0) {
      camera.position.set(0, 1, 0);
    }
  }, []);

  return <>{children}</>;
};

const SceneExit = ({ onExitScene }: { onExitScene: () => void }) => {
  const gestures = useGestures();

  useIsomorphicLayoutEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase().startsWith(`esc`)) {
        onExitScene();
      }
    };
    document.addEventListener(`keydown`, onKeyDown, false);
    return () => {
      document.removeEventListener(`keydown`, onKeyDown, false);
    };
  }, []);
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
      <SceneLayout>
        <RigidBody name={`Ground`} type='fixed' colliders='cuboid'>
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
      </SceneLayout>
    </>
  );
};

const scenes = [
  { name: Scene00PlayerAvatar.name, SceneComponent: Scene00PlayerAvatar },
  { name: Scene01PlayerAvatar.name, SceneComponent: Scene01PlayerAvatar },
  { name: Scene02NoPhysics.name, SceneComponent: Scene02NoPhysics },
  { name: Scene03PhysicsOnly.name, SceneComponent: Scene03PhysicsOnly },
  { name: SceneCrafting.name, SceneComponent: SceneCrafting },
  { name: `Scene 00 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
  { name: `Scene 00 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
  //   { name: `Scene 01 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
  //   { name: `Scene 02 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
  //   { name: `Scene 03 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
  //   { name: `Scene 04 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
  //   { name: `Scene 05 - Alien Eggs and Axes`, SceneComponent: Scene00ReactWithRapier },
];
const defaultScene = undefined;
// const defaultScene = scenes[2];

export const PhysicalSelection = ({
  text,
  onSelect,
  position,
}: {
  text: string;
  onSelect: () => void;
  position: Vector3;
}) => {
  const [color, setColor] = useState(`#706bff`);
  const selectable = SelectableContext.useSelectable(({ event, mode }) => {
    const color = mode === SelectionMode.hover ? `#8c8acb` : mode === SelectionMode.select ? `#2e2d4d` : `#706bff`;
    setColor(color);
    // logger.log(`useSelectable`, { mode, color });

    if (event === `select-enter`) {
      onSelect();
    }
  });

  return (
    <group position={position}>
      <group position={[0, 0.5, 0]}>
        <RigidBody name={`PhysicalSelection-${text}`} colliders={false} {...selectable} sensor gravityScale={0}>
          <CuboidCollider args={[0.5, 0.5, 0.5]} />
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial color={color} />
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
