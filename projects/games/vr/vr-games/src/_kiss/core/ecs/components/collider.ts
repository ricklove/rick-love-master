import { Collider, ColliderDesc, World } from '@dimforge/rapier3d-compat';
import { createComponentFactory } from '../ecs-component-factory';
import { EntityInstance_RigidBody } from './rigid-body';
import { Entity_ShapeBox } from './shape-box';
import { Entity_ShapeSphere } from './shape-sphere';

export type Entity_Collider = {
  collider: {
    restitution?: number;
    friction?: number;
    colliderEvents?: boolean;
    sensor?: boolean;
  };
};

export type EntityInstance_Collider = {
  collider: {
    collider: Collider;
  };
};

export type Entity_Shape = Entity_ShapeBox | Entity_ShapeSphere;

export const colliderComponentFactory = ({ world }: { world: World }) =>
  createComponentFactory<Entity_Shape, Entity_Collider, EntityInstance_Collider, EntityInstance_RigidBody>()(
    `collider`,
    () => {
      return {
        addComponent: (
          entity,
          {
            restitution,
            friction,
            colliderEvents,
            sensor,
          }: {
            restitution?: number;
            friction?: number;
            colliderEvents?: boolean;
            sensor?: boolean;
          },
        ) => {
          return {
            ...entity,
            collider: {
              restitution,
              friction,
              colliderEvents,
              sensor,
            },
          };
        },
        setup: (entityInstance, parentInstance) => {
          const entity = entityInstance.desc;
          let colliderDesc =
            entity.shape.kind === `box`
              ? ColliderDesc.cuboid(...entity.shape.scale)
              : entity.shape.kind === `sphere`
              ? ColliderDesc.ball(entity.shape.radius)
              : undefined;

          if (!colliderDesc) throw new Error(`ColliderDesc not defined`);

          if (entity.collider.restitution) {
            colliderDesc = colliderDesc.setRestitution(entity.collider.restitution);
          }
          if (entity.collider.friction) {
            colliderDesc = colliderDesc.setFriction(entity.collider.friction);
          }
          if (entity.collider.sensor) {
            colliderDesc = colliderDesc.setSensor(true);
          }
          const collider = world.createCollider(colliderDesc, parentInstance.rigidBody.rigidBody);
          return {
            ...entityInstance,
            collider: {
              collider,
            },
          };
        },
      };
    },
  );
