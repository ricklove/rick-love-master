import React, { useRef, useState } from 'react';
import { Box, Sphere, Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { Controllers, Interactive, VRButton, XR } from '@react-three/xr';
import { Vector3 } from 'three';
import { usePlayer } from './components/camera';
import { GestureOptions, GesturesProvider, useGestures } from './components/gestures';
import { DebugConsole, Hud } from './components/hud';
import { PerspectiveKind, ScenePerspective, togglePerspective } from './components/perspective';
import { PlayerAvatarInSceneSpace } from './components/player-avatar';

export const VrTestGame = () => {
  const [perspective, setPerspective] = useState(`1st` as PerspectiveKind);
  const changePerspective = () => {
    setPerspective((s) => togglePerspective(s));
  };
  return (
    <>
      <VRButton onError={(e) => console.error(e)} />
      <Canvas>
        <XR referenceSpace={`local-floor`}>
          <GesturesProvider options={GestureOptions.all}>
            {/* <AudioHost /> */}
            <ambientLight intensity={0.5} />
            {/* <Hands /> */}
            <Controllers />
            <ScenePerspective perspective={perspective}>
              <SceneContent />
            </ScenePerspective>

            <Hud position={[0, 1, 4]}>
              <DebugConsole />
            </Hud>
            <Hud position={[0.5, 0, 1]}>
              <Button position={[0, 0, 0]} text={`Change Perspective: ${perspective}`} onClick={changePerspective} />
            </Hud>
          </GesturesProvider>
        </XR>
      </Canvas>
    </>
  );
};

const SceneContent = () => {
  return (
    <>
      <pointLight position={[5, 5, 5]} />
      <Sphere position={[-2, 1, 0]} scale={0.02} />
      <Sphere position={[0, 1, -10]} scale={0.05} />
      <Sphere position={[5, 1, -90]} />
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
  // const camera = useCamera();
  const player = usePlayer();
  const gestures = useGestures();
  const velocity = useRef(new Vector3());

  useFrame(() => {
    const DISABLE = false;
    if (DISABLE) {
      return;
    }

    const activeHand = gestures.right.pointingIndexFinger.active
      ? gestures.right
      : gestures.left.pointingIndexFinger.active
      ? gestures.left
      : undefined;

    const dir = !activeHand
      ? new Vector3()
      : new Vector3(0, 0, 0).copy(activeHand.pointingHand._handUpDirection).setY(0);

    // const ACC_MULT = 0.001;
    // const TURN_MULT = 0.001;

    // const accForce = dir
    //   .clone()
    //   .projectOnVector(activeHand.pointingHand.direction.clone().setY(0))
    //   .multiplyScalar(ACC_MULT);
    // const turnForce = dir.clone().sub(accForce).length() * TURN_MULT;
    // velocity.current.add(accForce);

    const VEL_MULT = 0.01;
    velocity.current.multiplyScalar(1 - VEL_MULT).add(dir.multiplyScalar(VEL_MULT));

    const MAX_SPEED = 10 / 60;
    if (velocity.current.lengthSq() > MAX_SPEED * MAX_SPEED) {
      velocity.current.normalize().multiplyScalar(MAX_SPEED);
    }

    //velocity.current.appl

    player.position.add(velocity.current);
    // player.rotateOnAxis(new Vector3(0, 1, 0), turnForce);

    // logger.log(`Mover`, {
    //   playerPos: formatVector(player.position),
    //   camPos: formatVector(camera.position),
    // });
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
      <Box {...props} args={[0.4, 0.3, 0.1]} scale={hover ? 1.5 : 1}>
        <meshStandardMaterial color={color} />
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.05}
          color='#000'
          anchorX='center'
          anchorY='middle'
          maxWidth={0.4}
          overflowWrap={`break-word`}
          whiteSpace={`overflowWrap`}
        >
          {props.text}
        </Text>
      </Box>
    </Interactive>
  );
};
