import React, { Suspense } from 'react';
import { Box, Sphere } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';

export const Scene03PhysicsOnly = () => {
  return (
    <Suspense>
      <Physics gravity={[0, -9.8, 0]}>
        {/* Floor */}
        <RigidBody type='fixed' colliders='cuboid'>
          <Box position={[0, -100, 0]} args={[10000, 200, 10000]}>
            <meshStandardMaterial color={0x333333} />
          </Box>
        </RigidBody>
        <RigidBody colliders='ball'>
          <Sphere position={[0, 1, -5]} args={[0.5]}>
            <meshStandardMaterial color={0x00ff00} />
          </Sphere>
        </RigidBody>
      </Physics>
    </Suspense>
  );
};
