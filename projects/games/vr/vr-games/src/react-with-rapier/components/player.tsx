import React, { useMemo, useRef } from 'react';
import { Box, Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Quaternion, Vector3, XRJointSpace } from 'three';
import { usePlayer } from '../../components/camera';
import { HandGestureResult, handJointNames, useGestures } from '../../gestures/gestures';
import { createContextWithDefault } from '../../utils/contextWithDefault';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { ThrottleSubject } from '../../utils/throttleSubject';

export const PlayerComponentContext = createContextWithDefault({
  player: {
    staffPalmAttachment: {
      left: undefined as undefined | RapierRigidBody,
      right: undefined as undefined | RapierRigidBody,
    },
  },
});

export const Player = () => {
  const gestures = useGestures();
  const player = usePlayer();

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
  // const joints = useMemo(() => {
  //   return handJointNames.map((x) => ({ joint: x, ref: createRef<typeof Sphere>() }));
  // }, []);
  // useFrame(() => {
  //   handJointNames.forEach(x=>{
  //     joints.
  //   });
  // });

  return (
    <>
      {handJointNames.map((x) => (
        <React.Fragment key={x}>
          {hand._joints[x] && <PlayerHandJoint side={side} name={x} joint={hand._joints[x]!} />}
        </React.Fragment>
      ))}
      <PlayerHandWeaponAttachments side={side} hand={hand} />
    </>
  );
};
const PlayerHandJoint = ({ side, name, joint }: { side: `left` | `right`; name: XRHandJoint; joint: XRJointSpace }) => {
  const ref = useRef<RapierRigidBody>(null);
  const player = usePlayer();
  const w = useMemo(() => ({ v: new Vector3() }), []);

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    ref.current.setTranslation(w.v.copy(joint.position).add(player.position), true);
    ref.current.setRotation(joint.quaternion, true);
  });
  return (
    <>
      <RigidBody ref={ref} type='kinematicPosition' position={joint.position} colliders='cuboid'>
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
  const player = usePlayer();
  const w = useMemo(() => ({ v: new Vector3(), q: new Quaternion() }), []);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    pContext.player.staffPalmAttachment[side] = ref.current as RapierRigidBody;
  }, []);

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    // TODO: add weapon attechments to gestures
    ref.current.setTranslation(
      w.v
        .copy(hand.pointingHand._handPalmDirection)
        .multiplyScalar(0.02)
        .add(hand.pointingHand._proximalAverage)
        .add(player.position),
      true,
    );
    ref.current.setRotation(w.q.copy(hand._joints[`middle-finger-metacarpal`]?.quaternion!), true);
  });
  return (
    <>
      <RigidBody ref={ref} type='kinematicPosition' colliders='cuboid'>
        <group
          rotation={[0, (side === `right` ? 1 : -1) * Math.PI * -0.15, (side === `right` ? 1 : -1) * Math.PI * 0.5]}
          position={[(side === `right` ? 1 : -1) * 0.1, 0, 0.05]}
        >
          <Cylinder args={[0.03, 0.03, 1]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color={`#c1782f`} transparent={true} opacity={0.5} />
          </Cylinder>
        </group>
      </RigidBody>
    </>
  );
};
