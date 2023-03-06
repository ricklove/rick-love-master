/* eslint-disable @typescript-eslint/naming-convention */
import React, { useRef, useState } from 'react';
import { Box, Sphere, Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { ARButton, Controllers, Interactive, VRButton, XR } from '@react-three/xr';
import { Vector3 } from 'three';
import { usePlayer } from './components/camera';
import { DebugConsole, Hud } from './components/hud';
import { PerspectiveKind, ScenePerspective, togglePerspective } from './components/perspective';
import { PlayerAvatarInSceneSpace } from './components/player-avatar';
import { RandomGround } from './environment/ground';
import { ExampleHtmlObject, ExampleHtmlObject_Dynamic } from './experiments/html/html-to-string-component';
import { WorldContainer } from './game';
import { GestureOptions, GesturesProvider, useGestures } from './gestures/gestures';
import { logger } from './utils/logger';

export const VrTestGame = () => {
  return (
    <>
      {/* <ARPage /> */}
      <VRPage />
    </>
  );
};

const ARPage = () => {
  return (
    <>
      <ARButton onError={(e) => console.error(e)} />
      <Canvas>
        <XR referenceSpace={`local-floor`}>
          {/* <Scene_GesturesSetup /> */}
          {/* <Scene_01_Minimal /> */}
          {/* <Scene_02_PerfGestures /> */}
          {/* <Scene_03_PerfGesturesMover /> */}
          {/* <Scene_04_PerfGesturesMoverWithGround /> */}
          <Scene_05_WithEntities />
        </XR>
      </Canvas>
    </>
  );
};

const VRPage = () => {
  return (
    <>
      <VRButton onError={(e) => console.error(e)} />
      <Canvas>
        <XR referenceSpace={`local-floor`}>
          {/* <Scene_GesturesSetup /> */}
          {/* <Scene_01_Minimal /> */}
          {/* <Scene_02_PerfGestures /> */}
          {/* <Scene_03_PerfGesturesMover /> */}
          {/* <Scene_04_PerfGesturesMoverWithGround /> */}
          <Scene_05_WithEntities />
          {/* <Scene_Experiment_01_Html /> */}
        </XR>
      </Canvas>
    </>
  );
};

// Html should only be used for static content
// that can be generated during a loading screeen
// Text is fast and can be dynamic any time
const Scene_Experiment_01_Html = () => {
  useFrame(() => {
    // Text test
    // Text is very fast - even when using setState to update
    logger.log(`frame`, {});
  });
  return (
    <>
      <GesturesProvider options={GestureOptions.all}>
        <ambientLight intensity={0.5} />
        <ScenePerspective perspective={`1st`}>
          <gridHelper args={[100, 100]} />
          <Mover_Auto />
          <Mover_Running />
          <PlayerAvatarInSceneSpace />

          <Sphere position={[-2, 1, 0]} scale={0.02} />
          <Sphere position={[0, 1, -10]} scale={0.05} />
          <Sphere position={[0, 1, -90]} />

          {/* Rendering html once is ok */}
          <ExampleHtmlObject position={[0, 1, -5]} />
          {/* Re-rendering html is very laggy and will drop frames */}
          <ExampleHtmlObject_Dynamic position={[0, 1, -8]} />
          <Hud position={[0, 1, 4]}>
            <DebugConsole />
          </Hud>
        </ScenePerspective>
      </GesturesProvider>
    </>
  );
};

// good
const Scene_01_Minimal = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <ScenePerspective perspective={`1st`}>
        <gridHelper args={[100, 100]} />
        <Mover_Auto />
      </ScenePerspective>
    </>
  );
};

// good
const Scene_02_PerfGestures = () => {
  return (
    <>
      <GesturesProvider options={GestureOptions.all}>
        <ambientLight intensity={0.5} />
        <ScenePerspective perspective={`1st`}>
          <gridHelper args={[100, 100]} />
          <Mover_Auto />
          <PlayerAvatarInSceneSpace />
        </ScenePerspective>
      </GesturesProvider>
    </>
  );
};

// good
const Scene_03_PerfGesturesMover = () => {
  return (
    <>
      <GesturesProvider options={GestureOptions.all}>
        <ambientLight intensity={0.5} />
        <ScenePerspective perspective={`1st`}>
          <gridHelper args={[100, 100]} />
          <Mover_Running />
          <PlayerAvatarInSceneSpace />
        </ScenePerspective>
      </GesturesProvider>
    </>
  );
};

// ok
const Scene_04_PerfGesturesMoverWithGround = () => {
  return (
    <>
      <GesturesProvider options={GestureOptions.all}>
        <ambientLight intensity={0.5} />
        <ScenePerspective perspective={`1st`}>
          {[...new Array(3)].map((_, i) => (
            <pointLight
              key={i}
              position={[500 - 1000 * Math.random(), 50 * Math.random(), 500 - 1000 * Math.random()]}
              color={Math.round(0xffffff * Math.random())}
              distance={300}
            />
          ))}
          <gridHelper args={[100, 100]} />
          <Mover_Running />
          <RandomGround />
          <PlayerAvatarInSceneSpace />

          <Sphere position={[-2, 1, 0]} scale={0.02} />
          <Sphere position={[0, 1, -10]} scale={0.05} />
          <Sphere position={[0, 1, -90]} />
        </ScenePerspective>

        {/* <Hud position={[0, 1, 4]}>
          <DebugConsole />
        </Hud> */}
      </GesturesProvider>
    </>
  );
};

// ?
const Scene_05_WithEntities = () => {
  return (
    <>
      <GesturesProvider options={GestureOptions.all}>
        <ambientLight intensity={0.5} />
        <ScenePerspective perspective={`1st`}>
          {[...new Array(3)].map((_, i) => (
            <pointLight
              key={i}
              position={[500 - 1000 * Math.random(), 50 * Math.random(), 500 - 1000 * Math.random()]}
              color={Math.round(0xffffff * Math.random())}
              distance={300}
            />
          ))}
          <gridHelper args={[100, 100]} />
          <Mover_Running />
          {/* <RandomGround /> */}
          <PlayerAvatarInSceneSpace />

          <Sphere position={[-2, 1, 0]} scale={0.02} />
          <Sphere position={[0, 1, -10]} scale={0.05} />
          <Sphere position={[0, 1, -90]} />

          <WorldContainer />
        </ScenePerspective>

        <Hud position={[0, 1, 4]}>
          <DebugConsole />
        </Hud>
      </GesturesProvider>
    </>
  );
};

// old
const Scene_GesturesSetup = () => {
  const [perspective, setPerspective] = useState(`1st` as PerspectiveKind);
  const changePerspective = () => {
    setPerspective((s) => togglePerspective(s));
  };
  return (
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
  );
};

const SceneContent = () => {
  return (
    <>
      {[...new Array(20)].map((_, i) => (
        <pointLight
          key={i}
          position={[500 - 1000 * Math.random(), 50 * Math.random(), 500 - 1000 * Math.random()]}
          color={Math.round(0xffffff * Math.random())}
          distance={300}
        />
      ))}
      <Sphere position={[-2, 1, 0]} scale={0.02} />
      <Sphere position={[0, 1, -10]} scale={0.05} />
      <Sphere position={[5, 1, -90]} />
      <PlayerAvatarInSceneSpace />
      {/* <Plane receiveShadow rotation={[Math.PI * -0.5, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <shadowMaterial color={`#333333`} />
      </Plane> */}
      <gridHelper args={[100, 100]} />
      <RandomGround />
      <Mover_Running />
    </>
  );
};

const Mover_Running = () => {
  // const camera = useCamera();
  const player = usePlayer();
  const gestures = useGestures();
  const velocity = useRef(new Vector3());

  useFrame(() => {
    const DISABLE = false;
    if (DISABLE) {
      return;
    }
    player.position.add(gestures.body.moving._velocity.clone().multiplyScalar((10 * 1) / 60));
  });
  return <></>;
};

const Mover_ThumbStick = () => {
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

const Mover_Auto = () => {
  const player = usePlayer();
  const velocity = useRef(new Vector3());

  useFrame(() => {
    const DISABLE = false;
    if (DISABLE) {
      return;
    }

    const now = Date.now();
    const timeToCircle = 0.1 * 1000 * Math.PI;
    const dir = new Vector3(Math.cos(now / timeToCircle), 0, Math.sin(now / timeToCircle));

    const VEL_MULT = 0.0001;
    velocity.current.multiplyScalar(1 - VEL_MULT).add(dir.multiplyScalar(VEL_MULT));

    const MAX_SPEED = 10 / 60;
    if (velocity.current.lengthSq() > MAX_SPEED * MAX_SPEED) {
      velocity.current.normalize().multiplyScalar(MAX_SPEED);
    }

    player.position.add(velocity.current);
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
