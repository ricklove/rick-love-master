import React, { Suspense } from 'react';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { CuboidCollider, Debug, Physics } from '@react-three/rapier';

export const Scene00ReactWithRapier = () => {
  return (
    <Suspense>
      <Physics>
        <group>
          {/* <HangingThing position={[2, 3.5, 0]} />
        <HangingThing position={[5, 3.5, 0]} />
        <HangingThing position={[7, 3.5, 0]} />

        <Rope length={20} /> */}

          {/* Floor */}
          <CuboidCollider position={[0, -2.5, 0]} args={[10, 1, 10]} />

          <ContactShadows scale={20} blur={0.4} opacity={0.2} position={[-0, -1.5, 0]} />

          <OrbitControls />
        </group>
        <Debug />
      </Physics>
    </Suspense>
  );
};
