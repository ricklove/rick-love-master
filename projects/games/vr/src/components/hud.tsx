import React, { useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { Group, Vector3 } from 'three';
import { logger } from '../utils/logger';

type BillboardProps = {
  follow?: boolean;
  lockX?: boolean;
  lockY?: boolean;
  lockZ?: boolean;
} & JSX.IntrinsicElements['group'];

export const Billboard: React.FC<BillboardProps> = React.forwardRef(
  ({ follow = true, lockX = false, lockY = false, lockZ = false, ...props }, ref) => {
    const player = useXR((state) => state.player);

    const localRef = React.useRef<Group>();
    useFrame(() => {
      if (!follow || !localRef.current) return;

      // save previous rotation in case we're locking an axis
      const prevRotation = localRef.current.rotation.clone();

      // always face the player
      player.children[0].getWorldQuaternion(localRef.current.quaternion);

      // readjust any axis that is locked
      if (lockX) localRef.current.rotation.x = prevRotation.x;
      if (lockY) localRef.current.rotation.y = prevRotation.y;
      if (lockZ) localRef.current.rotation.z = prevRotation.z;
    });
    return <group ref={mergeRefs([localRef, ref])} {...props} />;
  },
);

export const Hud2: React.FC<BillboardProps> = React.forwardRef(
  ({ follow = true, lockX = false, lockY = false, lockZ = false, ...props }, ref) => {
    const player = useXR((state) => state.player);

    const localRef = React.useRef<Group>();
    useFrame(() => {
      if (!follow || !localRef.current) return;

      // save previous rotation in case we're locking an axis
      const prevRotation = localRef.current.rotation.clone();

      // always face the player
      player.children[0].getWorldPosition(localRef.current.position);

      const positionPlayer = localRef.current.position.clone();
      // const frontDirection = new Vector3().sub(new Vector3(0, 0, 1).applyEuler(player.children[0].rotation));
      // const frontProjection = frontDirection.clone().add(positionPlayer);
      const positionOriginal = Array.isArray(props.position)
        ? new Vector3(...props.position)
        : typeof props.position === `object`
        ? props.position
        : undefined ?? new Vector3();
      const positionOriginalMirrored = positionOriginal.clone().multiply(new Vector3(-1, -1, 1));
      const projectedOrignalPosition = new Vector3().sub(
        positionOriginalMirrored.clone().applyEuler(player.children[0].rotation),
      );
      const positionFinal = projectedOrignalPosition.clone().add(positionPlayer);

      localRef.current.position.copy(positionFinal);
      player.children[0].getWorldQuaternion(localRef.current.quaternion);

      // logger.log(`BillboardHud`, {
      //   frontDirection: formatVector(frontDirection),
      //   // frontProjection: formatVector(frontProjection),
      //   positionActual: formatVector(localRef.current.position),
      //   positionFinal: formatVector(positionFinal),
      //   positionOriginal: formatVector(positionOriginal),
      //   positionPlayer: formatVector(positionPlayer),
      // });

      // readjust any axis that is locked
      if (lockX) localRef.current.rotation.x = prevRotation.x;
      if (lockY) localRef.current.rotation.y = prevRotation.y;
      if (lockZ) localRef.current.rotation.z = prevRotation.z;
    });
    return <group ref={mergeRefs([localRef, ref])} {...props} />;
  },
);

export const Hud = (props: JSX.IntrinsicElements['group']) => {
  const player = useXR((state) => state.player);

  const ref = React.useRef<Group>(null);
  useFrame(() => {
    if (!ref.current) return;

    // always face the player
    player.children[0].getWorldPosition(ref.current.position);

    const positionPlayer = ref.current.position.clone();
    // const frontDirection = new Vector3().sub(new Vector3(0, 0, 1).applyEuler(player.children[0].rotation));
    // const frontProjection = frontDirection.clone().add(positionPlayer);
    const positionOriginal = Array.isArray(props.position)
      ? new Vector3(...props.position)
      : typeof props.position === `object`
      ? props.position
      : undefined ?? new Vector3();
    const positionOriginalMirrored = positionOriginal.clone().multiply(new Vector3(-1, -1, 1));
    const projectedOrignalPosition = new Vector3().sub(
      positionOriginalMirrored.clone().applyEuler(player.children[0].rotation),
    );
    const positionFinal = projectedOrignalPosition.clone().add(positionPlayer);

    ref.current.position.copy(positionFinal);
    player.children[0].getWorldQuaternion(ref.current.quaternion);
  });

  return <group ref={ref} {...props} />;
};

export const DebugConsole = () => {
  const [text, setText] = useState(``);

  useFrame(() => {
    setText(`${logger.logState.slice(0, 3).join(`\n`)}`);
  });

  return <Text>{text}</Text>;
};
