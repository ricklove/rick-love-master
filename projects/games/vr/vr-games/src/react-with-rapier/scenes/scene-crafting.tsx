import React from 'react';
import { Box } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { SceneLayout } from './scene-layout';

export const SceneCrafting = () => {
  return (
    <SceneLayout gravity={[0, 0, 0]}>
      {/* Floor */}
      <RigidBody type='fixed' colliders='cuboid'>
        <Box position={[0, -100, 0]} args={[10000, 200, 10000]}>
          <meshStandardMaterial color={0x333333} />
        </Box>
      </RigidBody>
    </SceneLayout>
  );
};
