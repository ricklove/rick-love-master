import React, { useRef } from 'react';
import { Box, Cone, Cylinder, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useXR } from '@react-three/xr';
import { Vector3 } from 'three';
import { useCamera, usePlayer } from '../../components/camera';
import { logger } from '../../utils/logger';
import { SceneLayout } from './scene-layout';

export const SceneCrafting = () => {
  return (
    <SceneLayout gravity={[0, 0, 0]}>
      {/* Floor */}
      <RigidBody type='fixed' colliders='cuboid'>
        <Box position={[0, -100, 0]} args={[10000, 200, 10000]}>
          <meshStandardMaterial color={0x333333} />
        </Box>
      </RigidBody>

      <Menu />
    </SceneLayout>
  );
};

const Menu = () => {
  const isXR = useXR((s) => s.isPresenting);
  const camera = useCamera();
  const player = usePlayer();
  const ref = useRef<RapierRigidBody>(null);

  const working = useRef({
    vMenuBottomLeft: new Vector3(),
    vMenuCenter: new Vector3(),
    vMenuCenterAtDepth: new Vector3(),
    vMenu: new Vector3(),
    vCenterAtScreen: new Vector3(),
    vCenterAtDepth: new Vector3(),
    dir: new Vector3(),
    vInside: new Vector3(),
  });
  useFrame(() => {
    if (!ref.current) {
      return;
    }

    // if (2 === 3 - 1) {
    //   return;
    // }

    const w = working.current;
    if (!isXR) {
      w.vMenuBottomLeft.set(-0.97, -0.97, 0).unproject(camera);
      w.vMenuCenter.set(-0.8, -0.8, 0).unproject(camera);
      w.vMenuCenterAtDepth.set(-0.8, -0.8, 1).unproject(camera);
      w.dir.copy(w.vMenuCenterAtDepth).sub(w.vMenuCenter).normalize();

      w.vMenu.copy(w.vMenuCenter).add(w.vInside.copy(w.dir).multiplyScalar(0.75));

      ref.current.setNextKinematicTranslation(w.vMenu);
      ref.current.setNextKinematicRotation(camera.quaternion);
      logger.log(`vMenu`, { isXR, w, player, camera });
      return;
    }
  });

  const shapeComponents = [Box, Sphere, Cylinder, Cone];
  const col = 3;
  const row = 3;
  const gridSize = 0.05;
  const width = col * gridSize;
  const height = row * gridSize;
  const xOffset = (-width + gridSize) * 0.5;
  const zOffset = (-height + gridSize) * 0.5;
  return (
    <>
      <RigidBody ref={ref} type='kinematicPosition' colliders='cuboid' sensor>
        <group rotation={[Math.PI * 0.5, 0, 0]}>
          {shapeComponents.map((X, i) => (
            <X
              key={i}
              scale={0.02}
              rotation={[-Math.PI * 0.5, 0, 0]}
              position={[
                (i % col) * gridSize + xOffset,
                0.02 + gridSize * 0.5,
                Math.floor(i / col) * gridSize + zOffset,
              ]}
            >
              <meshStandardMaterial color={`#c0c0c0`} />
            </X>
          ))}
          <Box args={[width, 0.01, height]} position={[0, 0.005, 0]}>
            <meshStandardMaterial color={`#5c5c5c`} />
          </Box>
        </group>
      </RigidBody>
    </>
  );
};
