import React, { useRef, useState } from 'react';
import { Box, Line, Sphere, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useController } from '@react-three/xr';
import { Group, Object3D } from 'three';
import { PlayerGestures } from '../gestures/gestures-view';
import { useCamera, usePlayer } from './camera';

export const PlayerAvatarInSceneSpace = (props: { debug?: boolean }) => {
  const player = usePlayer();
  const playerDollyRef = useRef<Group>(null);

  useFrame(() => {
    playerDollyRef.current?.position.copy(player.position);
  });

  return (
    <group ref={playerDollyRef}>
      <PlayerAvatar {...props} />
    </group>
  );
};

/** The player relative to camera dolly */
export const PlayerAvatar = (props: { debug?: boolean }) => {
  const camera = useCamera();

  const handLSource = useController(`left`);
  const handRSource = useController(`right`);

  const headFloorRef = useRef<Object3D>(null);

  // const referenceSpace = useThree((state) => state.gl.xr.getReferenceSpace() as XRBoundedReferenceSpace);

  useFrame(() => {
    headFloorRef.current?.position.copy(camera.position).setY(0);
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
      <NodeModel model={camera} depth={0} scale={0.2} />
      {!handLSource?.hand && <NodeModel model={handLSource?.children[0]} depth={0} scale={0.1} />}
      {!handRSource?.hand && <NodeModel model={handRSource?.children[0]} depth={0} scale={0.1} />}
      {jointsL.map(([k, v]) => (
        <NodeModel key={k} model={v} depth={0} scale={0.01} name={k} />
      ))}
      {jointsR.map(([k, v]) => (
        <NodeModel key={k} model={v} depth={0} scale={0.01} name={k} />
      ))}
      {/* {boundsGeometry.map((p, i) => (
        <Sphere key={i} position={[p.x, p.y, p.z]}>
          <meshStandardMaterial color={`#55ff55`} transparent={true} opacity={0.5} />
        </Sphere>
      ))} */}
      {props.debug && <PlayerGestures />}
    </group>
  );
};

const SHOW_NAMES = false;
const SHOW_DIRECTION = false;

export const NodeModel = ({
  model,
  depth,
  scale,
  name,
}: {
  model: undefined | Object3D;
  depth: number;
  scale?: number;
  name?: string;
}) => {
  const ref = useRef<Group>(null);
  const [children, setChildren] = useState([] as Object3D[]);

  useFrame(() => {
    if (!ref.current || !model) {
      return;
    }
    // ref.current.matrix.copy(model.matrix);
    // ref.current.updateMatrixWorld();
    ref.current.position.copy(model.position);
    ref.current.rotation.copy(model.rotation);
    ref.current.scale.copy(model.scale);
    // model.getWorldPosition(ref.current.position);
    // model.getWorldQuaternion(ref.current.quaternion);
    // model.getWorldScale(ref.current.scale);
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
          {SHOW_DIRECTION && (
            <Line
              lineWidth={1}
              points={[
                [0, 0, 0],
                [0, 0, -100],
              ]}
              color={0xff0088}
            />
          )}
          <Box position={[0, 0, -0.8]} args={[1, 0.75, 1]}>
            <meshStandardMaterial color={`#333333`} transparent={true} opacity={0.5} />
          </Box>
          <Sphere position={[0, 0, 0]}>
            <meshStandardMaterial color={`#55ff55`} transparent={true} opacity={0.5} />
          </Sphere>
          {children.map((c, i) => (
            <NodeModel key={i} model={c} depth={depth - 1} />
          ))}
          {SHOW_NAMES && !!name && (
            <Text
              position={[0, 10, 0]}
              rotation={[0, 0, Math.PI * 0.5]}
              fontSize={2}
              color={`#FFFFFF`}
              anchorX={`left`}
            >
              {name || `TEST`}
            </Text>
          )}
        </group>
      </group>
    </>
  );
};
