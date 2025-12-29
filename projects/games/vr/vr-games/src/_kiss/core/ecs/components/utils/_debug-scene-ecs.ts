import { EntityInstanceUntyped } from '../../ecs-engine';
import { createHands } from '../../prefabs/hands';
import { Ecs } from '../_components';
import { EntityActionCode } from '../actions/parser';
import { EntityInstance_ShapeText } from '../shape-text';
import { EntityInstance_Transform } from '../transform';
import { AbstractEntityDesc, debugScene, DebugSceneResult } from './_debug-scene';

const dotPrefab = (
  ecs: Ecs,
  {
    position,
    color = 0x00ff00,
    scale = [0.1, 0.1, 0.1],
    text = ``,
  }: {
    position: [number, number, number];
    color?: number;
    scale?: [number, number, number];
    text?: string;
  },
  index: number,
) =>
  ecs
    .entity(`dot-${index}`, true)
    .transform({ position })
    .shape_box({ scale })
    .graphics({ color })
    .addChildren(
      !text
        ? []
        : [
            ecs
              .entity(`text`, true)
              .transform({ position: [0, 0, scale[2]] })
              .moveRelativeToParent({})
              .shape_text({ text, fontSize: scale[1], alignment: `center`, verticalAlignment: `center` })
              .graphics({ color: 0xffffff })
              .build(),
          ],
    )
    .build();

const actionPrefab = (
  ecs: Ecs,
  {
    name,
    position,
    callback,
  }: {
    name: string;
    position: [number, number, number];
    callback: (entityInstance: EntityInstanceUntyped) => void;
  },
) => {
  const entity = ecs
    .entity(`action`, true)
    .transform({ position })
    .rigidBody({
      kind: `dynamic`,
      gravityScale: 0,
    })
    .collisionAction({
      collisionTagFilter: `hand`,
      action: `debugAction.callback({})` as EntityActionCode,
    })
    .debugAction({ callback })
    .addChild(
      ecs
        .entity(`dot`, true)
        .transform({ position: [0, 0, 0] })
        .shape_sphere({ radius: 0.005 })
        .collider({ sensor: true, colliderEvents: true })
        .graphics({ color: 0x00ff00 })
        .build(),
    )
    .addChild(
      ecs
        .entity(`text`, true)
        .transform({ position: [0.01, 0, 0] })
        .moveRelativeToParent({})
        .shape_text({ text: name, fontSize: 0.01, alignment: `left`, verticalAlignment: `center` })
        .graphics({ color: 0xffffff })
        .build(),
    )
    .build();

  return entity;
};

const createDebugScene = (getResult: () => DebugSceneResult) => (ecs: Ecs) => {
  const { getPoints, actions } = getResult();
  const actionsList = Object.entries(actions ?? {});

  const hands = createHands(ecs, 0.0025);
  const inputs = ecs
    .entity(`inputs`, true)
    .addChild(hands.hands.left)
    .addChild(hands.hands.right)
    .addChild(hands.controllerHands.left)
    .addChild(hands.controllerHands.right)
    .addChild(hands.mouseHand)
    .build();

  const pointEntities = getPoints().map((x, i) => dotPrefab(ecs, x, i));

  const root = ecs
    .entity(`root`)
    .transform({ position: [0, 0, 0] })
    .addChild(inputs)
    .addChildren(pointEntities)
    .addChildren(
      actionsList.map(([name, action], i) => {
        const yStart = 1.2;
        const ySize = -0.015;

        let intervalId = undefined as undefined | ReturnType<typeof setInterval>;

        return actionPrefab(ecs, {
          name: name,
          position: [-0.2, yStart + ySize * i, -0.5],
          callback: (entityInstance) => {
            const intervalTimeMs = action.intervalTimeMs;
            if (!intervalTimeMs) {
              action.execute();
              return;
            }

            // toggle on/off
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = undefined;
              return;
            }
            intervalId = setInterval(() => {
              action.execute();
              const dotEntityInstances = entityInstance.parent.children.filter((x) => x.desc.name.startsWith(`dot-`));
              const points = getPoints();
              dotEntityInstances.forEach((x, i) => {
                const p = points[i];
                const eTransform = x as unknown as EntityInstance_Transform;
                eTransform.transform.move(p.position);

                if (p.text) {
                  const eText = x.children[0] as unknown as EntityInstance_ShapeText;
                  eText?.shape.setText(p.text);
                }
              });

              console.log(`actionPrefab`, { p0: points[0].position[0], points, dotEntityInstances });
            }, intervalTimeMs);
          },
        });
      }),
    )
    .build();

  console.log(`createDebugScene`, { getPoints, root });

  return root;
};

export const setupDebugSceneWithEcs = () => {
  debugScene.setup(
    (getResult) => (ecs) => createDebugScene(getResult)(ecs as unknown as Ecs) as unknown as AbstractEntityDesc,
  );
};
