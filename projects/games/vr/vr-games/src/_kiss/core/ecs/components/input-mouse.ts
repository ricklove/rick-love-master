import { Vector3 } from 'three';
import { GamePlayerInputs } from '../../input/game-player-inputs';
import { createComponentFactory } from '../ecs-component-factory';
import { Entity_RigidBody, EntityInstance_RigidBody } from './rigid-body';

export type Entity_InputMouse = {
  inputMouse: {};
};

export type EntityInstance_InputMouse = {
  inputMouse: {
    timeLastUpdate: number;
    z: number;
  };
};

export const inputMouseComponentFactory = ({ inputs }: { inputs: GamePlayerInputs }) =>
  createComponentFactory<Entity_RigidBody, Entity_InputMouse, EntityInstance_RigidBody, EntityInstance_InputMouse>()(
    () => {
      const v = new Vector3();
      const vPosition = new Vector3();
      return {
        name: `inputMouse`,
        addComponent: (entity, args: Entity_InputMouse[`inputMouse`]) => {
          return {
            ...entity,
            inputMouse: {
              ...args,
            },
          };
        },
        setup: (entityInstance) => {
          return {
            ...entityInstance,
            inputMouse: {
              z: 0.5,
              timeLastUpdate: 0,
            },
          };
        },
        update: (entityInstance) => {
          const { rigidBody } = entityInstance.rigidBody;

          const mouseState = inputs.mouse;
          if (mouseState.wheelDeltaY && mouseState.time !== entityInstance.inputMouse.timeLastUpdate) {
            entityInstance.inputMouse.timeLastUpdate = mouseState.time;
            if (mouseState.wheelDeltaY > 0) {
              entityInstance.inputMouse.z = Math.max(0.1, entityInstance.inputMouse.z * 0.95);
            } else {
              entityInstance.inputMouse.z = Math.min(10, entityInstance.inputMouse.z * 1.05);
            }
          }

          vPosition
            .copy(mouseState.position)
            .add(v.copy(mouseState.direction).multiplyScalar(entityInstance.inputMouse.z));

          // wogger.log(`mouseState.position`, { ...vPosition, mouseState });

          rigidBody.setTranslation(vPosition, true);
        },
      };
    },
  );
