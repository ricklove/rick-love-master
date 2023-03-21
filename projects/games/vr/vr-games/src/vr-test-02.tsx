/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import { TrackballControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import { SceneManager } from './react-with-rapier/scenes/scene-manager';

export const VrTestGame = () => {
  return (
    <>
      <div style={{ position: `fixed`, bottom: 0, top: 0, left: 0, right: 0, background: `#000000` }}>
        <VRPage />
        {/* <NonVrPage /> */}
      </div>
    </>
  );
};

const VRPage = () => {
  const [mode, setMode] = useState(undefined as undefined | `vr` | `3d`);
  useEffect(() => {
    (async () => {
      try {
        const isSupported = (await navigator.xr?.isSessionSupported(`immersive-vr`)) ?? false;
        if (isSupported) {
          setMode(`vr`);
          return;
        }
      } catch {
        // empty
      }
      setMode(`3d`);
    })();
  }, []);
  return (
    <>
      {mode === `vr` && <VRButton onError={(e) => console.error(e)} />}
      <Canvas>
        <XR referenceSpace={`local-floor`}>
          {mode === `3d` && <TrackballControls />}
          <Scene_B_WithReactAndRapier />
        </XR>
      </Canvas>
    </>
  );
};

const Scene_B_WithReactAndRapier = ({ debugVisible = true }: { debugVisible?: boolean }) => {
  return (
    <>
      <group>
        <SceneManager />
      </group>
    </>
  );
};
