import React from 'react';
import { DefaultXRControllers, Hands, VRCanvas } from '@react-three/xr';

export const VrTestGame = () => {
  return (
    <>
      <div>Test Before</div>
      {/* <XRButton /> */}
      <VRCanvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <Hands
        // modelLeft="/hand-left.gltf"
        // modelRight="/hand-right.gltf"
        />
        <DefaultXRControllers />
      </VRCanvas>
      <div>Test After</div>
    </>
  );
};
