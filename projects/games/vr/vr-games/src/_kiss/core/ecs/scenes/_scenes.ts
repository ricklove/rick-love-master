import { Ecs } from '../components/_components';
import { testScenes_smoothCurve } from '../components/utils/smooth-curve.scene';
import { EntityDescUntyped } from '../ecs-engine';
import { createScene_beatSaber } from './beat-saber';

export const scenes: { key: string; createScene: (ecs: Ecs) => EntityDescUntyped }[] = [
  { key: `beatSaber`, createScene: createScene_beatSaber },
  ...testScenes_smoothCurve.map((x) => ({ ...x, key: `smoothCurve_${x.key}` })),
];
