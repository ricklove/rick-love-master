import React, { useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Sphere, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useController, useXR } from '@react-three/xr';
import { Group, Object3D, Vector3 } from 'three';
import { logger } from '../utils/logger';
import { DebugModel } from './debug-model';

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

export const PlayerAsOrigin = (
  props: Pick<JSX.IntrinsicElements['group'], `children`> & { rotate: boolean; scale: number },
) => {
  const playerSource = useXR((state) => state.player);
  const posRef = useRef<Group>(null);
  const rotRef = useRef<Group>(null);

  useFrame(() => {
    posRef.current?.position.set(0, 0, 0).sub(playerSource.children[0].position);
    if (props.rotate) {
      const rotSource = playerSource.children[0];
      const direction = new Vector3();
      rotSource.getWorldDirection(direction);
      const cameraAngle = Math.atan2(direction.x, direction.z);
      const reverseAngle = Math.PI - cameraAngle;
      posRef.current?.rotation.set(0, reverseAngle, 0);
      logger.log(`player rot.y`, { reverseAngle, cameraAngle });
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

export const DebugConsole = () => {
  const [text, setText] = useState(``);

  useFrame(() => {
    setText(`${logger.logState.slice(0, 3).join(`\n`)}`);
  });

  return <Text>{text}</Text>;
};

export const DebugPlayerAvatar = () => {
  const playerSource = useXR((state) => state.player);
  const handLSource = useController(`left`);
  const handRSource = useController(`right`);

  // const originRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const headFloorRef = useRef<Object3D>(null);
  const handLRef = useRef<Group>(null);
  const handRRef = useRef<Group>(null);

  const referenceSpace = useThree((state) => state.gl.xr.getReferenceSpace() as XRBoundedReferenceSpace);

  useFrame(() => {
    // originRef.current?.position.set(0, 0, 0).sub(playerSource.children[0].position);

    headRef.current?.position.copy(playerSource.children[0].position);
    headRef.current?.rotation.copy(playerSource.children[0].rotation);
    headFloorRef.current?.position.copy(playerSource.children[0].position).setY(0);

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
  const boundsGeometry = referenceSpace?.boundsGeometry ?? [];

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
      <DebugModel model={playerSource.children[0]} depth={0} scale={0.2} />
      {jointsL.map(([k, v]) => (
        <DebugModel key={k} model={v} depth={0} scale={0.01} />
      ))}
      {jointsR.map(([k, v]) => (
        <DebugModel key={k} model={v} depth={0} scale={0.01} />
      ))}
      {boundsGeometry.map((p, i) => (
        <Sphere key={i} position={[p.x, p.y, p.z]}>
          <meshStandardMaterial color={`#55ff55`} transparent={true} opacity={0.5} />
        </Sphere>
      ))}
    </group>
  );
};
