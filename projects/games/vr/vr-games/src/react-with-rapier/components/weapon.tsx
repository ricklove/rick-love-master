import React, { useRef } from 'react';
import { Cylinder, Sphere } from '@react-three/drei';
import { useFrame, Vector3 as Vector3Like } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { PlayerComponentContext } from './player';

export const Axe = ({ position }: { position: Vector3Like }) => {
  const ref = useRef<RapierRigidBody>(null);
  const palmAttachmentRef = useRef<undefined | RapierRigidBody>(undefined);
  const playerContext = PlayerComponentContext.useContext();

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    if (!palmAttachmentRef.current) {
      return;
    }

    ref.current.setTranslation(palmAttachmentRef.current.translation(), true);
    ref.current.setRotation(palmAttachmentRef.current.rotation(), true);
  });

  const attachWeapon = (palmRef: RapierRigidBody) => {
    palmAttachmentRef.current = palmRef;
  };

  return (
    <group position={position}>
      <group position={[0, 0, 0]} scale={1}>
        <RigidBody
          ref={ref}
          colliders='trimesh'
          density={0.01}
          onCollisionEnter={(e) => {
            if (!e.rigidBody) {
              return;
            }
            if (e.rigidBody === playerContext.player.staffPalmAttachment.left) {
              attachWeapon(e.rigidBody);
              return;
            }
            if (e.rigidBody === playerContext.player.staffPalmAttachment.right) {
              attachWeapon(e.rigidBody);
              return;
            }
          }}
        >
          <Sphere args={[0.05]} position={[0, 0.99, 0.05]}>
            <meshStandardMaterial color={`#c1782f`} />
          </Sphere>
          <Cylinder args={[0.03, 0.03, 1]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color={`#c1782f`} />
          </Cylinder>
          <Cylinder args={[0.2, 0.2, 0.018]} position={[0, 0.2, 0.1]} rotation={[0, 0, Math.PI * 0.5]}>
            <meshStandardMaterial color={`#959595`} />
          </Cylinder>
        </RigidBody>
        {/* <Debug /> */}
      </group>
    </group>
  );
};
