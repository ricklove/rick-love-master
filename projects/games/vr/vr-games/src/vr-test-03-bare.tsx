/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect } from 'react';
import { createBareThreeScene } from './bare/00-bare-three';

export const VrTestGame = () => {
  useEffect(() => {
    const scene = createBareThreeScene();
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
