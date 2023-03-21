import React, { Suspense } from 'react';
import { Box } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { GestureOptions, GesturesProvider } from '../../gestures/gestures';
import { Player, PlayerComponentContext } from '../components/player';

export const SceneCrafting = () => {
  return (
    <Suspense>
      <GesturesProvider options={GestureOptions.all}>
        <Physics gravity={[0, 0, 0]} colliders='ball'>
          <PlayerComponentContext.Provider>
            <Player />
            {/* Floor */}
            <RigidBody type='fixed' colliders='cuboid'>
              <Box position={[0, -100, 0]} args={[10000, 200, 10000]}>
                <meshStandardMaterial color={0x333333} />
              </Box>
            </RigidBody>
          </PlayerComponentContext.Provider>
        </Physics>
      </GesturesProvider>
    </Suspense>
  );
};
