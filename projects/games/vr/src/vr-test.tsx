import React, { useState } from 'react';
import { Box, Sphere, Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { Controllers, Hands, Interactive, VRButton, XR } from '@react-three/xr';
import { Vector3 } from 'three';
import { useCamera, usePlayer } from './components/camera';
import { DebugConsole, Hud } from './components/hud';
import { PerspectiveKind, ScenePerspective } from './components/perspective';
import { PlayerAvatarInSceneSpace } from './components/player-avatar';
import { formatVector } from './utils/formatters';
import { logger } from './utils/logger';

export const VrTestGame = () => {
  const [perspective, setPerspective] = useState(`1st` as PerspectiveKind);
  const changePerspective = () => {
    setPerspective((s) => (s === `1st` ? `3rd` : s === `3rd` ? `3rdBehind` : `1st`));
  };
  return (
    <>
      <VRButton onError={(e) => console.error(e)} />
      <Canvas>
        <XR referenceSpace={`local-floor`}>
          {/* <AudioHost /> */}
          <ambientLight intensity={0.5} />
          <Hands />
          <Controllers />
          <ScenePerspective perspective={perspective}>
            <SceneContent />
          </ScenePerspective>

          <Hud position={[0, 1, 4]}>
            <DebugConsole />
          </Hud>
          <Hud position={[0.5, 0, 1]}>
            <Button position={[0, 0, 0]} text={`Change Perspective`} onClick={changePerspective} />
          </Hud>
        </XR>
      </Canvas>
    </>
  );
};

const SceneContent = () => {
  return (
    <>
      <pointLight position={[5, 5, 5]} />
      <Sphere position={[-2, 1, 0]} />
      <Sphere position={[0, 1, -10]} />
      <Sphere position={[0, 1, -90]} />
      <PlayerAvatarInSceneSpace />
      {/* <Plane receiveShadow rotation={[Math.PI * -0.5, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <shadowMaterial color={`#333333`} />
      </Plane> */}
      <gridHelper args={[100, 100]} />
      <Mover />
    </>
  );
};

const Mover = () => {
  const camera = useCamera();
  const player = usePlayer();

  useFrame(() => {
    const dir = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    player.position.add(dir.multiplyScalar(0.03));

    logger.log(`Mover`, {
      playerPos: formatVector(player.position),
      camPos: formatVector(camera.position),
    });
  });
  return <></>;
};

const Button = (props: { text: string; onClick: () => void } & Omit<JSX.IntrinsicElements['mesh'], `onClick`>) => {
  const [hover, setHover] = React.useState(false);
  const [color, setColor] = React.useState(0x123456);

  const click = () => {
    setColor(Math.floor(Math.random() * 0xffffff));
    props.onClick();
  };

  return (
    <Interactive onSelect={click} onHover={() => setHover(true)} onBlur={() => setHover(false)}>
      <Box {...props} args={[0.4, 0.1, 0.1]} scale={hover ? 1.5 : 1}>
        <meshStandardMaterial color={color} />
        <Text position={[0, 0, 0.06]} fontSize={0.05} color='#000' anchorX='center' anchorY='middle'>
          {props.text}
        </Text>
      </Box>
    </Interactive>
  );
};
