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

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
  camera.position.set(0, 1.6, 3);
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

  const button = VRButton.createButton(renderer);
  host.appendChild(button);

  const dispose = () => {
    logger.log(`setupThree: dispose`, {});

    renderer.setAnimationLoop(null);
    window.removeEventListener(`resize`, onWindowResize);
    host.removeChild(button);
    host.removeChild(container);
    renderer.dispose();
    scene.clear();
  };

  const raycaster = new THREE.Raycaster();

  logger.log(`setupThree: DONE`, { camera, scene, renderer });
  return { camera, scene, renderer, raycaster, dispose };
};
