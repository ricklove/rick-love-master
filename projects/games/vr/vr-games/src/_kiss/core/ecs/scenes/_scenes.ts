import { Ecs } from '../components/_components';
import { setupDebugSceneWithEcs } from '../components/utils/_debug-scene-ecs';
import { testScenes_smoothCurve } from '../components/utils/smooth-curve.scene';
import { EntityDescUntyped } from '../ecs-engine';
import { createScene_beatSaber } from './beat-saber';

setupDebugSceneWithEcs();

export const scenes: { key: string; createScene: (ecs: Ecs) => EntityDescUntyped }[] = [
  { key: `beatSaber`, createScene: createScene_beatSaber },
  ...testScenes_smoothCurve.map((x) => ({
    key: `smoothCurve_${x.key}`,
    createScene: (ecs: Ecs) => x.createScene(ecs) as EntityDescUntyped,
  })),
];
