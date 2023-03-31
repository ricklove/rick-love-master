import { ColliderDesc, World } from '@dimforge/rapier3d-compat';
import { createComponentFactory } from '../ecs-component-factory';
import { Entity_Box } from './box';
import { EntityInstance_RigidBody } from './rigid-body';

export type Entity_BoxCollider = {
  boxCollider: {
    restitution?: number;
    friction?: number;
    colliderEvents?: boolean;
    sensor?: boolean;
  };
};

export const boxColliderComponentFactory = ({ world }: { world: World }) =>
  createComponentFactory<Entity_Box, Entity_BoxCollider, EntityInstance_RigidBody>()(`boxCollider`, () => {
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
          boxCollider: {
            restitution,
            friction,
            colliderEvents,
            sensor,
          },
        };
      },
      setup: (entity, parent) => {
        let colliderDesc = ColliderDesc.cuboid(...entity.box.scale);
        if (entity.boxCollider.restitution) {
          colliderDesc = colliderDesc.setRestitution(entity.boxCollider.restitution);
        }
        if (entity.boxCollider.friction) {
          colliderDesc = colliderDesc.setFriction(entity.boxCollider.friction);
        }
        if (entity.boxCollider.sensor) {
          colliderDesc = colliderDesc.setSensor(true);
        }
        world.createCollider(colliderDesc, parent.rigidBody.rigidBody);
        return entity;
      },
    };
  });
