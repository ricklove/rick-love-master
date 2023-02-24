import React, { useRef } from 'react';
import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useController } from '@react-three/xr';
import { Group, Object3D } from 'three';
import { useCamera } from './camera';
import { DebugModel } from './debug-model';

/** The player relative to camera dolly */
export const PlayerAvatar = () => {
  const camera = useCamera();

  const handLSource = useController(`left`);
  const handRSource = useController(`right`);

  // const originRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const headFloorRef = useRef<Object3D>(null);
  const handLRef = useRef<Group>(null);
  const handRRef = useRef<Group>(null);

  // const referenceSpace = useThree((state) => state.gl.xr.getReferenceSpace() as XRBoundedReferenceSpace);

  useFrame(() => {
    // originRef.current?.position.set(0, 0, 0).sub(camera.position);

    headRef.current?.position.copy(camera.position);
    headRef.current?.rotation.copy(camera.rotation);
    headFloorRef.current?.position.copy(camera.position).setY(0);

    if (handLSource) {
      handLRef.current?.position.copy(handLSource.children[0].position);
      handLRef.current?.rotation.copy(handLSource.children[0].rotation);
    }
    if (handRSource) {
      handRRef.current?.position.copy(handRSource.children[0].position);
      handRRef.current?.rotation.copy(handRSource.children[0].rotation);
    }
  });

  const jointsL = [...Object.entries(handLSource?.hand.joints ?? {})];
  const jointsR = [...Object.entries(handRSource?.hand.joints ?? {})];
  // const boundsGeometry = referenceSpace?.boundsGeometry ?? [];

  return (
    <group>
      {/* <Plane rotation={[Math.PI * -0.5, 0, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial color={`#55ff55`} transparent={true} opacity={0.5} />
        </Plane> */}
      <Sphere scale={[1, 0.001, 1]}>
        <meshStandardMaterial color={`#001e39`} transparent={true} opacity={0.5} />
      </Sphere>
      <Sphere ref={headFloorRef} scale={[0.2, 0.01, 0.2]}>
        <meshStandardMaterial color={`#445244`} transparent={true} opacity={0.5} />
      </Sphere>
      <DebugModel model={camera} depth={0} scale={0.2} />
      {jointsL.map(([k, v]) => (
        <DebugModel key={k} model={v} depth={0} scale={0.01} />
      ))}
      {jointsR.map(([k, v]) => (
        <DebugModel key={k} model={v} depth={0} scale={0.01} />
      ))}
      {/* {boundsGeometry.map((p, i) => (
        <Sphere key={i} position={[p.x, p.y, p.z]}>
          <meshStandardMaterial color={`#55ff55`} transparent={true} opacity={0.5} />
        </Sphere>
      ))} */}
    </group>
  );
};
