import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Sphere } from '@react-three/drei';
import { useFrame, Vector3 as Vector3Like } from '@react-three/fiber';
import { Physics, RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Vector3, XRJointSpace } from 'three';
import { usePlayer } from '../../../components/camera';
import { ScenePerspective } from '../../../components/perspective';
import {
  GestureOptions,
  GesturesProvider,
  HandGestureResult,
  handJointNames,
  useGestures,
} from '../../../gestures/gestures';

export const Scene00ReactWithRapier = () => {
  return (
    <Suspense>
      <GesturesProvider options={GestureOptions.all}>
        <ScenePerspective perspective={`1st`}>
          <Physics gravity={[0, -9.8, 0]} colliders='ball'>
            <Player />
            <group>
              {/* <HangingThing position={[2, 3.5, 0]} />
        <HangingThing position={[5, 3.5, 0]} />
        <HangingThing position={[7, 3.5, 0]} />

        <Rope length={20} /> */}

              <BallSpawner />

              <group rotation={[0, 0, Math.PI * 0.05]}>
                {/* Floor */}
                <RigidBody type='fixed' colliders='cuboid'>
                  <Box position={[0, -100, 0]} args={[10000, 200, 10000]}>
                    <meshStandardMaterial color={0x333333} />
                  </Box>
                </RigidBody>

                {/* <CuboidCollider position={[0, 0, 0]} args={[100, 1, 100]} /> */}
              </group>

              {/* <ContactShadows scale={20} blur={0.4} opacity={0.2} position={[-0, -1.5, 0]} /> */}
            </group>
            {/* <Debug /> */}
          </Physics>
        </ScenePerspective>
      </GesturesProvider>
    </Suspense>
  );
};

const BallSpawner = () => {
  const [balls, setBalls] = useState([] as { key: string; position: Vector3Like }[]);

  useEffect(() => {
    setInterval(() => {
      setBalls((s) => [
        ...s,
        {
          key: `${Math.random()}`,
          position: [5 + -10 * Math.random(), 5, -5 + -10 * Math.random()],
        },
      ]);
    }, 1000);
  }, []);

  return (
    <>
      {balls.map((x) => (
        <BallCreature key={x.key} position={x.position} />
      ))}
    </>
  );
};

const BallCreature = ({ position }: { position: Vector3Like }) => {
  return (
    <group position={position}>
      <group position={[0, 1, 0]} scale={0.25}>
        <RigidBody>
          <Sphere>
            <meshStandardMaterial color={0x00ff00} />
          </Sphere>
          <group position={[-0.75, -0.5, 0]}>
            <Sphere args={[0.5]} position={[0, 0, 0.3]}>
              <meshStandardMaterial color={0x0000ff} />
            </Sphere>
            <Sphere args={[0.5]} position={[0, 0, -0.3]}>
              <meshStandardMaterial color={0x0000ff} />
            </Sphere>
          </group>
          <group position={[0.75, -0.5, 0]}>
            <Sphere args={[0.5]} position={[0, 0, 0.3]}>
              <meshStandardMaterial color={0x0000ff} />
            </Sphere>
            <Sphere args={[0.5]} position={[0, 0, -0.3]}>
              <meshStandardMaterial color={0x0000ff} />
            </Sphere>
          </group>
        </RigidBody>
        {/* <Debug /> */}
      </group>
    </group>
  );
};

// const player = Entity.create(`player`)
//   .addComponent(EntityPlayer, {})
//   .addComponent(EntityPlayerPhysicsGloves, {
//     material: handMaterial,
//   })
//   // .addComponent(EntityHumanoidBody, { scale: 10, offset: new Vector3(0, 5, 0) })
//   .addComponent(EntityAdjustToGround, {
//     minGroundHeight: 0,
//     maxGroundHeight: 0,
//   })
//   .extend((p) => {
//     p.frameTrigger.subscribe(() => {
//       if (!p.player.gestures) {
//         return;
//       }
//       p.transform.position.add(p.player.gestures.body.moving._velocity.clone().multiplyScalar((0.5 * 1) / 60));
//     });
//   })
//   .build();

const Player = () => {
  const gestures = useGestures();
  const player = usePlayer();
  // const ref = useRef<Group>(null);

  useFrame(() => {
    // if (!ref.current) {
    //   return;
    // }
    player.position.add(gestures.body.moving._velocity.clone().multiplyScalar((0.5 * 1) / 60));
    // ref.current.position.copy(player.position);
  });

  return (
    <>
      {/* <group ref={ref}> */}
      <PlayerHand hand={gestures.left} />
      <PlayerHand hand={gestures.right} />
      {/* </group> */}
    </>
  );
};

const PlayerHand = ({ hand }: { hand: HandGestureResult }) => {
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
          {hand._joints[x] && <PlayerHandJoint name={x} joint={hand._joints[x]!} />}
        </React.Fragment>
      ))}
    </>
  );
};
const PlayerHandJoint = ({ name, joint }: { name: XRHandJoint; joint: XRJointSpace }) => {
  const ref = useRef<RapierRigidBody>(null);
  const player = usePlayer();
  const w = useMemo(() => ({ v: new Vector3() }), []);

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    ref.current.setTranslation(w.v.copy(joint.position).add(player.position), true);
  });
  return (
    <>
      <RigidBody ref={ref} type='kinematicPosition' position={joint.position}>
        <Sphere args={[0.01]}>
          <meshStandardMaterial color={0xff0000} transparent={true} opacity={0.5} />
        </Sphere>
      </RigidBody>
    </>
  );
};
