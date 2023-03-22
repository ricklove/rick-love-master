import React from 'react';
import { Box } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { Player } from '../../components/player';
import { SceneLayout } from '../scene-layout';

export const Scene01PlayerAvatar = () => {
  return (
    <SceneLayout includePlayer={false}>
      <Player />
      {/* Floor */}
      <RigidBody type='fixed' colliders='cuboid'>
        <Box position={[0, -100, 0]} args={[10000, 200, 10000]}>
          <meshStandardMaterial color={0x333333} />
        </Box>
      </RigidBody>
    </SceneLayout>
  );
};
