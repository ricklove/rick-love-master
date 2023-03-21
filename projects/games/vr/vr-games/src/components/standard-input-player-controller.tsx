import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector2, Vector3 } from 'three';
import { calculateRotationMatrix } from '../gestures/helpers';
import { useIsomorphicLayoutEffect } from '../utils/layoutEffect';
import { useCamera, usePlayer } from './camera';

export const StandardInputPlayerControls = ({}: {}) => {
  const camera = useCamera();
  const player = usePlayer();
  const inputState = useRef({
    keys: {
      w: false,
      a: false,
      s: false,
      d: false,
    },
    mouse: {
      left: false,
      right: false,
      middle: false,
      other: false,
      isPointerLocked: false,
      /** Normalized to -1 to 1 */
      movement: new Vector2(),
      wheelMovement: new Vector2(),
    },
    touch: false,
  }).current;

  useIsomorphicLayoutEffect(() => {
    const getButtonKind = (button: number) => {
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
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key as keyof typeof inputState.keys;
      if (Object.keys(inputState.keys).includes(key)) {
        return;
      }
      inputState.keys[key] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key as keyof typeof inputState.keys;
      if (Object.keys(inputState.keys).includes(key)) {
        return;
      }
      inputState.keys[key] = false;
    };
    const onMouseDown = (e: MouseEvent) => {
      inputState.mouse[getButtonKind(e.button)] = true;
    };
    const onMouseUp = (e: MouseEvent) => {
      inputState.mouse[getButtonKind(e.button)] = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!inputState.mouse.isPointerLocked) {
        return;
      }
      inputState.mouse.movement.set((e.movementX * 2) / canvas.width, (e.movementY * -2) / canvas.height);
    };
    const onWheel = (e: WheelEvent) => {
      if (!inputState.mouse.isPointerLocked) {
        return;
      }
      inputState.mouse.wheelMovement.set(e.deltaX, e.deltaY);
    };
    const onPointerLockChanged = (e: Event) => {
      inputState.mouse.isPointerLocked = document.pointerLockElement === canvas;
    };
    const onTouchStart = (e: TouchEvent) => {
      inputState.touch = true;
    };
    const onTouchEnd = (e: TouchEvent) => {
      inputState.touch = false;
    };
    document.addEventListener(`keydown`, onKeyDown, false);
    document.addEventListener(`keyup`, onKeyUp, false);
    document.addEventListener(`mousedown`, onMouseDown, false);
    document.addEventListener(`mouseup`, onMouseUp, false);
    document.addEventListener(`mousemove`, onMouseMove, false);
    document.addEventListener(`wheel`, onWheel, false);
    document.addEventListener(`pointerlockchange`, onPointerLockChanged, false);
    document.addEventListener(`touchstart`, onTouchStart, false);
    document.addEventListener(`touchend`, onTouchEnd, false);
    const canvas = document.getElementsByTagName(`canvas`)[0];
    canvas.addEventListener(`click`, () => {
      // eslint-disable-next-line no-void
      canvas.requestPointerLock();
      //   {
      //   unadjustedMovement: true,
      // }
    });
    return () => {
      document.addEventListener(`keydown`, onKeyDown, false);
      document.addEventListener(`keydown`, onKeyUp, false);
      document.removeEventListener(`mousedown`, onMouseDown, false);
      document.removeEventListener(`mouseup`, onMouseUp, false);
      document.removeEventListener(`mousemove`, onMouseMove, false);
      document.removeEventListener(`wheel`, onWheel, false);
      document.removeEventListener(`pointerlockchange`, onPointerLockChanged, false);
      document.removeEventListener(`touchstart`, onTouchStart, false);
      document.addEventListener(`touchend`, onTouchEnd, false);
    };
  }, []);

  const working = useRef({
    mouseDelta: new Vector2(),
    wheelMovement: new Vector3(),
    vAtScreen: new Vector3(),
    // vAtDistance: new Vector3(),
    dir: new Vector3(),
    upDir: new Vector3(),
    q: new Quaternion(),
    rotationMatrix: new Matrix4(),
  });
  useFrame(({ pointer }) => {
    const {
      mouseDelta,
      wheelMovement,
      vAtScreen,
      // vAtDistance,
      dir,
      upDir,
      q,
      rotationMatrix,
    } = working.current;

    // Mouse camera angle
    // const { x, y } = pointer;
    const mouseSpeed = 5;
    const { x, y } = mouseDelta.copy(inputState.mouse.movement).multiplyScalar(mouseSpeed);
    inputState.mouse.movement.set(0, 0);
    // if (x || y) {
    //   console.log(`mouse movement`, { x, y, mouseDelta });
    // }

    vAtScreen.set(x, y, 0).unproject(camera);
    dir.set(x, y, 1).unproject(camera).sub(vAtScreen).normalize();

    // vAtDistance.copy(dir).multiplyScalar(distance).add(vAtScreen);

    upDir.set(0, 1, 0);
    // upDir
    //   .set(x, y + 1, 0)
    //   .unproject(camera)
    //   .sub(vAtScreen)
    //   .normalize();
    calculateRotationMatrix({ direction: dir, upDirection: upDir, quaternion: q, rotationMatrix });
    camera.quaternion.copy(q);

    // Mouse wheel movement
    const wheelSpeed = 0.49;
    wheelMovement
      .set(inputState.mouse.wheelMovement.x / 100, 0, inputState.mouse.wheelMovement.y / 100)
      .multiplyScalar(wheelSpeed)
      .applyQuaternion(camera.quaternion);
    inputState.mouse.wheelMovement.set(0, 0);

    // if (wheelMovement.x || wheelMovement.z) {
    //   console.log(`wheelMovement`, { wheelMovement });
    // }
    player.position.add(wheelMovement);

    // logger.log(`SelectorStandardInput v`, { vAtScreen, vAtDistance, distance, x, y });
    // ref.current.setNextKinematicTranslation(vAtDistance);
    // ref.current.setNextKinematicRotation(q);
  });

  return <></>;
};
