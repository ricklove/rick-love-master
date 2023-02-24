import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXR, XRState } from '@react-three/xr';
import { Group, Vector3 } from 'three';
import { useIsomorphicLayoutEffect } from '../utils/layoutEffect';
import { useCamera, usePlayer } from './camera';
import { Hud } from './hud';

export type PerspectiveKind = `1st` | `1stProjection` | `1stTo3rd` | `3rdTo1st` | `3rd` | `3rdBehind`;
export const togglePerspective = (s: PerspectiveKind): PerspectiveKind => {
  switch (s) {
    case `1st`:
      return `1stTo3rd`;
    case `1stTo3rd`:
      //   return `3rdTo1st`;
      // case `3rdTo1st`:
      //   return `1stProjection`;
      // case `1stProjection`:
      return `3rd`;
    case `3rd`:
      //   return `3rdBehind`;
      // case `3rdBehind`:
      return `1st`;
  }

  return `1st`;
};

const ScenePerspective_PlayerDolly = ({
  children,
  perspective,
}: Pick<JSX.IntrinsicElements['group'], `children`> & { perspective: PerspectiveKind }) => {
  const camera = useCamera();
  const xr = useXR();
  const { cameraDolly, playerDolly } = useMemo(() => {
    // Setup dolly
    // original player => cameraDollyRef
    // new group => playerDolly
    const cameraDolly = xr.player;
    const playerDolly = new Group();
    xr.set(() => ({ playerDolly } as unknown as XRState));

    return { cameraDolly, playerDolly };
  }, []);

  const rotate = perspective === `3rdBehind`;
  const scale = 0.3;

  useIsomorphicLayoutEffect(() => {
    if (perspective === `1st`) {
      camera.fov = 50;
      camera.updateProjectionMatrix();
      return;
    }
    camera.fov = 120;
    camera.updateProjectionMatrix();
  }, [perspective]);

  useFrame(() => {
    if (perspective === `1st`) {
      // camera dolly === playerAvatar
      cameraDolly.position.copy(playerDolly.position);
      cameraDolly.rotation.copy(playerDolly.rotation);
      return;
    }

    // CONCEPT: 1st-projection (you can move behind and forward out of yourself based on distance to dolly origin)
    // i.e. if over origin, you are lined up
    // if behind origin, 3rd person
    // if in front of origin, projected forward into walls etc

    // Move the camera dolly so that the camera is the correct distance and pointing at the player
    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);
    const toCameraDirection = new Vector3().sub(cameraDirection);
    const toCameraDirectionFlat = toCameraDirection.clone().setY(0);

    const targerDistanceToAvatar =
      perspective === `1stTo3rd`
        ? Math.max(0, 3 * camera.position.clone().setY(0).lengthSq() - 0.1)
        : perspective === `3rdTo1st`
        ? Math.max(0, 8 - 8 * camera.position.clone().setY(0).lengthSq())
        : perspective === `1stProjection`
        ? camera.position.dot(toCameraDirectionFlat)
        : 8;
    // const targerDistanceToAvatar = perspective === `1stProjection` ? camera.position.dot(toCameraDirectionFlat) : 8;

    const playerTargetFromCamera = new Vector3();
    playerTargetFromCamera.copy(cameraDirection).multiplyScalar(targerDistanceToAvatar);

    cameraDolly.position.copy(playerDolly.position).sub(playerTargetFromCamera);

    if (perspective === `1stProjection` || perspective === `1stTo3rd` || perspective === `3rdTo1st`) {
      return;
    }

    // The camera is now directly behind
    // The cameraDolly is not at the playerDolly
    // Now the rotation can be corrected:
    // - Should the camera be rotated to a fixed y height?
    // - Should the camera be rotated around to the side?

    // // TODO: Broken!
    // const TARGET_HEIGHT_ANGLE_3RD = -Math.PI * 0.15;

    // const toCameraDirectionFlat = toCameraDirection.clone().setY(0);
    // const angleToForward = toCameraDirectionFlat.angleTo(new Vector3(0, 0, -1));

    // cameraDolly.rotation.set(0, 0, 0);
    // const rotationAxis = new Vector3(0, 1, 0).cross(cameraDirection);
    // const angleToDown = cameraDirection.angleTo(new Vector3(0, -1, 0));
    // const angleDown = Math.PI * 0.5 - angleToDown;
    // const angleChange = angleDown - TARGET_ANGLE_3RD;
    // cameraDolly.rotateOnWorldAxis(rotationAxis, angleChange);

    // cameraDolly.lookAt(playerTargetFromCamera);

    // if (perspective === `3rd`) {

    // }

    // posRef.current?.position.set(0, 0, 0).sub(cameraDolly.position).sub(cameraDolly.children[0].position);
    // if (rotate) {
    //   const rotSource = cameraDolly.children[0];
    //   const direction = new Vector3();
    //   rotSource.getWorldDirection(direction);
    //   const cameraAngle = Math.atan2(direction.x, direction.z);
    //   const reverseAngle = Math.PI - cameraAngle;
    //   rotRef.current?.rotation.set(0, reverseAngle, 0);
    //   //   logger.log(`player rot.y`, { reverseAngle, cameraAngle });
    // }
  });

  return (
    <>
      {children}
      <primitive object={playerDolly} />
    </>
  );
};

export const ScenePerspective = ({
  children,
  perspective,
}: Pick<JSX.IntrinsicElements['group'], `children`> & { perspective: PerspectiveKind }) => {
  const USE_PLAYER_AVATAR = true;

  if (USE_PLAYER_AVATAR) {
    return (
      <>
        <ScenePerspective_PlayerDolly perspective={perspective}>{children}</ScenePerspective_PlayerDolly>
      </>
    );
  }

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
  const camera = useCamera();
  const player = usePlayer();
  const posRef = useRef<Group>(null);
  const rotRef = useRef<Group>(null);

  useFrame(() => {
    posRef.current?.position.set(0, 0, 0).sub(player.position).sub(camera.position);
    if (props.rotate) {
      const rotSource = camera;
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
