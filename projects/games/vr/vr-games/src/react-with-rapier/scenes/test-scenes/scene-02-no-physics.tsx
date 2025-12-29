import React, { Suspense } from 'react';
import { Box } from '@react-three/drei';

export const Scene02NoPhysics = () => {
  return (
    <Suspense>
      {/* Floor */}
      <Box position={[0, -100, 0]} args={[10000, 200, 10000]}>
        <meshStandardMaterial color={0x333333} />
      </Box>
    </Suspense>
  );
};
