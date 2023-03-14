import { Triplet } from '@react-three/cannon';
import { BehaviorSubject } from 'rxjs';
import { Euler, Quaternion, Vector3 } from 'three';
import { logger } from '../../../utils/logger';
import { defineComponent, EntityBase, EntityList, EntityWithChildren } from '../../core';
import { Entity } from '../../entity';
import { EntityForce } from '../force';
import { EntityPhysicsConstraintConeTwist } from '../physics-constraint';
import { EntityPhysicsView } from '../physics-view';
import { EntityPhysicsViewBox } from '../physics-view-box';
import { EntityPhysicsViewSphere } from '../physics-view-sphere';
import { EntityTextView } from '../text-view';
import { getHumanJointData, HumanJointData, HumanJointName } from './player-body-joint-data-access';
import { HumanBodyPartName, humanBodyParts } from './player-body-parts';

// constraints Reference: https://enable3d.io/examples/types-of-constraints.html

export type EntityPlayerBody = EntityWithChildren & {
  playerBody: {
    parts: { entity: EntityBase }[];
    joints: { entities: EntityBase[] }[];
    scale: number;
    offset: Vector3;
  };
};
export const EntityPlayerBody = defineComponent<EntityPlayerBody>()
  .with(`children`, () => new EntityList())
  .with(`playerBody`, ({ scale, offset }: { scale: number; offset: Vector3 }, e) => {
    const bodyPartEntities = Object.keys(humanBodyParts).flatMap(
      (k) => createBodyPartEntity({ part: k as HumanBodyPartName, scale, offset, thicknessScale: 0.7 }) ?? [],
    );

    e.children.add(...bodyPartEntities.map((x) => x.entity));
    // e.children.add(...bodyPartEntities.flatMap((x) => x.pivotEntities));

    logger.log(`bodyPartEntities`, { bodyPartEntities });

    const joints = getHumanJointData();
    const jointEntities = joints.map((x) => ({
      entities: createBodyJoint(x, scale, offset, bodyPartEntities),
      joint: x,
    }));
    e.children.add(...jointEntities.flatMap((x) => x.entities));

    return {
      scale,
      offset,
      parts: bodyPartEntities,
      joints: jointEntities,
    };
  })
  .attach({});

const createBodyJoint = (
  { position, joint, radius, side, coneAngle, twistAngle }: HumanJointData,
  scale: number,
  offset: Vector3,
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
        enablePhysics: false,
        mass: 0,
        radius: radius * scale,
        debugColorRgba: side === `left` ? 0x0000ffff : side === `right` ? 0xff0000ff : 0x880088ff,
        startPosition: new Vector3(...position).multiplyScalar(scale).add(offset).toArray() as Triplet,
      })
      .addComponent(EntityForce, {})
      .extend((e) => {
        // TODO: Use a point to point constraint
        // Follow parent position
        const pos = new Vector3();
        EntityForce.register(e, new BehaviorSubject(true), (e) => {
          pos
            .set(...parent.pivot.position)
            .applyQuaternion((parent.part.entity as EntityPhysicsViewBox).box.quaternion)
            .add(parent.part.entity.transform.position);

          EntityPhysicsViewSphere.move(e as unknown as EntityPhysicsViewSphere, pos);

          // e.physics.api.sleep();
          // e.physics.api.position.set(
          //   ...new Vector3(...parent.pivot.position)
          //     .applyQuaternion((parent.part.entity as EntityPhysicsViewBox).box.quaternion)
          //     .add(parent.part.entity.transform.position)
          //     .toArray(),
          // );
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
          angle: coneAngle ?? Math.PI * 0.5,
          twistAngle: twistAngle ?? Math.PI * 0.025,
          // angle: joint.includes(`socket`) ? Math.PI * 0.75 : Math.PI * 0.5,
          // twistAngle: joint.includes(`socket`) ? Math.PI * 0.025 : Math.PI * 0.025,
          // maxForce: 1000000,
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
  offset,
  thicknessScale,
}: {
  part: HumanBodyPartName;
  scale: number;
  offset: Vector3;
  thicknessScale: number;
}) => {
  const d = calculateBodyPartData(part, scale, offset);
  if (!d) {
    return;
  }

  const createEntity = (side: `center` | `left` | `right`) => {
    const mirror = side === `left` ? -1 : 1;

    const pivots =
      d.pivots?.map((p) => ({
        ...p,
        side: side === `center` ? p.side : side,
        position: [mirror * p.position.x, p.position.y, p.position.z] as Triplet,
      })) ?? [];

    const entity = Entity.create(`bodyPart:${part}:${side}`)
      .addComponent(EntityPhysicsViewBox, {
        mass: 10,
        debugColorRgba: 0x00ff0080,
        startPosition: [mirror * d.position.x, d.position.y, d.position.z] as Triplet,
        startRotation: [d.rotation.x, d.rotation.y, mirror * d.rotation.z] as Triplet,
        scale: d.scale.clone().multiplyScalar(thicknessScale).toArray() as Triplet,
      })
      .build();

    const pivotEntities = pivots
      .filter((p) => !p.joint.includes(`finger`) && !p.joint.includes(`thumb`) && !p.joint.includes(`toe`))
      // .filter((p) => part === `upper-arm`)
      // .filter((p) => part === `upper-leg`)
      // .filter((p) => part === `hand`)
      .map((p, i) => {
        return (
          Entity.create(`bodyPart:${part}:${side}:pivot:${p.joint}:${p.side}`)
            .addComponent(EntityPhysicsViewSphere, {
              enablePhysics: false,
              mass: 0,
              radius: 0.011 * scale,
              debugColorRgba: p.side === `left` ? 0x0000ff80 : p.side === `right` ? 0xff000080 : 0x88008880,
              startPosition: new Vector3(...p.position).multiplyScalar(scale).add(offset).toArray() as Triplet,
            })
            .addComponent(EntityTextView, {
              offset: new Vector3(0, i * 0.01, 0.05 + i * 0.01),
              // rotation: new Euler(0, -Math.PI * 0.5, 0),
              // rotation: new Euler(0, 0, Math.PI * 0.15),
              defaultText: `${part}:${side}:${p.joint}:${p.side}`,
              color: p.side === `left` ? 0xaaaaff : p.side === `right` ? 0xffaaaa : 0xffaaff,
              fontSize: 0.02,
            })
            // .addComponent(EntityTextView, {
            //   offset: new Vector3(...p.position)
            //     // .add(new Vector3(0, i * 0.01, 0.05))
            //     .multiplyScalar(1000)
            //     .setZ(100),
            //   // rotation: new Euler(0, -Math.PI * 0.5, 0),
            //   // rotation: new Euler(0, 0, Math.PI * 0.15),
            //   defaultText: `${part}:${side}:${p.joint}:${p.side}`,
            //   color: p.side === `left` ? 0x000055 : p.side === `right` ? 0x550000 : 0x550055,
            //   fontSize: 3,
            // })
            .addComponent(EntityForce, {})
            .extend((e) => {
              // TODO: Use a point to point constraint
              // Follow parent position
              const ePos = new Vector3();
              const eQuat = new Quaternion();
              const pos = new Vector3();
              const relativePosition = new Vector3(...p.position);

              const updatePivot = () => {
                pos.copy(relativePosition).applyQuaternion(eQuat).add(ePos);
                EntityPhysicsViewSphere.move(e, pos);
              };

              e.ready.subscribe((r) => {
                if (!r) {
                  return;
                }
                setTimeout(() => {
                  entity.physics.api.position.subscribe((x) => {
                    ePos.set(...x);
                    updatePivot();
                  });
                  entity.physics.api.quaternion.subscribe((x) => {
                    eQuat.set(...x);
                    updatePivot();
                  });
                }, 1000);
              });
            })
            .build()
        );
      });

    return {
      entity,
      pivots,
      pivotEntities,
    };
  };

  return d.sides.map((s) => ({
    scale,
    offset,
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
const calculateBodyPartData = (part: HumanBodyPartName, scale: number, offset: Vector3) => {
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

    const center = a.clone().add(b).multiplyScalar(0.5);
    const rotation = new Euler(-Math.asin(direction.z), 0, Math.asin(direction.x));
    const rotationReverse = new Euler(-rotation.x, -rotation.y, -rotation.z);
    return {
      sides,
      position: center.clone().multiplyScalar(scale).add(offset),
      rotation,
      scale: new Vector3(thickness * 2, length, thickness * 2).multiplyScalar(scale),
      pivots: joints.map((j) => ({
        side: j.side,
        joint: j.joint,
        position: a
          .clone()
          .set(...(j.position as Triplet))
          .sub(center)
          .applyEuler(rotationReverse)
          .multiplyScalar(scale),
      })),
    };
  }

  // Bounding box
  const allJoints = [
    ...joints,
    ...(sides[0] !== `center`
      ? []
      : // add left joints for center
        joints
          .filter((x) => x.side === `right`)
          .map((x) => ({
            ...x,
            side: `left` as const,
            position: [-x.position[0], x.position[1], x.position[2]] as Triplet,
          }))),
  ];

  const rotationTriplet = (bodyPart as { rotation?: Triplet }).rotation;
  const rotation = rotationTriplet ? new Euler(...rotationTriplet) : new Euler();
  const rotationReverse = new Euler(-rotation.x, -rotation.y, -rotation.z);

  const minBounds = [
    Math.min(...allJoints.map((j) => j.position[0] - j.radius)),
    Math.min(...allJoints.map((j) => j.position[1] - j.radius)),
    Math.min(...allJoints.map((j) => j.position[2] - j.radius)),
  ] as Triplet;
  const maxBounds = [
    Math.max(...allJoints.map((j) => j.position[0] + j.radius)),
    Math.max(...allJoints.map((j) => j.position[1] + j.radius)),
    Math.max(...allJoints.map((j) => j.position[2] + j.radius)),
  ] as Triplet;
  a.set(...minBounds);
  b.set(...maxBounds);

  const centerOrig = a.clone().add(b).multiplyScalar(0.5);

  const basePos = c.copy(centerOrig);
  const allJointsRotated = allJoints.map((j) => ({
    ...j,
    // rotate all j pos
    position: a
      .set(...j.position)
      .sub(basePos)
      .applyEuler(rotationReverse)
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

  const center = a.clone().add(b).multiplyScalar(0.5);

  return {
    sides,
    position: center.clone().multiplyScalar(scale).add(offset),
    rotation,
    scale: b.clone().sub(a).multiplyScalar(scale),
    pivots: allJoints.map((j) => ({
      side: j.side,
      joint: j.joint,
      position: a
        .clone()
        .set(...(j.position as Triplet))
        .sub(center)
        .applyEuler(rotationReverse)
        .multiplyScalar(scale),
    })),
  };
};
