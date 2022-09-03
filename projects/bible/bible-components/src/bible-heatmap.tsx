import React, { useEffect, useRef, useState } from 'react';
import { bibleVerseCounts_esv } from '@ricklove/bible-data';
import { createBibleHeatmapData } from './bible-heatmap-logic';
import { getHolySarcasticPhrase } from './holy-sarcasm';

export const BibleHeatmapView = ({
  verseState,
}: {
  verseState: {
    bookName: string;
    chapterNumber: number;
    verseNumber: number;
    scoreRatioA: number;
    scoreRatioB?: number;
    scoreRatioC?: number;
  }[];
}) => {
  const [selfRighteousness, setSelfRighteousness] = useState({ level: 0, phrase: `Unclean!` });
  const canvasRef = useRef(null as null | HTMLCanvasElement);
  useEffect(() => {
    const result = createBibleHeatmapData(bibleVerseCounts_esv, verseState);
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

    setSelfRighteousness({
      level: result.averageScoreRatio,
      phrase: getHolySarcasticPhrase(result.averageScoreRatio),
    });
  }, []);
  return (
    <>
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
        }}
      >
        <div
          style={{
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            padding: 16,
            maxWidth: 480,
            textAlign: `center`,
          }}
        >
          <div>Bible Reading Progress</div>
          <div style={{ width: `100%` }}>
            <canvas style={{ width: `100%`, imageRendering: `pixelated` }} ref={canvasRef} />
          </div>
          <div style={{ width: `100%`, display: `flex`, flexDirection: `column`, alignItems: `center` }}>
            <div>{`Self-Righteousness Indicator:`}</div>

            <div
              style={{
                alignSelf: `stretch`,
                display: `flex`,
                flexDirection: `row`,
                alignItems: `center`,
              }}
            >
              {`🥴`}
              <div
                style={{
                  width: `100%`,
                  height: 20,
                  color: `#FFFFFF`,
                  textShadow: `0px 1px 3px #000000`,
                  backgroundColor: `#000000`,
                  borderRadius: 4,
                  border: `1px solid #444444`,
                  overflow: `hidden`,
                }}
              >
                <div
                  style={{
                    width: `${Math.ceil(selfRighteousness.level * 100)}%`,
                    height: `100%`,
                    backgroundColor: `#FF0000`,
                    textAlign: `right`,
                  }}
                >
                  <span>{`${(selfRighteousness.level * 100).toFixed(2)}%`}</span>
                </div>
              </div>
              {`😇`}
            </div>
            <div>{selfRighteousness.phrase}</div>
            <div style={{ fontFamily: `Georgia`, fontStyle: `italic`, margin: 16 }}>
              {`Matthew 5:20 For I tell you, unless your righteousness exceeds that of the scribes and Pharisees, you will
              never enter the kingdom of heaven. (ESV)`}
            </div>
            <div style={{ textAlign: `left` }}>
              {`Let this 'Self-Righteousness Indicator' be a reminder that Jesus is our only hope. We have the opportunity
              to study his word and the opportunity to serve others and share his teachings, but that is solely because
              he loves us and welcomes us to do so - despite our failures.`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
