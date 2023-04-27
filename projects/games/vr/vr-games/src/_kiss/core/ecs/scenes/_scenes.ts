import { postMessageFromWorker } from '../../messages/message';
import { Ecs } from '../components/_components';
import { AbstractEcs, AbstractEntityDesc, debugScene } from '../components/utils/_debug-scene';
import { setupDebugSceneWithEcs } from '../components/utils/_debug-scene-ecs';
import { debugScenes } from '../components/utils/_debug-scene-list';
import { EntityDescUntyped } from '../ecs-engine';
import { createScene_beatSaber } from './beat-saber';

setupDebugSceneWithEcs();

const sceneList: {
  key: string;
  createScene: (
    ecs: Ecs & AbstractEcs,
    params: { key: string; value: string }[],
    onParamsChanged: (params: { key: string; value: string }[]) => void,
  ) => EntityDescUntyped | AbstractEntityDesc;
}[] = [{ key: `beatSaber`, createScene: createScene_beatSaber }, ...debugScenes];

const mainMenuScene = debugScene.create({
  name: `MainMenu`,
  inputs: {},
  getResult: () => {
    return {
      getPoints: () => [],
      actions: Object.fromEntries(
        sceneList.map((x) => [
          x.key,
          {
            execute: () => {
              postMessageFromWorker({ kind: `navigateToUrl`, url: `?scene=${x.key}` });
            },
          },
        ]),
      ),
    };
  },
});

export const scenes = [mainMenuScene, ...sceneList];
