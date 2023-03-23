import { VRButton } from 'three-stdlib';
import { createBareThreeScene } from './00-bare-three';

export const createBareVRScene = () => {
  const scene = createBareThreeScene();
  scene.renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(scene.renderer));
  return {
    ...scene,
  };
};
