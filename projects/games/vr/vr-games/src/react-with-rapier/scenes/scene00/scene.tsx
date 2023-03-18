import React, { Suspense, useEffect, useState } from 'react';
import { Box, Sphere } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';

export const Scene00ReactWithRapier = () => {
  return (
    <Suspense>
      <Physics gravity={[0, -9.8, 0]} colliders='ball'>
        <group>
          {/* <HangingThing position={[2, 3.5, 0]} />
        <HangingThing position={[5, 3.5, 0]} />
        <HangingThing position={[7, 3.5, 0]} />

        <Rope length={20} /> */}

          <BallSpawner />

          <group rotation={[0, 0, Math.PI * 0.05]}>
            {/* Floor */}
            <RigidBody type='fixed' colliders='cuboid'>
              <Box position={[0, -100, 0]} args={[10000, 200, 10000]}>
                <meshStandardMaterial color={0x333333} />
              </Box>
            </RigidBody>

            {/* <CuboidCollider position={[0, 0, 0]} args={[100, 1, 100]} /> */}
          </group>

          {/* <ContactShadows scale={20} blur={0.4} opacity={0.2} position={[-0, -1.5, 0]} /> */}
        </group>
        {/* <Debug /> */}
      </Physics>
    </Suspense>
  );
};

const BallSpawner = () => {
  const [balls, setBalls] = useState([] as { key: string; position: Vector3 }[]);

  useEffect(() => {
    setInterval(() => {
      setBalls((s) => [
        ...s,
        {
          key: `${Math.random()}`,
          position: [5 + -10 * Math.random(), 5, -5 + -10 * Math.random()],
        },
      ]);
    }, 1000);
  }, []);

  return (
    <>
      {balls.map((x) => (
        <BallCreature key={x.key} position={x.position} />
      ))}
    </>
  );
};

const BallCreature = ({ position }: { position: Vector3 }) => {
  return (
    <group position={position}>
      <group position={[0, 1, 0]} scale={0.25}>
        <RigidBody>
          <Sphere>
            <meshStandardMaterial color={0x00ff00} />
          </Sphere>
          <group position={[-0.75, -0.5, 0]}>
            <Sphere args={[0.5]} position={[0, 0, 0.3]}>
              <meshStandardMaterial color={0x0000ff} />
            </Sphere>
            <Sphere args={[0.5]} position={[0, 0, -0.3]}>
              <meshStandardMaterial color={0x0000ff} />
            </Sphere>
          </group>
          <group position={[0.75, -0.5, 0]}>
            <Sphere args={[0.5]} position={[0, 0, 0.3]}>
              <meshStandardMaterial color={0x0000ff} />
            </Sphere>
            <Sphere args={[0.5]} position={[0, 0, -0.3]}>
              <meshStandardMaterial color={0x0000ff} />
            </Sphere>
          </group>
        </RigidBody>
      </group>
    </group>
  );
};
