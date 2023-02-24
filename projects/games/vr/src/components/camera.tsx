import { useThree } from '@react-three/fiber';
import { useXR, XRState } from '@react-three/xr';
import { Group, PerspectiveCamera } from 'three';

export const useCamera = () => {
  //   const player = useXR((state) => state.player);
  //   return player.children[0];

  const camera = useThree((state) => state.camera);
  return camera as PerspectiveCamera;
};

export type XRStateWithPlayerDolly = XRState & { playerDolly: Omit<Group, `children`> };
export const usePlayer = () => {
  return useXR((state) => (state as XRStateWithPlayerDolly).playerDolly);
};
