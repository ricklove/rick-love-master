import React, { useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { Line2 } from 'three-stdlib';
import { HandGestureResult, useGestures } from './gestures';

export const PlayerGestures = () => {
  const gestures = useGestures();

  return (
    <>
      <PlayerHandGesture gesture={gestures.left} />
      <PlayerHandGesture gesture={gestures.right} />
      <GestureLine gesture={gestures.body.moving} color={0x0000ff} length={1} />
    </>
  );
};
const PlayerHandGesture = ({ gesture }: { gesture: HandGestureResult }) => {
  return (
    <>
      <GestureLine gesture={gesture.pointingHand} color={0x0000ff} />
      {/* <GestureLineDirection
        {...gesture.pointingHand}
        direction={gesture.pointingHand._handUpDirection}
        color={0x008800}
      />
      <GestureLineDirection
        {...gesture.pointingHand}
        direction={gesture.pointingHand._handForwardDirection}
        color={0x000088}
      />
      <GestureLineDirection
        {...gesture.pointingHand}
        direction={gesture.pointingHand._handPalmDirection}
        color={0x880000}
      /> */}
      <GestureLine gesture={gesture.pointingGun} color={0xff0000} />
      <GestureLine gesture={gesture.pointingIndexFinger} color={0x00ff00} />
      <GestureLine gesture={gesture.pointingWand} color={0xff00ff} />

      <GestureFingerState gesture={gesture.fingerExtendedThumb} />
      <GestureFingerState gesture={gesture.fingerExtendedIndex} />
      <GestureFingerState gesture={gesture.fingerExtendedMiddle} />
      <GestureFingerState gesture={gesture.fingerExtendedRing} />
      <GestureFingerState gesture={gesture.fingerExtendedPinky} />
    </>
  );
};

const GestureFingerState = ({ gesture }: { gesture: HandGestureResult[`fingerExtendedIndex`] }) => {
  const length = 0.1;

  const ref = useRef<Line2>(null);

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    const o = ref.current;
    const g = gesture;

    o.visible = true;
    o.position.copy(g.position);
    o.quaternion.copy(g.quaternion);

    const color = gesture.state === `extended` ? 0x00ffff : gesture.state === `partial` ? 0xff00ff : 0x333333;
    o.material.color.set(color);
  });

  return (
    <Line
      ref={ref}
      lineWidth={1}
      points={[
        [0, 0, 0],
        [0, 0, -(length ?? 100)],
      ]}
      color={0x00ff00}
    />
  );
};

const GestureLine = ({
  gesture,
  color,
  length,
}: {
  gesture: {
    active: boolean;
    position: Vector3;
    quaternion: Quaternion;
  };
  color?: number;
  length?: number;
}) => {
  const ref = useRef<Line2>(null);

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    const o = ref.current;
    const g = gesture;

    o.visible = g.active;
    o.position.copy(g.position);
    o.quaternion.copy(g.quaternion);
  });

  return (
    <Line
      ref={ref}
      lineWidth={1}
      points={[
        [0, 0, 0],
        [0, 0, -(length ?? 100)],
      ]}
      color={color ?? 0x00ff00}
    />
  );
};

const GestureLineDirection = ({
  gesture,
  direction,
  color,
}: {
  gesture: {
    active: boolean;
    position: Vector3;
  };
  direction: () => Vector3;
  color?: number;
}) => {
  const ref = useRef<Line2>(null);

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    const o = ref.current;
    const g = gesture;

    o.visible = g.active;
    o.position.copy(g.position);
    const rotation = new Matrix4().lookAt(new Vector3(0, 0, 0), direction(), new Vector3(0, 1, 0));
    o.rotation.setFromRotationMatrix(rotation);
  });

  return (
    <Line
      ref={ref}
      lineWidth={1}
      points={[
        [0, 0, 0],
        [0, 0, -100],
      ]}
      color={color ?? 0x00ff00}
    />
  );
};
