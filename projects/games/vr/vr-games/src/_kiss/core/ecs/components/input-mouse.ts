import { Vector3 } from 'three';
import { GamePlayerInputs } from '../../input/game-player-inputs';
import { createComponentFactory } from '../ecs-component-factory';
import { Entity_RigidBody, EntityInstance_RigidBody } from './rigid-body';

export type Entity_InputMouse = {
  inputMouse: {};
};

export type EntityInstance_InputMouse = {
  inputMouse: {
    tracker: MouseInputTracker;
  };
};

export const inputMouseComponentFactory = ({ inputs }: { inputs: GamePlayerInputs }) =>
  createComponentFactory<Entity_RigidBody, Entity_InputMouse, EntityInstance_RigidBody, EntityInstance_InputMouse>()(
    () => {
      const v = new Vector3();

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
              tracker: createMouseInputTracker(),
            },
          };
        },
        update: (entityInstance) => {
          const { rigidBody } = entityInstance.rigidBody;

          const { enabled, position: vPosition } = entityInstance.inputMouse.tracker.getPosition(inputs);

          if (!enabled) {
            rigidBody.setEnabled(false);
            rigidBody.setTranslation(v.set(0, -10000, 0), false);
            return;
          }

          if (!rigidBody.isEnabled()) {
            rigidBody.setEnabled(true);
          }
          rigidBody.setTranslation(vPosition, true);
        },
      };
    },
  );

export type MouseInputTracker = ReturnType<typeof createMouseInputTracker>;
export const createMouseInputTracker = () => {
  const state = {
    z: 0.5,
    timeLastUpdate: 0,
    mouseTimeLastUpdate: 0,
  };

  const v = new Vector3();
  const vPosition = new Vector3();

  return {
    getPosition: (inputs: GamePlayerInputs) => {
      const mouseState = inputs.mouse;

      if (!mouseState.time) {
        // hide if no input
        return { enabled: false as const };
      }

      if (mouseState.time !== state.mouseTimeLastUpdate) {
        state.timeLastUpdate = Date.now();
        state.mouseTimeLastUpdate = mouseState.time;

        if (mouseState.wheelDeltaY > 0) {
          state.z = Math.max(0.1, state.z * 0.95);
        } else if (mouseState.wheelDeltaY < 0) {
          state.z = Math.min(10, state.z * 1.05);
        }
      }

      if (Date.now() > state.timeLastUpdate + 3000) {
        // hide if no mouse activity for 3 seconds
        return { enabled: false as const };
      }

      vPosition.copy(mouseState.position).add(v.copy(mouseState.direction).multiplyScalar(state.z));

      return {
        enabled: true as const,
        position: vPosition,
      };
    },
  };
};