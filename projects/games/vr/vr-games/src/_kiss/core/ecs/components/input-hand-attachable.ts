import { RigidBodyType } from '@dimforge/rapier3d-compat';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { GamePlayerInputs } from '../../input/game-player-inputs';
import { createComponentFactory } from '../ecs-component-factory';
import { createMouseInputTracker, MouseInputTracker } from './input-mouse';
import { Entity_RigidBody, EntityInstance_RigidBody } from './rigid-body';

export type HandAttachableKind = `sword` | `knuckles`;
export type Entity_InputHandAttachable = {
  inputHandAttachable: {
    handAttachableKind: HandAttachableKind;
    attachmentPosition?: [number, number, number];
    attachedHandSide?: `left` | `right` | `mouse`;
    autoHide?: boolean;
  };
};

export type EntityInstance_InputHandAttachable = {
  inputHandAttachable: {
    attachedHandSide?: `left` | `right` | `mouse`;
    unattachedBodyType?: RigidBodyType;
    calculateAttachment: () =>
      | undefined
      | {
          position: Vector3;
          quaternion: Quaternion;
        };
    mouseTracker: MouseInputTracker;
  };
};

export const inputHandAttachableComponentFactory = ({ inputs }: { inputs: GamePlayerInputs }) =>
  createComponentFactory<
    Entity_RigidBody,
    Entity_InputHandAttachable,
    EntityInstance_RigidBody,
    EntityInstance_InputHandAttachable
  >()(() => {
    const v = new Vector3();

    return {
      name: `inputHandAttachable`,
      addComponent: (entity, args: Entity_InputHandAttachable[`inputHandAttachable`]) => {
        return {
          ...entity,
          inputHandAttachable: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        const createCalculateAttachment = () => {
          const { handAttachableKind } = entityInstance.desc.inputHandAttachable;

          if (handAttachableKind === `sword`) {
            const vKnucklesMid = new Vector3();
            const vUp = new Vector3();
            const vWristToKnuckles = new Vector3();
            const vKnucklesToPalm = new Vector3();
            const vPalmGrip = new Vector3();
            const mForward = new Matrix4();
            const qForward = new Quaternion();
            const vAttachment = new Vector3();
            const v = new Vector3();

            return () => {
              const { attachedHandSide: handSide } = inputHandAttachable;
              if (!handSide) {
                return;
              }
              if (handSide === `mouse`) {
                const mouseResult = inputHandAttachable.mouseTracker.getPosition(inputs);
                if (!mouseResult.enabled) {
                  // hide if no mouse activity for 3 seconds
                  return;
                }

                vAttachment.copy(mouseResult.position);
                qForward.identity();

                return {
                  position: vAttachment,
                  quaternion: qForward,
                };
              }

              const wrist = inputs.hands[handSide].find((x) => x.handJoint === `wrist`)?.position;
              const indexProximal = inputs.hands[handSide].find(
                (x) => x.handJoint === `index-finger-phalanx-proximal`,
              )?.position;
              const pinkyProximal = inputs.hands[handSide].find(
                (x) => x.handJoint === `pinky-finger-phalanx-proximal`,
              )?.position;
              const thumbMetacarpal = inputs.hands[handSide].find((x) => x.handJoint === `thumb-metacarpal`)?.position;

              if (!wrist || !indexProximal || !pinkyProximal || !thumbMetacarpal) {
                return;
              }

              vUp.copy(indexProximal).sub(pinkyProximal);
              vKnucklesMid.copy(indexProximal).add(pinkyProximal).multiplyScalar(0.5);
              vWristToKnuckles.copy(vKnucklesMid).sub(wrist);
              vKnucklesToPalm.copy(vWristToKnuckles).cross(vUp);

              if (handSide === `right`) {
                vKnucklesToPalm.negate();
              }

              vPalmGrip
                .copy(vKnucklesToPalm)
                .normalize()
                .multiplyScalar(0.03)
                .add(wrist)
                .add(v.copy(vWristToKnuckles).multiplyScalar(0.9));
              // vForward.copy(pinkyProximal).sub(thumbMetacarpal).normalize();
              // mForward.lookAt(vPalmGrip, wrist, vUp);
              // mForward.lookAt(pinkyProximal, thumbMetacarpal, vUp);
              mForward.lookAt(wrist, pinkyProximal, vUp);
              qForward.setFromRotationMatrix(mForward);

              const pos = entityInstance.desc.inputHandAttachable.attachmentPosition ?? [0, 0, 0];
              vAttachment.set(pos[0], pos[1], pos[2]).negate().applyQuaternion(qForward).add(vPalmGrip);

              return {
                position: vAttachment,
                quaternion: qForward,
              };
            };
          }

          if (handAttachableKind === `knuckles`) {
            const vKnucklesMid = new Vector3();
            const vUp = new Vector3();
            const vWristToKnuckles = new Vector3();
            const mForward = new Matrix4();
            const qForward = new Quaternion();
            const vAttachment = new Vector3();
            const v = new Vector3();

            return () => {
              const { attachedHandSide: handSide } = inputHandAttachable;
              if (!handSide) {
                return;
              }
              if (handSide === `mouse`) {
                const mouseResult = inputHandAttachable.mouseTracker.getPosition(inputs);
                if (!mouseResult.enabled) {
                  // hide if no mouse activity for 3 seconds
                  return;
                }

                vAttachment.copy(mouseResult.position);
                qForward.identity();

                return {
                  position: vAttachment,
                  quaternion: qForward,
                };
              }

              const wrist = inputs.hands[handSide].find((x) => x.handJoint === `wrist`)?.position;
              const indexProximal = inputs.hands[handSide].find(
                (x) => x.handJoint === `index-finger-phalanx-proximal`,
              )?.position;
              const pinkyProximal = inputs.hands[handSide].find(
                (x) => x.handJoint === `pinky-finger-phalanx-proximal`,
              )?.position;

              if (!wrist || !indexProximal || !pinkyProximal) {
                return;
              }

              vUp.copy(indexProximal).sub(pinkyProximal);
              vKnucklesMid.copy(indexProximal).add(pinkyProximal).multiplyScalar(0.5);
              vWristToKnuckles.copy(vKnucklesMid).sub(wrist);

              mForward.lookAt(wrist, vKnucklesMid, vUp);
              qForward.setFromRotationMatrix(mForward);

              const pos = entityInstance.desc.inputHandAttachable.attachmentPosition ?? [0, 0, 0];
              vAttachment.set(pos[0], pos[1], pos[2]).negate().applyQuaternion(qForward).add(vKnucklesMid);

              return {
                position: vAttachment,
                quaternion: qForward,
              };
            };
          }

          throw new Error(`Unknown hand attachment kind: ${handAttachableKind}`);
        };

        const inputHandAttachable: EntityInstance_InputHandAttachable[`inputHandAttachable`] = {
          attachedHandSide: entityInstance.desc.inputHandAttachable.attachedHandSide,
          calculateAttachment: createCalculateAttachment(),
          mouseTracker: createMouseInputTracker(),
        };

        return {
          ...entityInstance,
          inputHandAttachable,
        };
      },
      update: (entityInstance) => {
        // Attach to hand if near
        // if(!entityInstance.inputHandAttachable.attachedHandSide) {
        //   const { rigidBody } = entityInstance.rigidBody;
        //   const translation = rigidBody.translation();
        //   const { left, right } = inputs.hands;

        //   return;
        // }

        if (!entityInstance.inputHandAttachable.attachedHandSide) {
          if (entityInstance.inputHandAttachable.unattachedBodyType) {
            const { rigidBody } = entityInstance.rigidBody;
            rigidBody.setBodyType(entityInstance.inputHandAttachable.unattachedBodyType, true);
            entityInstance.inputHandAttachable.unattachedBodyType = undefined;
          }
          if (entityInstance.desc.inputHandAttachable.autoHide) {
            entityInstance.rigidBody.rigidBody.setEnabled(false);
            entityInstance.rigidBody.rigidBody.setTranslation(v.set(0, -10000, 0), false);
          }
          return;
        }

        // Move with hand
        const { calculateAttachment } = entityInstance.inputHandAttachable;
        const result = calculateAttachment();
        if (!result) {
          if (entityInstance.desc.inputHandAttachable.autoHide) {
            entityInstance.rigidBody.rigidBody.setEnabled(false);
            entityInstance.rigidBody.rigidBody.setTranslation(v.set(0, -10000, 0), false);
          }

          return;
        }

        if (!entityInstance.rigidBody.rigidBody.isEnabled()) {
          entityInstance.rigidBody.rigidBody.setEnabled(true);
        }

        const { position, quaternion } = result;
        const { rigidBody } = entityInstance.rigidBody;
        const bodyType = rigidBody.bodyType();
        if (bodyType !== RigidBodyType.KinematicPositionBased) {
          entityInstance.inputHandAttachable.unattachedBodyType = bodyType;
          rigidBody.setBodyType(RigidBodyType.KinematicPositionBased, true);
        }
        rigidBody.setTranslation(position, true);
        rigidBody.setRotation(quaternion, true);
      },
    };
  });
