import React, { useRef, useState } from 'react';
import { Box, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Object3D } from 'three';

// type Model = {
//   children?: Model;
//   type?: string;
//   position?: Vector3;
//   rotation?: Euler;
// };
type Model = Object3D;
export const DebugModel = ({ model, depth, scale }: { model: undefined | Model; depth: number; scale?: number }) => {
  const ref = useRef<Group>(null);
  const [children, setChildren] = useState([] as Object3D[]);

  useFrame(() => {
    if (!ref.current || !model) {
      return;
    }
    // ref.current.matrix.copy(model.matrix);
    // ref.current.updateMatrixWorld();
    // ref.current.position.copy(model.position);
    // ref.current.rotation.copy(model.rotation);
    // ref.current.scale.copy(model.scale);
    model.getWorldPosition(ref.current.position);
    model.getWorldQuaternion(ref.current.quaternion);
    model.getWorldScale(ref.current.scale);
    // model.traverse

    if (depth <= 0) {
      return;
    }

    setChildren((s) => (s.length === (ref.current?.children?.length ?? 0) ? s : ref.current?.children ?? []));
    // ref.current.matrix.copy(model.matrix);
  });

  if (!model) {
    return <></>;
  }

  return (
    <>
      <group ref={ref}>
        <group scale={scale ?? 0.1}>
          <Box position={[0, 0, -1]}>
            <meshStandardMaterial color={`#333333`} transparent={true} opacity={0.5} />
          </Box>
          <Sphere position={[0, 0, 0]}>
            <meshStandardMaterial color={`#55ff55`} transparent={true} opacity={0.5} />
          </Sphere>
        </group>
      </group>
      {children.map((c, i) => (
        <DebugModel key={i} model={c} depth={depth - 1} />
      ))}
    </>
  );
};
