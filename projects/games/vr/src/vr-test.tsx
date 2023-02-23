import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Controllers, Hands, VRButton, XR } from '@react-three/xr';

export const VrTestGame = () => {
  return (
    <>
      <VRButton onError={(e) => console.error(e)} />
      <Canvas>
        <XR>
          {/* <AudioHost /> */}
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} />
          <Hands
          // modelLeft="/hand-left.gltf"
          // modelRight="/hand-right.gltf"
          />
          <Controllers />
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
