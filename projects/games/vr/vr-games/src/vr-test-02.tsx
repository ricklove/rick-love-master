/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Sphere, Stars, TrackballControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import { Hud } from './components/hud';
import { ScenePerspective } from './components/perspective';
import { GestureOptions, GesturesProvider } from './gestures/gestures';
import { Scene00ReactWithRapier } from './react-with-rapier/scenes/scene00/scene';
import { DebugConsole } from './utils/logger';

export const VrTestGame = () => {
  return (
    <>
      <div style={{ position: `fixed`, bottom: 0, top: 0, left: 0, right: 0 }}>
        {/* <ARPage /> */}
        <VRPage />
        {/* <NonVrPage /> */}
      </div>
    </>
  );
};

const VRPage = () => {
  return (
    <>
      <VRButton onError={(e) => console.error(e)} />
      <Canvas>
        <XR referenceSpace={`local-floor`}>
          <Scene_B_WithReactAndRapier />
        </XR>
      </Canvas>
    </>
  );
};

const NonVrPage = () => {
  return (
    <>
      <Canvas>
        <XR referenceSpace={`local-floor`}>
          <TrackballControls />
          <Scene_B_WithReactAndRapier />
        </XR>
      </Canvas>
    </>
  );
};

const Scene_B_WithReactAndRapier = ({ debugVisible = true }: { debugVisible?: boolean }) => {
  return (
    <>
      <GesturesProvider options={GestureOptions.all}>
        <ambientLight intensity={0.5} />
        <ScenePerspective perspective={`1st`}>
          {/* {[...new Array(3)].map((_, i) => (
            <pointLight
              key={i}
              position={[500 - 1000 * Math.random(), 50 * Math.random(), 500 - 1000 * Math.random()]}
              color={Math.round(0xffffff * Math.random())}
              distance={300}
            />
          ))} */}
          <gridHelper args={[100, 100]} />
          {/* <Mover_Running /> */}
          {/* <RandomGround /> */}
          {/* <PlayerAvatarInSceneSpace /> */}

          {/* <Sphere position={[-2, 1, 0]} scale={0.02} />
          <Sphere position={[0, 1, -10]} scale={0.05} />*/}
          <Sphere position={[0, 1, -90]} />

          <Scene00ReactWithRapier />
        </ScenePerspective>

        <Hud position={[0, 1, 4]}>
          <DebugConsole visible={debugVisible} />
        </Hud>
        <SkyBox />
      </GesturesProvider>
    </>
  );
};

const SkyBox = () => {
  // return <Environment background near={1} far={1000} resolution={256} preset='city' />;
  return <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />;
  // return <Environment background near={1} far={1000} resolution={256}  />;
};
