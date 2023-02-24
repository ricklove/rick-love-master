import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { Group, Vector3 } from 'three';
import { useCamera, usePlayer } from './camera';
import { Hud } from './hud';

export type PerspectiveKind = `1st` | `3rd` | `3rdBehind`;
const ScenePerspective_PlayerDolly = ({
  children,
  perspective,
}: Pick<JSX.IntrinsicElements['group'], `children`> & { perspective: PerspectiveKind }) => {
  const xr = useXR();
  const playerDollyRef = useRef(undefined as undefined | Group);
  const cameraDollyRef = useRef(undefined as undefined | Group);

  useEffect(() => {
    // Setup dolly
    // original player => cameraDollyRef
    // new group => playerDolly
    cameraDollyRef.current = xr.player;
    playerDollyRef.current = new Group();
    xr.set({ player: playerDollyRef.current });
  }, []);

  const rotate = perspective === `3rdBehind`;
  const scale = 0.3;

  useFrame(() => {
    if (!playerDollyRef.current || !cameraDollyRef.current) {
      return;
    }
    const cameraDolly = cameraDollyRef.current;

    if (perspective === `1st`) {
      // camera dolly === playerAvatar
      cameraDolly.position.copy(playerDollyRef.current.position);
      cameraDolly.rotation.copy(playerDollyRef.current.rotation);
      return;
    }

    // Move the camera dolly so that the camera is the correct position from the player
    cameraDollyRef.current.position
      .set(0, 0, 0)
      .add(playerDollyRef.current.position)
      .sub(cameraDolly.children[0].position);

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
      <primitive object={playerDollyRef.current} />
    </>
  );
};

export const ScenePerspective = ({
  children,
  perspective,
}: Pick<JSX.IntrinsicElements['group'], `children`> & { perspective: PerspectiveKind }) => {
  const USE_PLAYER_AVATAR = false;

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
