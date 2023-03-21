import React, { useRef } from 'react';
import { Box, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { BallCollider, RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { useCamera } from '../../components/camera';
import { calculateRotationMatrix } from '../../gestures/helpers';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { SelectableContext, SelectionMode } from './selectable';

export const SelectorStandardInput = ({ distance = 3 }: { distance?: number }) => {
  const selector = SelectableContext.useSelector();
  const camera = useCamera();
  const ref = useRef<RapierRigidBody>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    selector.setRigidbody(ref.current);
    const _getButtonKind = (button: number) => {
      switch (button) {
        case 0:
          return `left`;
        case 2:
          return `right`;
        case 1:
          return `middle`;
        default:
          return `other`;
      }
    };
    const onMouseDown = (_ev: MouseEvent) => {
      selector.setMode(SelectionMode.select);
    };
    const onMouseUp = (_ev: MouseEvent) => {
      selector.setMode(SelectionMode.hover);
    };
    const onTouchStart = (_ev: TouchEvent) => {
      selector.setMode(SelectionMode.select);
    };
    const onTouchEnd = (_ev: TouchEvent) => {
      selector.setMode(SelectionMode.hover);
    };
    document.addEventListener(`mousedown`, onMouseDown, false);
    document.addEventListener(`touchstart`, onTouchStart, false);
    document.addEventListener(`mouseup`, onMouseUp, false);
    document.addEventListener(`touchend`, onTouchEnd, false);
    return () => {
      document.removeEventListener(`mousedown`, onMouseDown, false);
      document.removeEventListener(`touchstart`, onTouchStart, false);
      document.removeEventListener(`mouseup`, onMouseUp, false);
      document.addEventListener(`touchend`, onTouchEnd, false);
    };
  }, [!ref.current]);

  const working = useRef({
    vAtScreen: new Vector3(),
    vAtDistance: new Vector3(),
    dir: new Vector3(),
    upDir: new Vector3(),
    q: new Quaternion(),
    rotationMatrix: new Matrix4(),
  });
  useFrame(({ pointer }) => {
    if (!ref.current) {
      return;
    }
    const { vAtScreen, vAtDistance, dir, upDir, q, rotationMatrix } = working.current;

    const { x, y } = pointer;
    vAtScreen.set(x, y, 0).unproject(camera);
    dir.set(x, y, 1).unproject(camera).sub(vAtScreen).normalize();

    vAtDistance.copy(dir).multiplyScalar(distance).add(vAtScreen);

    upDir
      .set(x, y + 1, 0)
      .unproject(camera)
      .sub(vAtScreen)
      .normalize();
    calculateRotationMatrix({ direction: dir, upDirection: upDir, quaternion: q, rotationMatrix });

    // logger.log(`SelectorStandardInput v`, { vAtScreen, vAtDistance, distance, x, y });
    ref.current.setNextKinematicTranslation(vAtDistance);
    ref.current.setNextKinematicRotation(q);
  });

  return (
    <>
      <RigidBody ref={ref} type='kinematicPosition' name={`SelectorStandardInput`} sensor colliders={false}>
        <BallCollider args={[0.01]} />
        <Sphere scale={0.01}>
          <meshStandardMaterial color={0xffffff} />
        </Sphere>
        <Box scale={[0.1, 0.01, 0.01]} position={[0, 0, 0]}>
          <meshStandardMaterial color={0xff0000} />
        </Box>
        <Box scale={[0.01, 0.1, 0.01]} position={[0, 0, 0]}>
          <meshStandardMaterial color={0x00ff00} />
        </Box>
        <Box scale={[0.01, 0.01, 0.1]} position={[0, 0, 0]}>
          <meshStandardMaterial color={0x0000ff} />
        </Box>
      </RigidBody>
    </>
  );
};
