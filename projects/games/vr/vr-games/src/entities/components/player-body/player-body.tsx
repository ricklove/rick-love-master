import { defineComponent, EntityBase, EntityList, EntityWithChildren } from '../../core';
import { Entity } from '../../entity';
import { EntityPhysicsViewSphere } from '../physics-view-sphere';
import { getHumanJointData, HumanJointData } from './player-body-joint-data-access';

// constraints Reference: https://enable3d.io/examples/types-of-constraints.html

export type EntityPlayerBody = EntityWithChildren & {
  playerBody: {
    parts: { entity: EntityBase; joint: HumanJointData }[];
  };
};
export const EntityPlayerBody = defineComponent<EntityPlayerBody>()
  .with(`children`, () => new EntityList())
  .with(`playerBody`, ({}: {}, e) => {
    const joints = getHumanJointData();
    const jointEntities = joints.map((x) => ({ entity: createSphereNode(x), joint: x }));

    e.children.add(...jointEntities.map((x) => x.entity));
    return { parts: jointEntities };
  })
  .attach({});

const createSphereNode = ({ startPosition, joint, radius, side }: HumanJointData) => {
  const ball = Entity.create(`ball`)
    .addComponent(EntityPhysicsViewSphere, {
      mass: 0,
      radius,
      debugColor: side === `left` ? 0x0000ff : side === `right` ? 0xff0000 : 0x00ff00,
      startPosition,
    })
    .build();

  return ball;
};
