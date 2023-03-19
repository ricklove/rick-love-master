/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { TrackballControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import { SceneManager } from './react-with-rapier/scenes/scene-manager';

export const VrTestGame = () => {
  return (
    <>
      <div style={{ position: `fixed`, bottom: 0, top: 0, left: 0, right: 0, background: `#000000` }}>
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
      <group>
        {/* <ScenePerspective perspective={`1st`}> */}
        {/* {[...new Array(3)].map((_, i) => (
            <pointLight
              key={i}
              position={[500 - 1000 * Math.random(), 50 * Math.random(), 500 - 1000 * Math.random()]}
              color={Math.round(0xffffff * Math.random())}
              distance={300}
            />
          ))} */}
        {/* <gridHelper args={[100, 100]} /> */}
        {/* <Mover_Running /> */}
        {/* <RandomGround /> */}
        {/* <PlayerAvatarInSceneSpace /> */}

        {/* <Sphere position={[-2, 1, 0]} scale={0.02} />
          <Sphere position={[0, 1, -10]} scale={0.05} />*/}
        {/* <Sphere position={[0, 1, -90]} /> */}

        {/* <Scene00ReactWithRapier /> */}
        {/* </ScenePerspective> */}
        <SceneManager />
      </group>
    </>
  );
};
