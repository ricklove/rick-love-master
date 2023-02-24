import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { Group, Vector3 } from 'three';
import { Hud } from './hud';

export type PerspectiveKind = `1st` | `3rd` | `3rdBehind`;
export const ScenePerspective = ({
  children,
  perspective,
}: Pick<JSX.IntrinsicElements['group'], `children`> & { perspective: PerspectiveKind }) => {
  if (perspective === `1st`) {
    return <>{children}</>;
  }
  return (
    <Hud position={[0, 0, 2]}>
      <group position={[0, -0.5, 0]} rotation={[Math.PI * 0.1, 0, 0]}>
        <PlayerAsOrigin rotate={perspective === `3rdBehind`} scale={0.3}>
          {children}
        </PlayerAsOrigin>
      </group>
    </Hud>
  );
};

const PlayerAsOrigin = (
  props: Pick<JSX.IntrinsicElements['group'], `children`> & {
    rotate: boolean;
    scale: number;
  },
) => {
  const playerSource = useXR((state) => state.player);
  const posRef = useRef<Group>(null);
  const rotRef = useRef<Group>(null);

  useFrame(() => {
    posRef.current?.position.set(0, 0, 0).sub(playerSource.position).sub(playerSource.children[0].position);
    if (props.rotate) {
      const rotSource = playerSource.children[0];
      const direction = new Vector3();
      rotSource.getWorldDirection(direction);
      const cameraAngle = Math.atan2(direction.x, direction.z);
      const reverseAngle = Math.PI - cameraAngle;
      rotRef.current?.rotation.set(0, reverseAngle, 0);
      //   logger.log(`player rot.y`, { reverseAngle, cameraAngle });
    }
  });

  return (
    <group scale={props.scale}>
      <group ref={rotRef}>
        <group ref={posRef}>{props.children}</group>
      </group>
    </group>
  );
};
