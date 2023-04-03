import { GamePlayerInputs } from '../../input/game-player-inputs';
import { createComponentFactory } from '../ecs-component-factory';
import { Entity_RigidBody, EntityInstance_RigidBody } from './rigid-body';

export type Entity_InputHandJoint = {
  inputHandJoint: {
    handSide: `left` | `right`;
    handJoint: XRHandJoint;
    handJointIndex: number;
  };
};

export const inputHandJointComponentFactory = ({ inputs }: { inputs: GamePlayerInputs }) =>
  createComponentFactory<Entity_RigidBody, Entity_InputHandJoint, EntityInstance_RigidBody>()(() => {
    return {
      name: `inputHandJoint`,
      addComponent: (entity, args: Pick<Entity_InputHandJoint[`inputHandJoint`], `handSide` | `handJoint`>) => {
        return {
          ...entity,
          inputHandJoint: {
            ...args,
            handJointIndex: inputs.hands[args.handSide].findIndex((x) => x.handJoint === args.handJoint),
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
        const { handJointIndex, handSide } = entityInstance.desc.inputHandJoint;
        const inputValue = inputs.hands[handSide][handJointIndex];

        rigidBody.setTranslation(inputValue.position, true);
      },
    };
  });
