import { Triplet } from '@react-three/cannon';
import { Euler, Vector3 } from 'three';
import { logger } from '../../../utils/logger';
import { defineComponent, EntityBase, EntityList, EntityWithChildren } from '../../core';
import { Entity } from '../../entity';
import { EntityPhysicsViewBox } from '../physics-view-box';
import { EntityPhysicsViewSphere } from '../physics-view-sphere';
import { getHumanJointData, HumanJointData } from './player-body-joint-data-access';
import { HumanBodyPartName, humanBodyParts } from './player-body-parts';

// constraints Reference: https://enable3d.io/examples/types-of-constraints.html

export type EntityPlayerBody = EntityWithChildren & {
  playerBody: {
    parts: { entity: EntityBase; joint: HumanJointData }[];
  };
};
export const EntityPlayerBody = defineComponent<EntityPlayerBody>()
  .with(`children`, () => new EntityList())
  .with(`playerBody`, ({}: {}, e) => {
    const scale = 1;
    const joints = getHumanJointData();
    const jointEntities = joints.map((x) => ({ entity: createSphereNode(x), joint: x }));
    e.children.add(...jointEntities.map((x) => x.entity));

    const bodyPartEntities = Object.keys(humanBodyParts)
      .map((k) => createBodyPartEntity({ part: k as HumanBodyPartName, scale }))
      .filter((x) => !!x)
      .map((x) => x!);
    e.children.add(...bodyPartEntities.flatMap((x) => x.entities));

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

const createBodyPartEntity = ({ part, scale }: { part: HumanBodyPartName; scale: number }) => {
  const d = calculateBodyPartDimensions(part, scale);
  if (!d) {
    return;
  }

  const createEntity = (side: `center` | `left` | `right`) => {
    const mirror = side === `left` ? -1 : 1;
    return Entity.create(`bodyPart`)
      .addComponent(EntityPhysicsViewBox, {
        mass: 0,
        debugColor: 0x00ff00,
        startPosition: [mirror * d.position.x, d.position.y, d.position.z] as Triplet,
        startRotation: [d.rotation.x, d.rotation.y, mirror * d.rotation.z] as Triplet,
        scale: d.scale.toArray() as Triplet,
      })
      .build();
  };

  return { scale, part, entities: d.sides.map((s) => createEntity(s)) };
};

const working = {
  a: new Vector3(),
  b: new Vector3(),
  c: new Vector3(),
};
const calculateBodyPartDimensions = (part: HumanBodyPartName, scale: number) => {
  const { a, b, c } = working;
  const bodyPart = humanBodyParts[part];
  const humanJoints = getHumanJointData();
  const joints = bodyPart.joints.map((j) => humanJoints.find((x) => x.joint === j));
  if (joints.length !== bodyPart.joints.length) {
    logger.log(`ERROR: Missing joints`, { joints, bodyPart, humanJoints });
    return;
  }

  const sides = joints.some((x) => x?.side === `center`) ? ([`center`] as const) : ([`left`, `right`] as const);

  const autoAlign = joints.length === 2;
  if (joints.length === 2) {
    const [aJoint, bJoint] = joints;
    if (!aJoint || !bJoint) {
      return;
    }

    a.set(...aJoint.startPosition);
    b.set(...bJoint.startPosition);
    const length = c.clone().copy(b).sub(a).length() + aJoint.radius + bJoint.radius;
    const direction = c.clone().copy(b).sub(a).clone().normalize();
    const thickness = Math.max(aJoint.radius, bJoint.radius);
    return {
      sides,
      // origin: a.clone(),
      // direction: b.sub(a).clone().normalize(),
      position: a.clone().add(b).multiplyScalar(0.5).multiplyScalar(scale),
      rotation: new Euler(-Math.asin(direction.z), 0, Math.asin(direction.x)),
      scale: new Vector3(thickness, length, thickness).multiplyScalar(scale),
    };
  }
};
