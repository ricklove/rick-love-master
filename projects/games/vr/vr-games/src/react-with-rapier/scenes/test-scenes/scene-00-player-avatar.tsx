import React from 'react';
import { Box } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { PlayerAvatarInSceneSpace } from '../../../components/player-avatar';
import { SceneLayout } from '../scene-layout';

export const Scene00PlayerAvatar = () => {
  return (
    <SceneLayout includePlayer={false}>
      <PlayerAvatarInSceneSpace debug={true} />
      {/* Floor */}
      <RigidBody type='fixed' colliders='cuboid'>
        <Box position={[0, -100, 0]} args={[10000, 200, 10000]}>
          <meshStandardMaterial color={0x333333} />
        </Box>
      </RigidBody>
    </SceneLayout>
  );
};
