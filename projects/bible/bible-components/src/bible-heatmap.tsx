import React, { useEffect, useRef } from 'react';
import { bibleVerseCounts_esv } from '@ricklove/bible-data';
import { createBibleHeatmapData } from './bible-heatmap-logic';

export const BibleHeatmapView = () => {
  const canvasRef = useRef(null as null | HTMLCanvasElement);
  useEffect(() => {
    const result = createBibleHeatmapData(bibleVerseCounts_esv);
    const cvs = canvasRef.current;
    if (!cvs) {
      return;
    }
    const ctx = cvs.getContext(`2d`);
    if (!ctx) {
      return;
    }
    cvs.width = result.imageData.width;
    cvs.height = result.imageData.height;
    ctx.putImageData(result.imageData, 0, 0);
  }, []);
  return (
    <>
      <div>
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};
