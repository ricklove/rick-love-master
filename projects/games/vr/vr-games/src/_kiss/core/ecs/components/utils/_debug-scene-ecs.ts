import { Ecs } from '../_components';
import { AbstractEntityDesc, debugScene } from './_debug-scene';

const dotPrefab = (
  ecs: Ecs,
  {
    position,
    color = 0x00ff00,
    scale = [0.1, 0.1, 0.1],
  }: {
    position: [number, number, number];
    color?: number;
    scale?: [number, number, number];
  },
) => ecs.entity(`dot`, true).transform({ position }).shape_box({ scale }).graphics({ color }).build();

const createDebugScene =
  (
    getPoints: () => {
      points: {
        position: [number, number, number];
        color?: number;
        scale?: [number, number, number];
      }[];
    },
  ) =>
  (ecs: Ecs) => {
    const { points } = getPoints();
    const root = ecs
      .entity(`root`)
      .transform({ position: [0, 0, 0] })
      .addChildren(
        points.map((x) => {
          return dotPrefab(ecs, x);
        }),
      )
      .build();

    return root;
  };

export const setupDebugSceneWithEcs = () => {
  debugScene.setup(
    (getPoints) => (ecs) => createDebugScene(getPoints)(ecs as unknown as Ecs) as unknown as AbstractEntityDesc,
  );
};
