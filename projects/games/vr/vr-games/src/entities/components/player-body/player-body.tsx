import { Triplet } from '@react-three/cannon';
import { BehaviorSubject } from 'rxjs';
import { Euler, Vector3 } from 'three';
import { logger } from '../../../utils/logger';
import { defineComponent, EntityBase, EntityList, EntityWithChildren } from '../../core';
import { Entity } from '../../entity';
import { EntityForce } from '../force';
import { EntityPhysicsConstraintConeTwist } from '../physics-constraint';
import { EntityPhysicsView } from '../physics-view';
import { EntityPhysicsViewBox } from '../physics-view-box';
import { EntityPhysicsViewSphere } from '../physics-view-sphere';
import { getHumanJointData, HumanJointData, HumanJointName } from './player-body-joint-data-access';
import { HumanBodyPartName, humanBodyParts } from './player-body-parts';

// constraints Reference: https://enable3d.io/examples/types-of-constraints.html

export type EntityPlayerBody = EntityWithChildren & {
  playerBody: {
    parts: { entity: EntityBase }[];
    joints: { entities: EntityBase[] }[];
  };
};
export const EntityPlayerBody = defineComponent<EntityPlayerBody>()
  .with(`children`, () => new EntityList())
  .with(`playerBody`, ({}: {}, e) => {
    const scale = 1;

    const bodyPartEntities = Object.keys(humanBodyParts).flatMap(
      (k) => createBodyPartEntity({ part: k as HumanBodyPartName, scale, thicknessScale: 0.7 }) ?? [],
    );

    e.children.add(...bodyPartEntities.map((x) => x.entity));

    logger.log(`bodyPartEntities`, { bodyPartEntities });

    const joints = getHumanJointData();
    const jointEntities = joints.map((x) => ({ entities: createBodyJoint(x, bodyPartEntities), joint: x }));
    e.children.add(...jointEntities.flatMap((x) => x.entities));

    return {
      parts: bodyPartEntities,
      joints: jointEntities,
    };
  })
  .attach({});

const createBodyJoint = (
  { position, joint, radius, side }: HumanJointData,
  bodyPartEntities: {
    entity: EntityPhysicsView;
    pivots: { side: `center` | `left` | `right`; joint: HumanJointName; position: Triplet }[];
  }[],
) => {
  const connectedToJoint = bodyPartEntities
    .map((part) => ({
      part,
      pivot: part.pivots.find((p) => p.joint === joint && p.side === side),
    }))
    .filter((x) => x.pivot)
    .map((x) => ({
      part: x.part,
      pivot: x.pivot!,
    }));

  const createJointEntity = (parent: typeof connectedToJoint[number], child?: typeof connectedToJoint[number]) => {
    const e = Entity.create(`bodyJoint:${joint}:${side}`)
      .addComponent(EntityPhysicsViewSphere, {
        mass: 0,
        radius,
        debugColor: side === `left` ? 0x0000ff : side === `right` ? 0xff0000 : 0x880088,
        startPosition: position,
      })
      .addComponent(EntityForce, {})
      .extend((e) => {
        // TODO: Use a point to point constraint
        // Follow parent position
        EntityForce.register(e, new BehaviorSubject(true), (e) => {
          e.physics.api?.position.set(...parent.part.entity.transform.position.toArray());
        });
      });

    if (!child) {
      return e.build();
    }
    return e
      .addComponent(EntityPhysicsConstraintConeTwist, {
        entityA: child.part.entity,
        entityB: parent.part.entity,
        options: {
          pivotA: child.pivot.position,
          pivotB: parent.pivot.position,
          axisA: [0, 1, 0] as Triplet,
          axisB: [0, 1, 0] as Triplet,
        },
      })
      .build();
  };

  if (!connectedToJoint.length) {
    logger.log(`createBodyJoint - No matches for ${joint}:${side}`);
    return [];
  }

  const cFirst = connectedToJoint[0];
  return connectedToJoint
    .map((c, i) => {
      if (i === 0) {
        return createJointEntity(cFirst);
      }

      return createJointEntity(cFirst, c);
    })
    .filter((x) => !!x)
    .map((x) => x!);

  // const pairs = connectedToJoint.slice(1).map((x) => [connectedToJoint[0], x]);

  // const jointEntity = Entity.create(`bodyJoint:${joint}:${side}`)
  //   .addComponent(EntityPhysicsViewSphere, {
  //     mass: 0,
  //     radius,
  //     debugColor: side === `left` ? 0x0000ff : side === `right` ? 0xff0000 : 0x00ffff,
  //     startPosition: position,
  //   })
  //   .build();

  // return jointEntity;
};

const createBodyPartEntity = ({
  part,
  scale,
  thicknessScale,
}: {
  part: HumanBodyPartName;
  scale: number;
  thicknessScale: number;
}) => {
  const d = calculateBodyPartData(part, scale);
  if (!d) {
    return;
  }

  const createEntity = (side: `center` | `left` | `right`) => {
    const mirror = side === `left` ? -1 : 1;
    return {
      entity: Entity.create(`bodyPart:${part}:${side}`)
        .addComponent(EntityPhysicsViewBox, {
          mass: 1,
          debugColor: 0x00ff00,
          startPosition: [mirror * d.position.x, d.position.y, d.position.z] as Triplet,
          startRotation: [d.rotation.x, d.rotation.y, mirror * d.rotation.z] as Triplet,
          scale: d.scale.clone().multiplyScalar(thicknessScale).toArray() as Triplet,
        })
        .build(),
      pivots:
        d.pivots?.map((p) => ({
          ...p,
          side,
          position: [mirror * p.position.x, p.position.y, p.position.z] as Triplet,
        })) ?? [],
    };
  };

  return d.sides.map((s) => ({
    scale,
    part,
    side: s,
    ...createEntity(s),
  }));
};

const working = {
  a: new Vector3(),
  b: new Vector3(),
  c: new Vector3(),
};
const calculateBodyPartData = (part: HumanBodyPartName, scale: number) => {
  const { a, b, c } = working;
  const bodyPart = humanBodyParts[part];
  const humanJoints = getHumanJointData();
  const joints = bodyPart.joints
    .map((j) => humanJoints.find((x) => x.joint === j && x.side !== `left`)!)
    .filter((x) => !!x);
  if (joints.length !== bodyPart.joints.length) {
    logger.log(`ERROR: Missing joints`, { joints, bodyPart, humanJoints });
    return;
  }

  const sides = joints.some((x) => x?.side === `center`) ? ([`center`] as const) : ([`left`, `right`] as const);

  if (joints.length === 2) {
    // Auto align
    const [aJoint, bJoint] = joints;
    if (!aJoint || !bJoint) {
      return;
    }

    a.set(...aJoint.position);
    b.set(...bJoint.position);
    const length = c.clone().copy(b).sub(a).length() + aJoint.radius + bJoint.radius;
    const direction = c.clone().copy(b).sub(a).clone().normalize();
    const thickness = Math.max(aJoint.radius, bJoint.radius);

    const center = a.clone().add(b).multiplyScalar(0.5).multiplyScalar(scale);
    const rotation = new Euler(-Math.asin(direction.z), 0, Math.asin(direction.x));
    return {
      sides,
      position: center,
      rotation,
      scale: new Vector3(thickness * 2, length, thickness * 2).multiplyScalar(scale),
      pivots: joints.map((j) => ({
        side: j.side,
        joint: j.joint,
        position: a
          .set(...(j.position as Triplet))
          .sub(center)
          .applyEuler(rotation),
      })),
    };
  }

  // Bounding box
  const allJoints = [
    ...joints,
    ...(sides[0] !== `center`
      ? []
      : joints
          .filter((x) => x.side === `right`)
          .map((x) => ({ ...x, position: [-x.position[0], x.position[1], x.position[2]] as Triplet }))),
  ];

  const centerOfMass = a.clone();
  allJoints.forEach((j) => centerOfMass.add(b.set(...j.position)));
  centerOfMass.multiplyScalar(1 / allJoints.length);

  const rotationTriplet = (bodyPart as { rotation?: Triplet }).rotation;
  const rotation = rotationTriplet ? new Euler(...rotationTriplet) : new Euler();

  const basePos = c.copy(centerOfMass);
  const allJointsRotated = allJoints.map((j) => ({
    ...j,
    // rotate all j pos
    position: a
      .set(...j.position)
      .sub(basePos)
      .applyEuler(rotation)
      .add(basePos)
      .toArray() as Triplet,
  }));

  const minBoundsRotated = [
    Math.min(...allJointsRotated.map((j) => j.position[0] - j.radius)),
    Math.min(...allJointsRotated.map((j) => j.position[1] - j.radius)),
    Math.min(...allJointsRotated.map((j) => j.position[2] - j.radius)),
  ] as Triplet;
  const maxBoundsRotated = [
    Math.max(...allJointsRotated.map((j) => j.position[0] + j.radius)),
    Math.max(...allJointsRotated.map((j) => j.position[1] + j.radius)),
    Math.max(...allJointsRotated.map((j) => j.position[2] + j.radius)),
  ] as Triplet;
  a.set(...minBoundsRotated);
  b.set(...maxBoundsRotated);

  const centerRotated = a.clone().add(b).multiplyScalar(0.5).multiplyScalar(scale);

  return {
    sides,
    position: centerRotated,
    rotation,
    scale: b.clone().sub(a).multiplyScalar(scale),
    pivots: allJoints.map((j) => ({
      side: j.side,
      joint: j.joint,
      position: a
        .set(...(j.position as Triplet))
        .sub(centerRotated)
        .applyEuler(rotation),
    })),
  };
};
