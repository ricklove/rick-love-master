import { GamePlayerInputs } from '../../input/game-player-inputs';
import { createComponentFactory } from '../ecs-component-factory';
import { Entity_RigidBody, EntityInstance_RigidBody } from './rigid-body';

export type Entity_InputController = {
  inputController: {
    handSide: `left` | `right`;
  };
};

export const inputControllerComponentFactory = ({ inputs }: { inputs: GamePlayerInputs }) =>
  createComponentFactory<Entity_RigidBody, Entity_InputController, EntityInstance_RigidBody>()(() => {
    return {
      name: `inputController`,
      addComponent: (entity, args: Entity_InputController[`inputController`]) => {
        return {
          ...entity,
          inputController: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        return {
          ...entityInstance,
        };
      },
      update: (entityInstance) => {
        const { rigidBody } = entityInstance.rigidBody;
        const { handSide } = entityInstance.desc.inputController;
        const inputValue = inputs.controllerGrips[handSide];

        rigidBody.setTranslation(inputValue.position, true);
      },
    };
  });
