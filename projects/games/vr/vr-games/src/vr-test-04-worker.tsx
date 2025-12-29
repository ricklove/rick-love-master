/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useRef } from 'react';
import { createGameEngine } from './_kiss/core/engine';
// import { createScene } from './bare/00-bare-three-vr';

export const VrTestGame = ({ worker }: { worker: Worker }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const unsubscribes = [] as (() => void)[];

    const timeoutId = setTimeout(() => {
      if (!ref.current) return;

      const scene = createGameEngine(ref.current, worker);
      const { animate, dispose } = scene.setup();
      unsubscribes.push(dispose);
      animate();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return (
    <>
      <div ref={ref} style={{ background: `#00ff00` }} />
    </>
  );
};
