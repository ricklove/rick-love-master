import { Vector3 } from 'three';
import { GamePlayerInputs } from '../../input/game-player-inputs';
import { createComponentFactory } from '../ecs-component-factory';
import { Entity_RigidBody, EntityInstance_RigidBody } from './rigid-body';

export type Entity_MoveToTarget = {
  moveToTarget: {
    target: [number, number, number];
    timeToMoveSec: number;
  };
};

export type EntityInstance_MoveToTarget = {
  moveToTarget: {
    target: Vector3;
    timeToArrive: number;
    setTarget: (target: [number, number, number], timeToMoveSec: number) => void;
  };
};

export const moveToTargetComponentFactory = ({ inputs }: { inputs: GamePlayerInputs }) =>
  createComponentFactory<
    Entity_RigidBody,
    Entity_MoveToTarget,
    EntityInstance_RigidBody,
    EntityInstance_MoveToTarget
  >()(() => {
    const v = new Vector3();
    const vPosition = new Vector3();
    const vPositionDelta = new Vector3();
    const vVelocityTarget = new Vector3();
    const vVelocityActual = new Vector3();
    const vVelocityDelta = new Vector3();
    const vImpulse = new Vector3();

    const vAcceleration = new Vector3();
    const vForce = new Vector3();

    return {
      name: `moveToTarget`,
      addComponent: (entity, args: Entity_MoveToTarget[`moveToTarget`]) => {
        return {
          ...entity,
          moveToTarget: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        const d = entityInstance.desc.moveToTarget;
        const result = {
          ...entityInstance,
          moveToTarget: {
            target: new Vector3(d.target[0], d.target[1], d.target[2]),
            timeToArrive: Date.now() + d.timeToMoveSec * 1000,
            setTarget: (target: [number, number, number], timeToMoveSec: number) => {
              result.moveToTarget.target.set(target[0], target[1], target[2]);
              result.moveToTarget.timeToArrive = Date.now() + timeToMoveSec * 1000;
            },
          },
        };

        return result;
      },
      update: (entityInstance) => {
        const { rigidBody } = entityInstance.rigidBody;
        const { target, timeToArrive } = entityInstance.moveToTarget;
        const timeToMoveSec = (timeToArrive - Date.now()) / 1000;

        const translation = rigidBody.translation();
        vPosition.set(translation.x, translation.y, translation.z);
        vPositionDelta.copy(target).sub(vPosition);

        if (vPositionDelta.lengthSq() < 0.1) {
          return;
        }

        vVelocityTarget.copy(vPositionDelta).multiplyScalar(1 / timeToMoveSec);

        const vel = rigidBody.linvel();
        vVelocityActual.set(vel.x, vel.y, vel.z);
        vVelocityDelta.copy(vVelocityTarget).sub(vVelocityActual);

        if (vVelocityDelta.lengthSq() < 0.1) {
          return;
        }

        vImpulse.copy(vVelocityDelta).multiplyScalar(rigidBody.mass());
        rigidBody.applyImpulse(vImpulse, true);
      },
    };
  });
