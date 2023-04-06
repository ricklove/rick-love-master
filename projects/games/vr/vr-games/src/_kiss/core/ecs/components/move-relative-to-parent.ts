import { createComponentFactory } from '../ecs-component-factory';
import { EntityInstanceUntyped } from '../ecs-engine';
import { Entity_Transform, EntityInstance_Transform } from './transform';

export type Entity_MoveRelativeToParent = {
  moveRelativeToParent: {};
};

export type EntityInstance_MoveRelativeToParent = {
  moveRelativeToParent: {};
};

export const moveRelativeToParentComponentFactory = createComponentFactory<
  Entity_Transform,
  Entity_MoveRelativeToParent,
  EntityInstance_Transform,
  EntityInstance_MoveRelativeToParent
>()(() => {
  return {
    name: `moveRelativeToParent`,
    addComponent: (entity, args: Entity_MoveRelativeToParent[`moveRelativeToParent`]) => {
      return {
        ...entity,
        moveRelativeToParent: {
          ...args,
        },
      };
    },
    setup: (entityInstance) => {
      return { ...entityInstance, moveRelativeToParent: {} };
    },
    update: (entityInstance) => {
      const parentTransform = (
        (entityInstance as unknown as EntityInstanceUntyped).parent as unknown as Entity_Transform
      ).transform;
      const selfTransform = entityInstance.transform;
      const descTransform = entityInstance.desc.transform;

      selfTransform.position[0] = parentTransform.position[0] + descTransform.position[0];
      selfTransform.position[1] = parentTransform.position[1] + descTransform.position[1];
      selfTransform.position[2] = parentTransform.position[2] + descTransform.position[2];

      selfTransform.quaternion[0] = descTransform.quaternion[0];
      selfTransform.quaternion[1] = descTransform.quaternion[1];
      selfTransform.quaternion[2] = descTransform.quaternion[2];
      selfTransform.quaternion[3] = descTransform.quaternion[3];
    },
  };
});
