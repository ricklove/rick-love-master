import React, { useEffect, useRef, useState } from 'react';
import {
  defaultDoodleDrawing,
  DoodleConfig,
  DoodleDataWithScore,
  DoodleDrawing,
  DoodleSegment,
  doodleSegmentToSvgPath_line,
} from '@ricklove/doodle-common';
import { C } from '@ricklove/react-controls';
import { ActivityIndicator, Text, TouchableOpacity, View } from '@ricklove/react-native-lite';
import { toKeyValueArray } from '@ricklove/utils-core';
import { groupItems } from '@ricklove/utils-core';
import { useAsyncWorker } from '@ricklove/utils-react';
import { createDoodleDrawingStorageService } from './doodle-storage';

export const styles = {
  drawing: {
    width: 312,
    height: 312,
    color: `#FFFFFF`,
    backgroundColor: `#000000`,
  },
};

export const DoodleTestView = (_props: {}) => {
  const [doodle, setDoodle] = useState(defaultDoodleDrawing());

  return (
    <>
      <DoodleDrawerView style={styles.drawing} drawing={doodle} onChange={setDoodle} />
      <DoodleDisplayView style={styles.drawing} drawing={doodle} />
    </>
  );
};

// export const DoodleDrawingView = (props: { drawing?: DoodleDrawing, onDrawingChanged: (drawing: DoodleDrawing) => void }) => {

//     const [doodle, setDoodle] = useState(props.drawing ?? defaultDoodleDrawing());
//     const changeDoodle = (value: DoodleDrawing) => {
//         setDoodle(value);
//         props.onDrawingChanged(value);
//     };

//     return (
//         <>
//             <DoodleDrawer style={styles.drawing} drawing={doodle} onChange={changeDoodle} />
//             {/* <div>
//                 {JSON.stringify(doodle)}
//             </div> */}
//             {/* <div>
//                 {JSON.stringify(decodeDoodleDrawing(encodeDoodleDrawing(doodle)))}
//             </div> */}

//             {/* <div>
//                 {encodeDoodleDrawing(doodle).doodleText}
//             </div> */}
//             {/* <div>
//                 {encodeDoodleDrawing(decodeDoodleDrawing(encodeDoodleDrawing(doodle))).doodleText}
//             </div>  */}
//         </>
//     );
// };

export const DoodleDrawerView = (props: {
  style: { width: number; height: number; color: string; backgroundColor: string };
  drawing: DoodleDrawing;
  onChange: (drawing: DoodleDrawing) => void;
}) => {
  const { style, drawing, onChange } = props;
  const scale = style.width / drawing.width;

  const [segment, setSegment] = useState(null as null | DoodleSegment);
  const segmentClientStart = useRef(null as null | { clientX: number; clientY: number; x: number; y: number });
  const divHost = useRef(null as null | HTMLDivElement);

  type Ev = React.SyntheticEvent;

  const onIgnore = (e: Ev) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.cancelBubble = true;
    e.nativeEvent.returnValue = false;
    return false;
  };

  const onPressIn = (
    event: Ev & { clientX?: number; clientY?: number },
    pos?: { clientX: number; clientY: number },
  ) => {
    // console.log(`onPressIn`, { event, pos });
    const div = divHost.current;
    if (!div) {
      return onIgnore(event);
    }

    const rect = div.getBoundingClientRect();

    const p = {
      clientX: pos?.clientX ?? event.clientX ?? 0,
      clientY: pos?.clientY ?? event.clientY ?? 0,
    };

    segmentClientStart.current = {
      clientX: p.clientX,
      clientY: p.clientY,
      x: Math.floor((p.clientX - rect.x) / scale),
      y: Math.floor((p.clientY - rect.y) / scale),
    };

    setSegment({
      points: [
        {
          x: segmentClientStart.current.x,
          y: segmentClientStart.current.y,
        },
      ],
    });

    return onIgnore(event);
  };
  const onPressOut = (event: Ev) => {
    // console.log(`onPressOut`, { event });
    const s = segment;
    if (!s) {
      return onIgnore(event);
    }

    onChange({
      ...drawing,
      segments: [...drawing.segments, s],
    });
    setSegment(null);
    segmentClientStart.current = null;

    return onIgnore(event);
  };
  const onMove = (pos: { x: number; y: number }) => {
    setSegment((s) => {
      if (!s) {
        return null;
      }
      const lastPos = s.points[s.points.length - 1];
      if (Math.abs(lastPos.x - pos.x) + Math.abs(lastPos.y - pos.y) <= 2) {
        return s;
      }
      return { points: [...s.points, pos] };
    });
  };
  const onClientMove = (
    event: Ev & { clientX?: number; clientY?: number },
    pos?: { clientX: number; clientY: number },
  ) => {
    if (!segmentClientStart.current) {
      return onIgnore(event);
    }

    // console.log(`onClientMove`, { event, pos });
    const p = {
      clientX: pos?.clientX ?? event.clientX ?? 0,
      clientY: pos?.clientY ?? event.clientY ?? 0,
    };
    const dPos = {
      x: Math.floor((p.clientX - segmentClientStart.current.clientX) / scale) + segmentClientStart.current.x,
      y: Math.floor((p.clientY - segmentClientStart.current.clientY) / scale) + segmentClientStart.current.y,
    };

    onMove(dPos);
    return onIgnore(event);
  };

  // useEffect(() => {
  //     console.log(`divHost`, { divHost });
  //     const div = divHost.current;
  //     if (!div) { return () => { }; }

  //     const onTouchStart = (x: Event) => onPressIn(x, (x as TouchEvent).touches[0]);
  //     const onTouchMove = (x: Event) => onClientMove(x, (x as TouchEvent).touches[0]);

  //     div.addEventListener(`mouseDown`, onPressIn, { passive: false });
  //     div.addEventListener(`onTouchStart`, onTouchStart, { passive: false });
  //     div.addEventListener(`onMouseUp`, onPressOut, { passive: false });
  //     div.addEventListener(`onTouchEnd`, onPressOut, { passive: false });
  //     div.addEventListener(`onMouseLeave`, onPressOut, { passive: false });
  //     div.addEventListener(`onTouchEndCapture`, onPressOut, { passive: false });
  //     div.addEventListener(`onMouseMove`, onClientMove, { passive: false });
  //     div.addEventListener(`onTouchMove`, onTouchMove, { passive: false });

  //     return () => {
  //         div.removeEventListener(`mouseDown`, onPressIn);
  //         div.removeEventListener(`onTouchStart`, onTouchStart);
  //         div.removeEventListener(`onMouseUp`, onPressOut);
  //         div.removeEventListener(`onTouchEnd`, onPressOut);
  //         div.removeEventListener(`onMouseLeave`, onPressOut);
  //         div.removeEventListener(`onTouchEndCapture`, onPressOut);
  //         div.removeEventListener(`onMouseMove`, onClientMove);
  //         div.removeEventListener(`onTouchMove`, onTouchMove);
  //     };
  // }, [divHost.current]);

  useEffect(() => {
    // console.log(`Disable scroll on touch`);
    // Disable document scroll
    const onIgnoreNative = (e: Event) => {
      // If not drawing, don't ignore
      if (!segmentClientStart.current) {
        return true;
      }

      // console.log(`Prevent scroll on touch`);
      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble = true;
      e.returnValue = false;
      return false;
    };
    document.addEventListener(`touchmove`, onIgnoreNative, { passive: false });
    return () => {
      document.removeEventListener(`touchmove`, onIgnoreNative);
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: `relative`,
          width: style.width,
          height: style.height,
          backgroundColor: style.backgroundColor,
        }}
      >
        <svg
          style={{ width: style.width, height: style.height }}
          viewBox={`0 0 ${drawing.width} ${drawing.height}`}
          preserveAspectRatio='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          {drawing.segments.map((x, i) => (
            <path key={i} d={doodleSegmentToSvgPath_line(x)} stroke={style.color} fill='transparent' />
          ))}
          {segment && <path d={doodleSegmentToSvgPath_line(segment)} stroke={style.color} fill='transparent' />}
        </svg>
        <div
          ref={divHost}
          style={{ position: `absolute`, left: 0, right: 0, top: 0, bottom: 0, zIndex: 10 }}
          onMouseDown={onPressIn}
          onMouseUp={onPressOut}
          onMouseMove={onClientMove}
          onMouseLeave={onPressOut}
          onTouchStart={(x) => onPressIn(x, x.touches[0])}
          onTouchEnd={onPressOut}
          onTouchCancel={onPressOut}
          onTouchMove={(x) => onClientMove(x, x.touches[0])}
          onTouchEndCapture={onPressOut}
        />
      </div>
      {/* <div>{doodleToSvg(drawing)}</div>
            <div>{encodeDoodleDrawing(drawing).doodleText}</div> */}
    </>
  );
};

export const DoodleDisplayView = (props: {
  style: { width: number; height: number; color: string; backgroundColor: string };
  drawing: DoodleDrawing;
  shouldAnimate?: boolean;
  animatePointsPerSecond?: number;
  enableRedraw?: boolean;
}) => {
  const [redrawId, setRedrawId] = useState(0);

  const redraw = () => {
    if (!props.enableRedraw) {
      return;
    }
    setRedrawId((s) => s + 1);
  };

  if (props.enableRedraw) {
    return (
      <TouchableOpacity onPress={redraw}>
        <DoodleDisplayView_Inner
          key={redrawId}
          {...props}
          shouldAnimate={redrawId > 0 ? true : props.shouldAnimate ?? true}
        />
      </TouchableOpacity>
    );
  }
  return <DoodleDisplayView_Inner {...props} />;
};
const DoodleDisplayView_Inner = ({
  style,
  drawing,
  shouldAnimate = true,
  animatePointsPerSecond = 20,
}: {
  style: { width: number; height: number; color: string; backgroundColor: string };
  drawing: DoodleDrawing;
  shouldAnimate?: boolean;
  animatePointsPerSecond?: number;
}) => {
  const [tick, setTick] = useState(0);
  const totalPoints = drawing.segments.flatMap((x) => x.points).length;

  useEffect(() => {
    if (!shouldAnimate) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    // console.log(`DoodleDisplayView_Inner.useEffect`);
    const id = setInterval(() => {
      // console.log(`DoodleDisplayView_Inner.useEffect.setInterval`);
      setTick((s) => {
        if (s > totalPoints) {
          clearInterval(id);
        }
        return s + Math.ceil(animatePointsPerSecond / 10);
      });
    }, 10);

    return () => {
      clearInterval(id);
    };
  }, [drawing]);

  let remainingPoints = shouldAnimate ? tick : Number.MAX_SAFE_INTEGER;
  return (
    <div style={{ width: style.width, height: style.height, backgroundColor: style.backgroundColor }}>
      <svg
        style={{ width: style.width, height: style.height }}
        viewBox={`0 0 ${drawing.width} ${drawing.height}`}
        preserveAspectRatio='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        {drawing.segments.map((x, i) => {
          const maxPoints = remainingPoints;
          remainingPoints = Math.max(0, remainingPoints - x.points.length);
          return (
            <path
              key={i}
              d={doodleSegmentToSvgPath_line({ points: [...x.points.slice(0, maxPoints)] })}
              stroke={style.color}
              fill='transparent'
            />
          );
        })}
      </svg>
    </div>
  );
};

export const DoodleBrowser = ({ config }: { config: DoodleConfig }) => {
  const { loading, error, doWork } = useAsyncWorker();
  const [doodles, setDoodles] = useState([] as DoodleDataWithScore[]);
  useEffect(() => {
    doWork(async () => {
      const service = await createDoodleDrawingStorageService(config);
      const result = await service.getAllDrawings();
      setDoodles(result.doodles);
    });
  }, []);

  if (error) {
    return <C.ErrorBox error={error} />;
  }

  if (loading) {
    return <ActivityIndicator size='large' color='#FFFF00' />;
  }

  return <DoodleBrowseView doodles={doodles} />;
};
export const DoodleBrowseView = ({ doodles }: { doodles: DoodleDataWithScore[] }) => {
  const grouped = toKeyValueArray(groupItems(doodles, (x) => x.prompt));

  return (
    <>
      {grouped.map((g) => (
        <View key={g.key} style={{ padding: 4 }}>
          <Text style={{ fontSize: 12 }}>{g.key}</Text>
          <View style={{ padding: 4, flexDirection: `row`, flexWrap: `wrap` }}>
            {g.value.map((x) => (
              <View key={x.key} style={{ padding: 4, alignItems: `center` }}>
                <DoodleDisplayView
                  style={{ width: 104, height: 104, color: `#FFFFFF`, backgroundColor: `#000000` }}
                  drawing={x.drawing}
                  shouldAnimate={false}
                  enableRedraw
                />
                <Text>{`${x.score}`}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </>
  );
};
