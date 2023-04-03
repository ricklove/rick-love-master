import { Vector3 } from 'three';
import { GameWorkerEngine } from '../../types';

export const createDotField = ({ createEntity }: GameWorkerEngine) => {
  const createDot = (position: Vector3, color: number) => {
    const dotSphere = createEntity({
      type: `dot` as const,
      active: true,
      shape: `sphere` as const,
      position,
      radius: 0.01,
      sensor: true,
      gravityScale: 0,
      userData: {
        markedAt: 0,
      },
      color,
    });

    const dotText = createEntity({
      type: `dotText` as const,
      active: true,
      shape: `text` as const,
      position,
      fontSize: 0.01,
      color,
    });

    return { dot: dotSphere, text: dotText };
  };
  //   const dots = [
  //     { type: `debugHead` as const, size: 0.1, color: 0xff00ff },
  //     { type: `debugR` as const, size: 0.01, color: 0xff0000 },
  //     { type: `debugG` as const, size: 0.008, color: 0x00ff00 },
  //     { type: `debugB` as const, size: 0.01, color: 0x0000ff },
  //   ].flatMap(({ type, color, size }) =>
  //     [...Array(100)]
  //       .map((_, i) => ({
  //         type,
  //         active: false,
  //         shape: `sphere` as const,
  //         position: new Vector3(0, -1000, 0),
  //         radius: size,
  //         sensor: true,
  //         gravityScale: 0,
  //         userData: {
  //           markedAt: 0,
  //         },
  //         color,
  //       }))
  //       .map(createEntity),
  //   );

  return {
    update: (deltaTimeSec: number, player: { origin: { position: Vector3 } }) => {
      // TODO: update dots
    },
  };
};
