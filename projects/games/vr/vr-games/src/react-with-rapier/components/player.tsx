import React, { useMemo, useRef } from 'react';
import { Box, Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Object3D, Quaternion, Vector3 } from 'three';
import { usePlayer } from '../../components/camera';
import { HandGestureResult, handJointNames, useGestures } from '../../gestures/gestures';
import { createContextWithDefault } from '../../utils/contextWithDefault';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { RigidBodyType } from '../../utils/physics';
import { ThrottleSubject } from '../../utils/throttleSubject';

const createAttachment = () => {
  const attachWeapon = (weapon: RapierRigidBody, attachment: RapierRigidBody) => {
    internalState.attached = weapon;
    internalState.usedAttachment = internalState.attachments.find((x) => x.rigidBody === attachment);
    internalState.attached.setBodyType(RigidBodyType.KinematicPositionBased, true);
  };

  const releaseWeapon = () => {
    internalState.attached?.setBodyType(RigidBodyType.Dynamic, true);
    internalState.attached = undefined;
  };

  const addAttachment = (rigidBody: RapierRigidBody, attachment: Object3D) => {
    // logger.log(`addAttachment`, {
    //   n: rigidBody.handle,
    //   a: attachment.name,
    // });
    internalState.attachments.push({ rigidBody, attachment });
  };

  const internalState = {
    attachments: [] as { rigidBody: RapierRigidBody; attachment: Object3D }[],
    usedAttachment: undefined as undefined | { rigidBody: RapierRigidBody; attachment: Object3D },
    attached: undefined as undefined | RapierRigidBody,
  };

  const state = {
    attachWeapon,
    clear: () => {
      internalState.attached = undefined;
      internalState.usedAttachment = undefined;
    },
    releaseWeapon,
    addAttachment,
    isAttachment: (rigidBody: RapierRigidBody) => {
      //   logger.log(`isAttachment`, {
      //     n: rigidBody.handle,
      //     a: internalState.attachments.map((x) => x.rigidBody.handle).join(`,`),
      //   });
      return internalState.attachments.some((x) => x.rigidBody === rigidBody);
    },
    isWeaponAttached: (rigidBody: RapierRigidBody) => {
      return internalState.attached === rigidBody;
    },
    getWeaponAttachment: (rigidBody: RapierRigidBody) => {
      return internalState.attached === rigidBody ? internalState.usedAttachment : undefined;
    },
    attachWeaponIfCollided: (_args: { weapon: RapierRigidBody; other: RapierRigidBody }) => {
      //will be replaced below
    },
  };

  return state;
};
type Attachment = ReturnType<typeof createAttachment>;

const createContextData = () => {
  // if (!e.other.rigidBody) {
  //   return;
  // }
  // if (playerContext.player.staffPalmAttachment.left.isAttachment(e.other.rigidBody)) {
  //   return;
  // }
  // if (playerContext.player.staffPalmAttachment.right.isAttachment(e.other.rigidBody)) {
  //   playerContext.player.staffPalmAttachment.right.attachWeapon(e.other.rigidBody);
  //   return;
  // }

  const attachWeaponIfCollided =
    (getAttachments: typeof getAllAttachments) =>
    ({ weapon, other }: { weapon: null | undefined | RapierRigidBody; other: null | undefined | RapierRigidBody }) => {
      if (!weapon || !other) {
        return;
      }
      const a = getAttachments().find((x) => x.isAttachment(other));
      if (!a) {
        return;
      }
      if (a.isWeaponAttached(weapon)) {
        return;
      }

      const oldAttachment = getAllAttachments().find((x) => x.isWeaponAttached(weapon));
      if (oldAttachment) {
        oldAttachment.clear();
      }
      a.attachWeapon(weapon, other);
    };

  const getAllAttachments = (): Attachment[] => state.allAttachments;

  const worldPos = new Vector3();
  const worldQuat = new Quaternion();
  const updateAttachedWeaponTransform = (weapon: null | undefined | RapierRigidBody) => {
    if (!weapon) {
      return;
    }
    const { attachment } = state.getWeaponAttachment(weapon) ?? {};
    if (!attachment) {
      return;
    }

    weapon.setNextKinematicTranslation(attachment.getWorldPosition(worldPos));
    weapon.setNextKinematicRotation(attachment.getWorldQuaternion(worldQuat));
  };

  const state = {
    allAttachments: [] as Attachment[],
    getWeaponAttachment: (weapon: null | undefined | RapierRigidBody) => {
      if (!weapon) {
        return;
      }
      return state.allAttachments.find((x) => x.isWeaponAttached(weapon))?.getWeaponAttachment(weapon);
    },
    player: {
      staffPalmAttachment: {
        left: createAttachment(),
        right: createAttachment(),
        attachWeaponIfCollided: attachWeaponIfCollided(() => []),
      },
      attachWeaponIfCollided: attachWeaponIfCollided(() => []),
    },
    updateAttachedWeaponTransform,
  };

  const visit = (node: undefined | Record<string, unknown>): Attachment[] => {
    if (!node) {
      return [];
    }

    const nodeAttachment = node as Partial<Attachment>;
    if (nodeAttachment.isAttachment) {
      nodeAttachment.attachWeaponIfCollided = attachWeaponIfCollided(() => [nodeAttachment as Attachment]);
      return [nodeAttachment as Attachment];
    }

    const subAttachments = Object.values(node).flatMap((x) => visit(x as Record<string, unknown>));
    node.attachWeaponIfCollided = attachWeaponIfCollided(() => subAttachments);
    return subAttachments;
  };
  state.allAttachments = visit(state.player);

  return state;
};

export const PlayerComponentContext = createContextWithDefault(createContextData);

export const Player = () => {
  const gestures = useGestures();
  const player = usePlayer();

  useIsomorphicLayoutEffect(() => {
    PlayerComponentContext.reset();
  }, []);
  const moveState = useMemo(
    () => ({
      mode: new ThrottleSubject(`walk` as `run` | `walk` | `stand`),
    }),
    [],
  );
  // const ref = useRef<Group>(null);

  useFrame(() => {
    // if (!ref.current) {
    //   return;
    // }
    if (gestures.right.pointingIndexFinger.active) {
      moveState.mode.value = moveState.mode.value === `walk` ? `run` : `walk`;
    }
    if (gestures.left.pointingIndexFinger.active) {
      moveState.mode.value = `stand`;
    }

    if (moveState.mode.value === `stand`) {
      return;
    }

    const speed = moveState.mode.value === `walk` ? 0.25 : 1;
    player.position.add(gestures.body.moving._velocity.clone().multiplyScalar((speed * 1) / 60));
    // ref.current.position.copy(player.position);
  });

  return (
    <>
      {/* <group ref={ref}> */}
      <PlayerHand side={`left`} hand={gestures.left} />
      <PlayerHand side={`right`} hand={gestures.right} />
      {/* </group> */}
    </>
  );
};

const PlayerHand = ({ side, hand }: { side: `left` | `right`; hand: HandGestureResult }) => {
  return (
    <>
      {handJointNames.map((x) => (
        <React.Fragment key={x}>
          <PlayerHandJoint side={side} hand={hand} joint={x} />
        </React.Fragment>
      ))}
      <PlayerHandWeaponAttachments side={side} hand={hand} />
    </>
  );
};
const PlayerHandJoint = ({
  side,
  hand,
  joint,
}: {
  side: `left` | `right`;
  hand: HandGestureResult;
  joint: XRHandJoint;
}) => {
  const ref = useRef<RapierRigidBody>(null);
  const player = usePlayer();
  const w = useMemo(() => ({ v: new Vector3() }), []);

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    const j = hand._joints[joint];
    if (!j) {
      return;
    }
    ref.current.setNextKinematicTranslation(w.v.copy(j.position).add(player.position));
    ref.current.setNextKinematicRotation(j.quaternion);
  });
  return (
    <>
      <RigidBody ref={ref} name={`PlayerHandJoint-${side}-${joint}`} type='kinematicPosition' colliders='cuboid'>
        {/* <Sphere args={[0.01]}>
          <meshStandardMaterial color={0xff0000} transparent={true} opacity={0.5} />
        </Sphere> */}
        {/* <Cylinder args={[0.03, 0.03, 0.05]} position={[0, 0.02, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
          <meshStandardMaterial color={0xff0000} transparent={true} opacity={0.5} />
        </Cylinder> */}
        <Box args={[0.05, 0.05, 0.15]} position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color={0xff0000} transparent={true} opacity={0.5} />
        </Box>
      </RigidBody>
    </>
  );
};

const PlayerHandWeaponAttachments = ({ side, hand }: { side: `left` | `right`; hand: HandGestureResult }) => {
  const pContext = PlayerComponentContext.useContext();
  const ref = useRef<RapierRigidBody>(null);
  const attachmentRef = useRef<Object3D>(null);
  const player = usePlayer();
  const w = useMemo(
    () => ({
      v: new Vector3(),
      q: new Quaternion(),
    }),
    [],
  );

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || !attachmentRef.current) {
      return;
    }
    pContext.player.staffPalmAttachment[side].addAttachment(ref.current, attachmentRef.current);
  }, []);

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    if (!hand.pointingHand._handPalmDirection) {
      return;
    }
    if (!hand._joints[`middle-finger-metacarpal`]?.quaternion) {
      return;
    }
    ref.current.setNextKinematicTranslation(
      w.v
        .copy(hand.pointingHand._handPalmDirection)
        .multiplyScalar(0.02)
        .add(hand.pointingHand._proximalAverage)
        .add(player.position),
    );
    ref.current.setNextKinematicRotation(w.q.copy(hand._joints[`middle-finger-metacarpal`].quaternion));
  });
  return (
    <>
      <RigidBody ref={ref} name={`PlayerHandWeaponAttachments-${side}`} type='kinematicPosition' colliders='cuboid'>
        <group
          rotation={[0, (side === `right` ? 1 : -1) * Math.PI * -0.15, (side === `right` ? 1 : -1) * Math.PI * 0.5]}
          position={[(side === `right` ? 1 : -1) * 0.1, 0, 0.05]}
        >
          <Cylinder ref={attachmentRef} args={[0.03, 0.03, 0.1]} position={[0, 0.1, 0]}>
            <meshStandardMaterial color={`#c1782f`} transparent={true} opacity={0.5} />
          </Cylinder>

          {/* <Sphere args={[0.05]} position={[0, 0.025, 0]}>
            <meshStandardMaterial color={`#c1782f`} />
          </Sphere>
          <Cylinder args={[0.03, 0.03, 1]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color={`#c1782f`} />
          </Cylinder>
          <Cylinder args={[0.2, 0.2, 0.018]} position={[0, 0.8, -0.1]} rotation={[0, 0, Math.PI * 0.5]}>
            <meshStandardMaterial color={`#959595`} />
          </Cylinder> */}
        </group>
      </RigidBody>
    </>
  );
};
