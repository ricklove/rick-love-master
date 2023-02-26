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
  const handDirectionRef = useRef<Line2>(null);
  const pointingRef = useRef<Line2>(null);

  useFrame(() => {
    if (handDirectionRef.current) {
      const o = handDirectionRef.current;
      const g = gesture.handDirection;

      o.visible = g.active;
      o.position.copy(g.origin);

      const mx = new Matrix4().lookAt(new Vector3(0, 0, 0), g.direction, new Vector3(0, 1, 0));
      o.rotation.setFromRotationMatrix(mx);
    }
    if (pointingRef.current) {
      const o = pointingRef.current;
      const g = gesture.pointing;

      o.visible = g.active;
      o.position.copy(g.origin);

      const mx = new Matrix4().lookAt(new Vector3(0, 0, 0), g.direction, new Vector3(0, 1, 0));
      o.rotation.setFromRotationMatrix(mx);
    }
  });

  return (
    <>
      <Line
        ref={handDirectionRef}
        lineWidth={1}
        points={[
          [0, 0, 0],
          [0, 0, -100],
        ]}
        color={0xff0000}
      />
      <Line
        ref={pointingRef}
        lineWidth={1}
        points={[
          [0, 0, 0],
          [0, 0, -100],
        ]}
        color={0x00ff00}
      />
    </>
  );
};
