import { ColliderDesc, World } from '@dimforge/rapier3d-compat';
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

export const colliderComponentFactory = ({ world }: { world: World }) =>
  createComponentFactory<Entity_ShapeBox | Entity_ShapeSphere, Entity_Collider, EntityInstance_RigidBody>()(
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
        setup: (entity, parent) => {
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
          world.createCollider(colliderDesc, parent.rigidBody.rigidBody);
          return entity;
        },
      };
    },
  );
