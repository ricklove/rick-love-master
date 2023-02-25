import React, { useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Matrix4, Vector3 } from 'three';
import { Line2 } from 'three-stdlib';
import { GestureBitFlag, GestureResult, useHandGesture } from './hand-gestures';

export const PlayerHandGestures = () => {
  const gestures = useHandGesture(GestureBitFlag.all);

  return (
    <>
      <PlayerHandGesture gesture={gestures.left} />
      <PlayerHandGesture gesture={gestures.right} />
    </>
  );
};
const PlayerHandGesture = ({ gesture }: { gesture: GestureResult }) => {
  const pointingRef = useRef<Line2>(null);

  useFrame(() => {
    if (pointingRef.current) {
      const o = pointingRef.current;
      o.position.copy(gesture.pointing.origin);

      const mx = new Matrix4().lookAt(new Vector3(0, 0, 0), gesture.pointing.direction, new Vector3(0, 1, 0));
      o.rotation.setFromRotationMatrix(mx);
      o.visible = gesture.pointing.active;
    }
  });

  return (
    <>
      <Line
        ref={pointingRef}
        lineWidth={1}
        points={[
          [0, 0, 0],
          [0, 0, -100],
        ]}
        color={0xff0000}
      />
    </>
  );
};
