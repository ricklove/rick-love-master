import React from 'react';
import { Subject } from 'rxjs';
import { Vector3 } from 'three';
import { useCamera, usePlayer } from '../../components/camera';
import { Gestures, useGestures } from '../../gestures/gestures';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { defineComponent, EntityBase } from '../core';

export type EntityPlayer = EntityBase & {
  player: {
    active: boolean;
    gestures?: Gestures;
    gesturesSubject: Subject<Gestures>;
  };
  transform: {
    position: Vector3;
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

  return <></>;
};
