import React, { useRef } from 'react';
import { Cylinder, Sphere } from '@react-three/drei';
import { useFrame, Vector3 as Vector3Like } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { PlayerComponentContext } from './player';

export const Axe = ({ position }: { position: Vector3Like }) => {
  const ref = useRef<RapierRigidBody>(null);
  const playerContext = PlayerComponentContext.useContext();

  useFrame(() => {
    playerContext.updateAttachedWeaponTransform(ref.current);
  });

  return (
    <group position={position}>
      <group position={[0, 0.1, 0]} scale={1}>
        <RigidBody
          ref={ref}
          name={`Axe`}
          colliders='trimesh'
          density={0.01}
          onCollisionEnter={(e) => {
            playerContext.player.staffPalmAttachment.attachWeaponIfCollided({
              other: e.other.rigidBody,
              weapon: ref.current,
            });
          }}
        >
          {/* origin should be at handle */}
          <group position={[0, -0.1, 0]} scale={1}>
            <Sphere args={[0.05]} position={[0, 0.025, 0]}>
              <meshStandardMaterial color={`#c1782f`} />
            </Sphere>
            <Cylinder args={[0.03, 0.03, 1]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color={`#c1782f`} />
            </Cylinder>
            <Cylinder args={[0.2, 0.2, 0.018]} position={[0, 0.8, -0.1]} rotation={[0, 0, Math.PI * 0.5]}>
              <meshStandardMaterial color={`#959595`} />
            </Cylinder>
          </group>
        </RigidBody>
        {/* <Debug /> */}
      </group>
    </group>
  );
};
