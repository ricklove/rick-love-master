import { Vector3 } from 'three';
import { GamePlayerInputs } from '../../input/game-player-inputs';
import { wogger } from '../../worker/wogger';
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
    setRelativeTarget: (target: [number, number, number], timeToMoveSec: number) => void;
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
            setRelativeTarget: (target: [number, number, number], timeToMoveSec: number) => {
              const currentTarget = result.moveToTarget.target;
              // const currentTarget = entityInstance.rigidBody.rigidBody.translation();
              result.moveToTarget.target.set(
                target[0] + currentTarget.x,
                target[1] + currentTarget.y,
                target[2] + currentTarget.z,
              );
              result.moveToTarget.timeToArrive = Date.now() + timeToMoveSec * 1000;

              wogger.log(`moveToTargetComponentFactory: setRelativeTarget`, {
                target,
                timeToMoveSec,
                currentTarget,
                result,
              });
            },
          },
        };

        return result;
      },
      update: (entityInstance) => {
        const { rigidBody } = entityInstance.rigidBody;
        const { target, timeToArrive } = entityInstance.moveToTarget;
        let timeToMoveSec = (timeToArrive - Date.now()) / 1000;

        if (timeToMoveSec < 0) {
          // wogger.log(`moveToTargetComponentFactory: update: no time - resetForces`, {
          //   target,
          //   timeToMoveSec,
          //   vPositionDelta: vPositionDelta.toArray(),
          //   vVelocityDelta: vVelocityDelta.toArray(),
          //   vImpulse: vImpulse.toArray(),
          // });
          rigidBody.setLinvel(v.set(0, 0, 0), false);
          return;
        }
        if (timeToMoveSec < 0.02) {
          timeToMoveSec = 0.02;
        }

        const translation = rigidBody.translation();
        vPosition.set(translation.x, translation.y, translation.z);
        vPositionDelta.copy(target).sub(vPosition);

        if (vPositionDelta.lengthSq() < 0.0001) {
          // wogger.log(`moveToTargetComponentFactory: update: no position delta`, {
          //   target,
          //   timeToMoveSec,
          //   vPositionDelta: vPositionDelta.toArray(),
          //   vVelocityDelta: vVelocityDelta.toArray(),
          //   vImpulse: vImpulse.toArray(),
          // });
          return;
        }

        vVelocityTarget.copy(vPositionDelta).multiplyScalar(1 / timeToMoveSec);

        const vel = rigidBody.linvel();
        vVelocityActual.set(vel.x, vel.y, vel.z);
        vVelocityDelta.copy(vVelocityTarget).sub(vVelocityActual);

        if (vVelocityDelta.lengthSq() < 0.0001) {
          // wogger.log(`moveToTargetComponentFactory: update: no velocity delta`, {
          //   target,
          //   timeToMoveSec,
          //   vPositionDelta: vPositionDelta.toArray(),
          //   vVelocityDelta: vVelocityDelta.toArray(),
          //   vImpulse: vImpulse.toArray(),
          // });
          return;
        }

        vImpulse.copy(vVelocityDelta).multiplyScalar(rigidBody.mass());
        rigidBody.applyImpulse(vImpulse, true);

        // wogger.log(`moveToTargetComponentFactory: update`, {
        //   target,
        //   timeToMoveSec,
        //   vPositionDelta: vPositionDelta.toArray(),
        //   vVelocityDelta: vVelocityDelta.toArray(),
        //   vImpulse: vImpulse.toArray(),
        // });
      },
    };
  });
