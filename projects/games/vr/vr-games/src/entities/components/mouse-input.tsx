import React from 'react';
import { useFrame } from '@react-three/fiber';
import { Subject } from 'rxjs';
import { Vector3 } from 'three';
import { useCamera } from '../../components/camera';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { defineComponent, EntityBase } from '../core';

export type EntityMouseInput = EntityBase & {
  mouseInput: {
    position: Vector3;
    direction: Vector3;
    buttonsSubject: Subject<{
      kind: `left` | `right` | `middle` | `other`;
      sequence: `begin` | `end`;
    }>;
  };
  view: {
    Component: (props: { entity: EntityBase }) => JSX.Element;
  };
};

export const EntityMouseInput = defineComponent<EntityMouseInput>()
  .with(`mouseInput`, ({}: {}) => ({
    position: new Vector3(),
    direction: new Vector3(),
    buttonsSubject: new Subject(),
  }))
  .with(`view`, () => ({
    Component: (x) => <EntityMouseInputComponent entity={x.entity as EntityMouseInput} />,
  }));

export const EntityMouseInputComponent = ({ entity }: { entity: EntityMouseInput }) => {
  const camera = useCamera();

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
    const onMouseDown = (ev: MouseEvent) => {
      entity.mouseInput.buttonsSubject.next({ kind: getButtonKind(ev.button), sequence: `begin` });
    };
    const onMouseUp = (ev: MouseEvent) => {
      entity.mouseInput.buttonsSubject.next({ kind: getButtonKind(ev.button), sequence: `end` });
    };
    document.addEventListener(`mousedown`, onMouseDown, false);
    document.addEventListener(`mouseup`, onMouseUp, false);
    return () => {
      document.removeEventListener(`mousedown`, onMouseDown, false);
      document.removeEventListener(`mouseup`, onMouseUp, false);
    };
  }, []);

  useFrame(({ pointer }) => {
    const { x, y } = pointer;
    entity.mouseInput.position.set(x, y, 0).unproject(camera);
    entity.mouseInput.direction.set(x, y, 1).unproject(camera).sub(entity.mouseInput.position).normalize();
  });

  return <></>;
};
