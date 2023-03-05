import React from 'react';
import { Vector3 } from 'three';
import { usePlayer } from '../../components/camera';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { defineComponent, EntityBase } from '../core';

export type EntityPlayer = EntityBase & {
  player: {
    active: boolean;
  };
  transform: {
    position: Vector3;
  };
  view: {
    Component: (props: { entity: EntityBase }) => JSX.Element;
  };
};

export const EntityPlayer = defineComponent<EntityPlayer>()
  .with(`player`, () => ({
    active: true,
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

  useIsomorphicLayoutEffect(() => {
    // Assign transform
    entity.transform = player;
  }, []);

  return <></>;
};
