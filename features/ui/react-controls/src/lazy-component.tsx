import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { delay } from '@ricklove/utils-core';

// eslint-disable-next-line @typescript-eslint/naming-convention
const debug_timeStart = Date.now();
const globalRelayoutCallbacks = [] as (null | (() => boolean))[];
let activeNotifyRelayoutId = 0;
const notifyRelayout = () => {
  (async () => {
    // Cancellable
    activeNotifyRelayoutId++;
    const notifyRelayoutId = activeNotifyRelayoutId;
    await delay(10);

    // console.log('LazyComponent notifyRelayout', {notifyRelayoutId});

    let i = 0;
    while (i < globalRelayoutCallbacks.length) {
      const callback = globalRelayoutCallbacks[i];
      if (callback && callback()) {
        await delay(5);
      }
      i++;

      if (notifyRelayoutId !== activeNotifyRelayoutId) {
        // Cancelled
        // console.log('LazyComponent notifyRelayout - Cancelled', {notifyRelayoutId});
        return;
      }
    }
  })();
};
window.addEventListener(`scroll`, notifyRelayout);
window.addEventListener(`load`, () => {
  const observer = new IntersectionObserver(notifyRelayout);
  // Observe any element
  observer.observe(document.getElementsByTagName(`body`)[0]);
});

let nextLazyComponentId = 0;

export const LazyComponent = ({ children, onLoad }: { children: ReactNode; onLoad?: () => void }) => {
  const placeholderRef = useRef(null as null | HTMLDivElement);
  const [shouldLoad, setShouldLoad] = useState(false);
  const isDoneRef = useRef(false);
  const lazyComponentId = useRef(nextLazyComponentId++);

  useEffect(() => {
    // console.log('LazyComponent useEffect', {lazyComponentId});

    if (!placeholderRef.current) {
      // console.log('LazyComponent useEffect - SKIP placeholderRef is missing', {lazyComponentId});
      return;
    }
    const placeholder = placeholderRef.current;
    isDoneRef.current = false;

    const loadIfVisible = () => {
      // console.log('LazyComponent useEffect:loadIfVisible', {lazyComponentId});

      if (!placeholderRef.current) {
        // console.log('LazyComponent useEffect:loadIfVisible - SKIP placeholderRef is missing', {lazyComponentId});
        return false;
      }
      if (isDoneRef.current) {
        // console.log('LazyComponent useEffect:loadIfVisible - SKIP isDone', {lazyComponentId});
        return false;
      }

      const divRect = placeholder.getBoundingClientRect();
      const screenBottomExact = window.innerHeight;
      const OFFSCREEN_LOAD_HEIGHT = 100;
      const screenBottom = screenBottomExact + OFFSCREEN_LOAD_HEIGHT;
      const isOnScreen = divRect.top < screenBottom && divRect.bottom > 0 - OFFSCREEN_LOAD_HEIGHT;

      if (!isOnScreen) {
        return false;
      }
      // console.log(`isOnScreen`, { time: Date.now() - debug_timeStart, iRelayout, divRect, screenBottom, isOnScreen });

      isDoneRef.current = true;
      unsub();
      setShouldLoad(true);
      notifyRelayout();
      onLoad?.();

      return true;
    };

    const iRelayout = globalRelayoutCallbacks.length;
    globalRelayoutCallbacks.push(loadIfVisible);
    const unsub = () => {
      globalRelayoutCallbacks[iRelayout] = null;
    };

    notifyRelayout();

    return () => {
      isDoneRef.current = true;
      unsub();
    };
  }, [children, onLoad]);

  // console.log('LazyComponent RENDER', {lazyComponentId});
  return (
    <>
      {!shouldLoad && <div ref={placeholderRef} style={{ minWidth: 100, minHeight: 100 }} />}
      {shouldLoad && children}
    </>
  );
};
