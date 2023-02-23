import React from 'react';
import { Sphere } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Controllers, Hands, VRButton, XR } from '@react-three/xr';
import { HudDebugConsole } from './components/hud';

export const VrTestGame = () => {
  return (
    <>
      <VRButton onError={(e) => console.error(e)} />
      <Canvas>
        <XR>
          {/* <AudioHost /> */}
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} />
          <Hands />
          <Controllers />
          <Sphere position={[0, 2, -5]} />
          <HudDebugConsole position={[0, -1, 3]} />
          {/* <Weapons /> */}
          {/* <MovableBox /> */}

          {/* {false && <PlayerExample />}
          {false && <HitTestExample />} */}
          {/* <DebugInfo /> */}
          {/* <HudTest /> */}
          {/* <PhysicsContainer />
          <BillboardTests /> */}
        </XR>
      </Canvas>
    </>
  );
};
