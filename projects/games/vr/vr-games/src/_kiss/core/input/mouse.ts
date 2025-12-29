export type MouseState = {
  time: number;
  u: number;
  v: number;
  clientX: number;
  clientY: number;
  /**
   * 0: No button or un-initialized
   * 1: Primary button (usually the left button)
   * 2: Secondary button (usually the right button)
   * 4: Auxiliary button (usually the mouse wheel button or middle button)
   * 8: 4th button (typically the "Browser Back" button)
   * 16: 5th button (typically the "Browser Forward" button)
   */
  buttons: number;

  /**
   * Sideways scrolling
   *
   * - 1 is a single scroll click
   */
  wheelDeltaX: number;

  /**
   * Vertical scrolling
   *
   * - Negative values are scrolling up
   * - Positive values are scrolling down
   *
   * - 1 is a single scroll click
   */
  wheelDeltaY: number;
};

export const setupMouseInput = () => {
  const mouseState: MouseState = {
    time: 0,
    u: 0,
    v: 0,
    clientX: 0,
    clientY: 0,
    buttons: 0,
    wheelDeltaX: 0,
    wheelDeltaY: 0,
  };

  const mouseMove = (e: MouseEvent) => {
    mouseState.time = performance.now();
    mouseState.wheelDeltaX = 0;
    mouseState.wheelDeltaY = 0;

    const x = e.clientX;
    const y = e.clientY;
    mouseState.clientX = x;
    mouseState.clientY = y;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const u = x / (w * 0.5) - 1;
    const v = -(y / (h * 0.5) - 1);
    mouseState.u = u;
    mouseState.v = v;

    // console.log(`mouseMove`, { u, v, x, y, w, h });
  };

  const mouseDown = (e: MouseEvent) => {
    mouseState.time = performance.now();
    mouseState.wheelDeltaX = 0;
    mouseState.wheelDeltaY = 0;

    mouseState.buttons = e.buttons;

    console.log(`mouseDown`, { ...mouseState, e });
  };

  const mouseUp = (e: MouseEvent) => {
    mouseState.time = performance.now();
    mouseState.wheelDeltaX = 0;
    mouseState.wheelDeltaY = 0;

    mouseState.buttons = e.buttons;

    console.log(`mouseUp`, { ...mouseState, e });
  };

  const mouseWheel = (e: WheelEvent) => {
    mouseState.time = performance.now();
    mouseState.wheelDeltaY = e.deltaY / 100;
    mouseState.wheelDeltaX = e.deltaX / 100;

    console.log(`mouseWheel`, { ...mouseState, e });
  };

  window.addEventListener(`mousemove`, mouseMove);
  window.addEventListener(`mousedown`, mouseDown);
  window.addEventListener(`mouseup`, mouseUp);
  window.addEventListener(`wheel`, mouseWheel);

  return {
    mouseState,
    unsubscribe: () => {
      window.removeEventListener(`mousemove`, mouseMove);
      window.removeEventListener(`mousedown`, mouseDown);
      window.removeEventListener(`mouseup`, mouseUp);
      window.removeEventListener(`wheel`, mouseWheel);
    },
  };
};
