import * as THREE from 'three';
import { VRButton } from 'three-stdlib';
import { logger } from '../../utils/logger';

export const setupThree = (hostRaw: HTMLDivElement) => {
  //  const host = hostRaw;
  const host = document.body;
  const container = document.createElement(`div`);

  host.appendChild(container);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x505050);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 0);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  function onWindowResize() {
    logger.log(`setupThree: onWindowResize`, { innerWidth: window.innerWidth, innerHeight: window.innerHeight });
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener(`resize`, onWindowResize);

  renderer.xr.setReferenceSpaceType(`local-floor`);
  const button = VRButton.createButton(renderer);
  host.appendChild(button);

  // const controllerKinds = [] as {
  //   isHand: boolean;
  //   handedness: XRHandedness;
  // }[];

  // const handleInputSourcesChange = (
  //   e: THREE.Event & {
  //     type: 'inputsourceschange';
  //   } & {
  //     target: THREE.WebXRManager;
  //   },
  // ) => {
  //   e.target.session.inputSources.forEach((inputSource) => {

  //   });
  //   xrState.inputSources = e.session.inputSources;
  //   xrState.isHandTracking = Object.values(e.session.inputSources).some((source) => source.hand);
  // };
  // renderer.xr.addEventListener(`inputsourceschange`, handleInputSourcesChange);

  //   const xrState = {
  //     isVisible: false,
  //     isPresenting: false,
  //     isHandTracking: false,
  //     inputSources: [] as XRInputSourceArray,
  //     session: undefined as undefined | XRSession,
  //   };
  //   const handleSessionStart = (nativeEvent: { target: WebXRManager }) => {
  //     xrState.isPresenting = true;
  //     if (xrState.session) {
  //       xrState.session.removeEventListener(`visibilitychange`, handleVisibilityChange);
  //       xrState.session.removeEventListener(`inputsourceschange`, handleInputSourcesChange);
  //     }
  //     xrState.session = nativeEvent.target.getSession() ?? undefined;
  //     if (!xrState.session) {
  //       return;
  //     }

  //     xrState.session.addEventListener(`visibilitychange`, handleVisibilityChange);
  //     xrState.session.addEventListener(`inputsourceschange`, handleInputSourcesChange);
  //   };
  //   const handleSessionEnd = () => {
  //     xrState.isPresenting = false;
  //     if (xrState.session) {
  //       xrState.session.removeEventListener(`visibilitychange`, handleVisibilityChange);
  //       xrState.session.removeEventListener(`inputsourceschange`, handleInputSourcesChange);
  //     }
  //     xrState.session = undefined;
  //   };
  //   renderer.xr.addEventListener(`sessionstart`, handleSessionStart);
  //   renderer.xr.addEventListener(`sessionend`, handleSessionEnd);

  //   const handleVisibilityChange = (e: XRSessionEvent) => {
  //     xrState.isVisible = e.session.visibilityState === `visible`;
  //   };
  //   const handleInputSourcesChange = (e: XRInputSourceChangeEvent) => {
  //     xrState.inputSources = e.session.inputSources;
  //     xrState.isHandTracking = Object.values(e.session.inputSources).some((source) => source.hand);
  //   };

  const dispose = () => {
    logger.log(`setupThree: dispose`, {});

    renderer.setAnimationLoop(null);
    // renderer.xr.removeEventListener(`sessionstart`, handleSessionStart);
    // renderer.xr.removeEventListener(`sessionend`, handleSessionEnd);
    // handleSessionEnd();
    // renderer.xr.removeEventListener(`inputsourceschange`, (e) => handleInputSourcesChange);
    window.removeEventListener(`resize`, onWindowResize);
    host.removeChild(button);
    host.removeChild(container);
    renderer.dispose();
    scene.clear();
  };

  logger.log(`setupThree: DONE`, { camera, scene, renderer });
  return { camera, scene, renderer, dispose };
};
