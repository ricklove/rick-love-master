import React, { useEffect, useState } from 'react';
import { Box, Sphere } from '@react-three/drei';
import { Vector3 as Vector3Like } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { SelectableContext, SelectionMode } from '../../components/selectable';
import { Axe } from '../../components/weapon';
import { SceneLayout } from '../scene-layout';

export const Scene00ReactWithRapier = () => {
  return (
    <SceneLayout>
      <group>
        {/* <HangingThing position={[2, 3.5, 0]} />
        <HangingThing position={[5, 3.5, 0]} />
        <HangingThing position={[7, 3.5, 0]} />

        <Rope length={20} /> */}

        <Axe position={[0, 2, -1]} />
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
    </SceneLayout>
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
    }, 10000);
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
  const [color, setColor] = useState(`#00ff00`);
  const s = SelectableContext.useSelectable(({ mode }) => {
    const color = mode === SelectionMode.hover ? `#ffe100` : mode === SelectionMode.select ? `#ff0000` : `#00ff00`;
    setColor(color);
  });
  return (
    <group position={position}>
      <group position={[0, 1, 0]} scale={0.25}>
        <RigidBody {...s}>
          <Sphere>
            <meshStandardMaterial color={color} />
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