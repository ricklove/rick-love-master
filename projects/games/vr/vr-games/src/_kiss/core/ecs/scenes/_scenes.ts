import { Ecs } from '../components/_components';
import { AbstractEcs, AbstractEntityDesc } from '../components/utils/_debug-scene';
import { setupDebugSceneWithEcs } from '../components/utils/_debug-scene-ecs';
import { debugScenes } from '../components/utils/_debug-scene-list';
import { EntityDescUntyped } from '../ecs-engine';
import { createScene_beatSaber } from './beat-saber';

setupDebugSceneWithEcs();

export const scenes: {
  key: string;
  createScene: (
    ecs: Ecs & AbstractEcs,
    params: { key: string; value: string }[],
  ) => EntityDescUntyped | AbstractEntityDesc;
}[] = [{ key: `beatSaber`, createScene: createScene_beatSaber }, ...debugScenes];
