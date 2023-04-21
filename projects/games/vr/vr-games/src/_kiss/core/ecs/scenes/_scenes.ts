import { Ecs } from '../components/_components';
import { AbstractEcs, AbstractEntityDesc } from '../components/utils/_debug-scene';
import { setupDebugSceneWithEcs } from '../components/utils/_debug-scene-ecs';
import { testScenes_smoothCurve } from '../components/utils/smooth-curve.scene';
import { EntityDescUntyped } from '../ecs-engine';
import { createScene_beatSaber } from './beat-saber';

setupDebugSceneWithEcs();

export const scenes: {
  key: string;
  createScene: (
    ecs: Ecs & AbstractEcs,
    params: { key: string; value: string }[],
  ) => EntityDescUntyped | AbstractEntityDesc;
}[] = [
  { key: `beatSaber`, createScene: createScene_beatSaber },
  // ?scene=smoothCurve&input=sine2
  testScenes_smoothCurve,
];
