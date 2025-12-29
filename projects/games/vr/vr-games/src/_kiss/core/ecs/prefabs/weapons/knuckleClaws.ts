import { Ecs } from '../../components/_components';

export const createWeapon_knuckleClaws = (
  ecs: Ecs,
  position: [number, number, number],
  scale: number = 1,
  attachedHandSide?: `left` | `right` | `mouse`,
  collisionTag?: `weapon-left` | `weapon-right` | `weapon`,
  attachmentPosition?: [number, number, number],
  autoHide?: boolean,
) => {
  const length = 0.4 * scale;
  const bladeThickness = 0.002 * scale;
  const bladeWidth = 0.01 * scale;

  const knucleGap = 0.02 * scale;
  const angle = Math.PI * 0.05;
  const hOfAngle = Math.sin(angle);
  const hAtHalfLegnth = hOfAngle * length * 0.5;

  const color = collisionTag === `weapon-left` ? 0x0000ff : collisionTag === `weapon-right` ? 0xff0000 : 0xff0000;

  const claws = ecs
    .entity(`knuckleClaws`)
    .transform({ position })
    .rigidBody({ kind: `dynamic`, collisionTag: collisionTag ?? `weapon` })
    .inputHandAttachable({
      handAttachableKind: `knuckles`,
      attachmentPosition: attachmentPosition ?? [0, 0, 0],
      attachedHandSide,
      autoHide,
    })
    .addChild(
      ecs
        .entity(`bladeMiddle`)
        .transform({ position: [0, 0, 1.03 * -0.5 * length] })
        .shape_box({ scale: [bladeWidth, bladeThickness, 1.03 * length] })
        .collider({ restitution: 1, colliderEvents: true })
        .graphics({ color })
        .graphicsWithBeat({ colorBeat: 0xffffff })
        .build(),
    )
    .addChild(
      ecs
        .entity(`bladeTop`)
        .transform({ position: [0, knucleGap + hAtHalfLegnth, -0.5 * length], rotation: [angle, 0, 0] })
        .shape_box({ scale: [bladeWidth, bladeThickness, 1.01 * length] })
        .collider({ restitution: 1, colliderEvents: true })
        .graphics({ color })
        .graphicsWithBeat({ colorBeat: 0xffffff })
        .build(),
    )
    .addChild(
      ecs
        .entity(`bladeBottom`)
        .transform({ position: [0, -knucleGap - hAtHalfLegnth, -0.5 * length], rotation: [-angle, 0, 0] })
        .shape_box({ scale: [bladeWidth, bladeThickness, 1.01 * length] })
        .collider({ restitution: 1, colliderEvents: true })
        .graphics({ color })
        .graphicsWithBeat({ colorBeat: 0xffffff })
        .build(),
    )
    .build();

  return claws;
};
