import { Ecs } from '../components/_components';

export const createAlienEgg = (ecs: Ecs, position: [number, number, number], scale: number = 1) => {
  const alienEgg = ecs
    .entity(`alienEgg`)
    .transform({ position, quaternion: [0, 0, 0, 1] })
    .rigidBody({ kind: `dynamic` })
    .addChild(
      ecs
        .entity(`body`)
        .transform({ position: [0, 0.5 * scale, 0], quaternion: [0, 0, 0, 1] })
        .shape_sphere({ radius: 0.5 * scale })
        .collider({ restitution: 0.8, friction: 0.1 })
        .graphics({ color: 0x00ff00 })
        .build(),
    )
    .addChild(
      ecs
        .entity(`leg1`)
        .transform({ position: [0.25 * scale, 0.25 * scale, -0.25 * scale], quaternion: [0, 0, 0, 1] })
        .shape_sphere({ radius: 0.25 * scale })
        .collider({ restitution: 0.8, friction: 0.1 })
        .graphics({ color: 0x0000ff })
        .build(),
    )
    .addChild(
      ecs
        .entity(`leg2`)
        .transform({ position: [-0.25 * scale, 0.25 * scale, 0.25 * scale], quaternion: [0, 0, 0, 1] })
        .shape_sphere({ radius: 0.25 * scale })
        .collider({ restitution: 0.8, friction: 0.1 })
        .graphics({ color: 0x0000ff })
        .build(),
    )
    .addChild(
      ecs
        .entity(`leg3`)
        .transform({ position: [-0.25 * scale, 0.25 * scale, -0.25 * scale], quaternion: [0, 0, 0, 1] })
        .shape_sphere({ radius: 0.25 * scale })
        .collider({ restitution: 0.8, friction: 0.1 })
        .graphics({ color: 0x0000ff })
        .build(),
    )
    .addChild(
      ecs
        .entity(`leg4`)
        .transform({ position: [0.25 * scale, 0.25 * scale, 0.25 * scale], quaternion: [0, 0, 0, 1] })
        .shape_sphere({ radius: 0.25 * scale })
        .collider({ restitution: 0.8, friction: 0.1 })
        .graphics({ color: 0x0000ff })
        .build(),
    )
    .build();

  return alienEgg;
};

// <RigidBody {...s}>
// <Sphere>
//   <meshStandardMaterial color={color} />
// </Sphere>
// <group position={[-0.75, -0.5, 0]}>
//   <Sphere args={[0.5]} position={[0, 0, 0.3]}>
//     <meshStandardMaterial color={0x0000ff} />
//   </Sphere>
//   <Sphere args={[0.5]} position={[0, 0, -0.3]}>
//     <meshStandardMaterial color={0x0000ff} />
//   </Sphere>
// </group>
// <group position={[0.75, -0.5, 0]}>
//   <Sphere args={[0.5]} position={[0, 0, 0.3]}>
//     <meshStandardMaterial color={0x0000ff} />
//   </Sphere>
//   <Sphere args={[0.5]} position={[0, 0, -0.3]}>
//     <meshStandardMaterial color={0x0000ff} />
//   </Sphere>
// </group>
// </RigidBody>
