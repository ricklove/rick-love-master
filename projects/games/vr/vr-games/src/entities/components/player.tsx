import React from 'react';
import { Subject } from 'rxjs';
import { Quaternion, Vector3 } from 'three';
import { useCamera, usePlayer } from '../../components/camera';
import { PlayerAvatarInSceneSpace } from '../../components/player-avatar';
import { Gestures, useGestures } from '../../gestures/gestures';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { defineComponent, EntityBase, EntityWithTransform } from '../core';

export type EntityPlayer = EntityWithTransform & {
  player: {
    active: boolean;
    gestures?: Gestures;
    gesturesSubject: Subject<Gestures>;
  };
  view: {
    Component: (props: { entity: EntityBase }) => JSX.Element;
  };
};

export const EntityPlayer = defineComponent<EntityPlayer>()
  .with(`player`, ({}: {}) => ({
    active: true,
    gestures: undefined,
    gesturesSubject: new Subject(),
  }))
  .with(`view`, () => ({
    Component: (x) => <EntityPlayerComponent entity={x.entity as EntityPlayer} />,
  }))
  .with(`transform`, ({ startPosition }: { startPosition?: [number, number, number] }) => ({
    // Will be created by the component
    position: startPosition ? new Vector3(...startPosition) : (undefined as unknown as Vector3),
    quaternion: new Quaternion(),
  }))
  .attach({
    updateInput: (entity: EntityPlayer) => {
      if (!entity.player.gestures) {
        return;
      }
      entity.player.gesturesSubject.next(entity.player.gestures);
    },
  });

export const EntityPlayerComponent = ({ entity }: { entity: EntityPlayer }) => {
  const player = usePlayer();
  const camera = useCamera();
  const gestures = useGestures();

  useIsomorphicLayoutEffect(() => {
    // Assign transform
    entity.transform.position = player.position;
    entity.player.gestures = gestures;
    entity.ready.next(true);
  }, []);

  return (
    <>
      <PlayerAvatarInSceneSpace />
    </>
  );
};

// const Mover_Running = () => {
//   // const camera = useCamera();
//   const player = usePlayer();
//   const gestures = useGestures();
//   const velocity = useRef(new Vector3());

//   useFrame(() => {
//     const DISABLE = false;
//     if (DISABLE) {
//       return;
//     }
//     player.position.add(gestures.body.moving._velocity.clone().multiplyScalar((10 * 1) / 60));
//   });
//   return <></>;
// };
