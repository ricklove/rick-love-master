import { useThree } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { Group } from 'three';

export const useCamera = () => {
  //   const player = useXR((state) => state.player);
  //   return player.children[0];

  const camera = useThree((state) => state.camera);
  return camera;
};

export const usePlayer = () => {
  return useXR((state) => state.player) as Omit<Group, `children`>;
};
