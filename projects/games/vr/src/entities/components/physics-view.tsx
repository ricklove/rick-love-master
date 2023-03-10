import { WorkerApi } from '@react-three/cannon';
import { CollideBeginEvent, CollideEndEvent, CollideEvent } from '@react-three/cannon';
import { Subject } from 'rxjs';
import { Vector3 } from 'three';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';

export type EntityPhysicsView = EntityBase & {
  transform: {
    position: Vector3;
  };
  physics: {
    uuid: string;
    api: WorkerApi;
    mass: number;
    collideSubject: Subject<{ entity: EntityPhysicsView; event: CollideBeginEvent | CollideEndEvent | CollideEvent }>;
  };
  view: {
    debugColor?: number;
    Component: (props: { entity: EntityBase }) => JSX.Element;
    batchKey?: string;
    BatchComponent?: (props: { entities: EntityBase[] }) => JSX.Element;
  };
};

export const EntityPhysicsView = defineComponent<EntityPhysicsView>()
  .with(`transform`, ({ startPosition }: { startPosition?: [number, number, number] }) => ({
    position: startPosition ? new Vector3(...startPosition) : new Vector3(),
  }))
  .with(`physics`, ({ mass }: { mass: number }) => ({
    mass,
    collideSubject: new Subject(),
    // Will be created by the component
    api: undefined as unknown as WorkerApi,
    uuid: ``,
  }))
  // .with(`view`, ({ debugColor }: { debugColor?: number }) => ({
  //   debugColor,
  //   Component: () => <></>,
  // }))
  .attach({
    collide: (entity: EntityPhysicsView, event: CollideBeginEvent | CollideEndEvent | CollideEvent) => {
      logger.log(`collide`, { data: event.data });
      entity.physics.collideSubject.next({ entity, event });
    },
    // getEntityKey: (o:Object3D)=>{
    //   return `${o.uuid}${suffix}`;
    // },
  });
