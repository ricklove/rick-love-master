import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export const HtmlOnObject = (props: { position: [number, number, number] }) => {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }
    groupRef.current.rotation.x += 0.01;
    groupRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={groupRef}>
      <mesh {...props}>
        <torusGeometry args={[1, 0.2, 12, 36]} />
        <meshStandardMaterial color={`red`} />
        <Html>
          <div
            style={{
              backgroundColor: `#ffffff`,
              border: `1px solid #888888`,
              padding: 5,
              borderRadius: 3,
            }}
          >
            Test - text
          </div>
        </Html>
      </mesh>
    </group>
  );
};
