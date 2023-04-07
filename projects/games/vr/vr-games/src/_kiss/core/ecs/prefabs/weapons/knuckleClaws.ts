import { Ecs } from '../../components/_components';

export const createWeapon_knuckleClaws = (
  ecs: Ecs,
  position: [number, number, number],
  scale: number = 1,
  attachedHandSide?: `left` | `right` | `mouse`,
) => {
  const length = 0.4 * scale;
  const bladeThickness = 0.002 * scale;
  const bladeWidth = 0.01 * scale;

  const knucleGap = 0.02 * scale;
  const angle = Math.PI * 0.05;
  const hOfAngle = Math.sin(angle);
  const hAtHalfLegnth = hOfAngle * length * 0.5;

  const claws = ecs
    .entity(`knuckleClaws`)
    .transform({ position })
    .rigidBody({ kind: `dynamic`, collisionTag: `weapon` })
    .inputHandAttachable({ handAttachableKind: `knuckles`, attachmentPosition: [0, 0, 0], attachedHandSide })
    .addChild(
      ecs
        .entity(`bladeMiddle`)
        .transform({ position: [0, 0, 1.03 * -0.5 * length] })
        .shape_box({ scale: [bladeWidth, bladeThickness, 1.03 * length] })
        .collider({ restitution: 1, colliderEvents: true })
        .graphics({ color: 0xff0000 })
        .build(),
    )
    .addChild(
      ecs
        .entity(`bladeTop`)
        .transform({ position: [0, knucleGap + hAtHalfLegnth, -0.5 * length], rotation: [angle, 0, 0] })
        .shape_box({ scale: [bladeWidth, bladeThickness, 1.01 * length] })
        .collider({ restitution: 1, colliderEvents: true })
        .graphics({ color: 0xff0000 })
        .build(),
    )
    .addChild(
      ecs
        .entity(`bladeBottom`)
        .transform({ position: [0, -knucleGap - hAtHalfLegnth, -0.5 * length], rotation: [-angle, 0, 0] })
        .shape_box({ scale: [bladeWidth, bladeThickness, 1.01 * length] })
        .collider({ restitution: 1, colliderEvents: true })
        .graphics({ color: 0xff0000 })
        .build(),
    )
    .build();

  return claws;
};
