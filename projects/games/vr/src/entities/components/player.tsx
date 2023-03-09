import React from 'react';
import { Vector3 } from 'three';
import { useCamera, usePlayer } from '../../components/camera';
import { Gestures, useGestures } from '../../gestures/gestures';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { defineComponent, EntityBase } from '../core';

export type EntityPlayer = EntityBase & {
  player: {
    active: boolean;
    gestures?: Gestures;
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
    // will be set in component
    gestures: undefined,
  }))
  .with(`view`, () => ({
    Component: (x) => <EntityPlayerComponent entity={x.entity as EntityPlayer} />,
  }))
  .with(`transform`, ({ startPosition }: { startPosition?: [number, number, number] }) => ({
    // Will be created by the component
    position: startPosition ? new Vector3(...startPosition) : (undefined as unknown as Vector3),
  }));

export const EntityPlayerComponent = ({ entity }: { entity: EntityPlayer }) => {
  const player = usePlayer();
  const camera = useCamera();
  const gestures = useGestures();

  useIsomorphicLayoutEffect(() => {
    // Assign transform
    entity.transform.position = player.position;
    entity.player.gestures = gestures;
  }, []);

  return <></>;
};
