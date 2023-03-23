/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect } from 'react';
// import { createBareVRScene } from './bare/01-bare-vr';
import { createScene } from './bare/00-bare-three-vr';

export const VrTestGame = () => {
  useEffect(() => {
    const scene = createScene();
    scene.animate();
    return () => scene.dispose();
  }, []);

  return (
    <>
      <div style={{ position: `relative` }}>
        <div style={{ position: `absolute`, bottom: 0, top: 0, left: 0, right: 0, background: `#000000` }} />
      </div>
    </>
  );
};
