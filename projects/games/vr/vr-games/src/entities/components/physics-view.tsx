import { Triplet, WorkerApi } from '@react-three/cannon';
import { CollideBeginEvent, CollideEndEvent, CollideEvent } from '@react-three/cannon';
import { Subject } from 'rxjs';
import { Vector3 } from 'three';
import { defineComponent, EntityBase } from '../core';

export type EntityPhysicsView = EntityBase & {
  transform: {
    position: Vector3;
  };
  physics: {
    uuid: string;
    api: WorkerApi;
    collideSubject: Subject<{
      entity: EntityPhysicsView;
      other?: EntityPhysicsView;
      sequence: `begin` | `end` | `continue`;
      event: CollideBeginEvent | CollideEndEvent | CollideEvent;
    }>;
    mass: number;
  };
  view: {
    debugColorRgba?: number;
    Component: (props: { entity: EntityBase }) => JSX.Element;
    batchKey?: string;
    BatchComponent?: (props: { entities: EntityBase[] }) => JSX.Element;
  };
};

const globalState = {
  physicsViews: {} as { [uuid: string]: EntityPhysicsView },
};

export const EntityPhysicsView = defineComponent<EntityPhysicsView>()
  .with(`transform`, ({ startPosition }: { startPosition?: Triplet }) => ({
    position: startPosition ? new Vector3(...startPosition) : new Vector3(),
  }))
  .with(`physics`, ({ mass }: { mass?: number }) => ({
    mass: mass ?? 0,
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
    register: (entity: EntityPhysicsView, api: WorkerApi) => {
      entity.physics.api = api;
      entity.physics.uuid = api?.uuid() ?? ``;
      // logger.log(`register`, { n: entity.name, e: entity.key, uuid: entity.physics.uuid ?? `` });

      globalState.physicsViews[entity.physics.uuid] = entity;
    },
    collide: (entity: EntityPhysicsView, event: CollideBeginEvent | CollideEndEvent | CollideEvent) => {
      const eReg = globalState.physicsViews[event.data.target];
      const other = globalState.physicsViews[event.data.body];
      const sequence = event.type === `collideBegin` ? `begin` : event.type === `collideEnd` ? `end` : `continue`;
      // logger.log(`collide`, {
      //   e: entity.name,
      //   o: other?.name,
      //   sequence,
      //   type: event.type,
      // });
      // logger.log(`collide`, {
      //   e: { n: entity.name, k: entity.key },
      //   r: { n: eReg?.name, k: eReg?.key },
      //   o: { n: other?.name, k: other?.key },
      // });
      // logger.log(`enti uuid`, {
      //   e: entity.physics.uuid,
      // });
      // logger.log(`body uuid`, {
      //   b: event.data.body,
      // });
      // logger.log(`targ uuid`, {
      //   t: event.data.target,
      // });
      entity.physics.collideSubject.next({ entity, event, other, sequence });
    },
    // getEntityKey: (o:Object3D)=>{
    //   return `${o.uuid}${suffix}`;
    // },
  });
