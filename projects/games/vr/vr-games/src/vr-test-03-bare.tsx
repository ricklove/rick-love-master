/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { createBareThreeScene } from './bare/bare-three';

export const VrTestGame = () => {
  const load = () => {
    createBareThreeScene();
  };

  return (
    <>
      <div style={{ position: `relative` }}>
        <div style={{ position: `absolute`, bottom: 0, top: 0, left: 0, right: 0, background: `#000000` }}>
          <button onClick={load}>Load</button>
        </div>
      </div>
    </>
  );
};
