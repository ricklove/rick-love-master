import { AbstractEcs, AbstractEntityDesc } from './_debug-scene';
import { testSceneSmoothCurve } from './smooth-curve.scene';
import { testSceneVirtualList } from './vistual-list.scene';

export const debugScenes = [
  // ?scene=SmoothCurve&input=sine2
  testSceneSmoothCurve,
  // ?scene=VirtualList&input=sine2
  testSceneVirtualList,
] satisfies {
  key: string;
  createScene: (
    ecs: AbstractEcs,
    params: { key: string; value: string }[],
    onParamsChanged: (params: { key: string; value: string }[]) => void,
  ) => AbstractEntityDesc;
}[];
