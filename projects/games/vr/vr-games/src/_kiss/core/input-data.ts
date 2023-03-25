export const handJointNames = [
  `wrist`,
  `thumb-metacarpal`,
  `thumb-phalanx-proximal`,
  `thumb-phalanx-distal`,
  `thumb-tip`,
  `index-finger-metacarpal`,
  `index-finger-phalanx-proximal`,
  `index-finger-phalanx-intermediate`,
  `index-finger-phalanx-distal`,
  `index-finger-tip`,
  `middle-finger-metacarpal`,
  `middle-finger-phalanx-proximal`,
  `middle-finger-phalanx-intermediate`,
  `middle-finger-phalanx-distal`,
  `middle-finger-tip`,
  `ring-finger-metacarpal`,
  `ring-finger-phalanx-proximal`,
  `ring-finger-phalanx-intermediate`,
  `ring-finger-phalanx-distal`,
  `ring-finger-tip`,
  `pinky-finger-metacarpal`,
  `pinky-finger-phalanx-proximal`,
  `pinky-finger-phalanx-intermediate`,
  `pinky-finger-phalanx-distal`,
  `pinky-finger-tip`,
] as const satisfies readonly XRHandJoint[];

const handJointNameIndex = Object.fromEntries(handJointNames.map((name, index) => [name, index] as const));

/** Position, Quanternion for each */
enum InputBufferIndex {
  handLeft = 0,
  handRight = handLeft + handJointNames.length * 3,
  camera = handRight + handJointNames.length * 3,
  controllerLeft = camera + 7,
  controllerRight = controllerLeft + 7,
  controllerGripLeft = controllerRight + 7,
  controllerGripRight = controllerGripLeft + 7,
  COUNT = controllerGripRight + 7,
}

export const createInputBuffer = () => {
  return new Float32Array(InputBufferIndex.COUNT);
};
export const readXrInput = (renderer: THREE.WebGLRenderer, frame: XRFrame, buffer: Float32Array) => {
  const session = frame?.session;
  if (!session) {
    return;
  }

  const referenceSpace = renderer.xr.getReferenceSpace();
  if (!referenceSpace) {
    return;
  }

  const camera = renderer.xr.getCamera();
  camera.matrixWorld.toArray(buffer, InputBufferIndex.camera);

  [0, 1].forEach((sideOffset) => {
    const controller = renderer.xr.getController(sideOffset);
    controller.position.toArray(buffer, InputBufferIndex.controllerLeft + sideOffset * 7);
    controller.quaternion.toArray(buffer, InputBufferIndex.controllerLeft + sideOffset * 7 + 3);

    const controlleGrip = renderer.xr.getControllerGrip(sideOffset);
    controlleGrip.position.toArray(buffer, InputBufferIndex.controllerGripLeft + sideOffset * 7);
    controlleGrip.quaternion.toArray(buffer, InputBufferIndex.controllerGripLeft + sideOffset * 7 + 3);

    const hand = renderer.xr.getHand(sideOffset);
    if (hand) {
      for (const jointName of handJointNames) {
        const joint = hand.joints[jointName];
        if (!joint) {
          continue;
        }

        joint.position.toArray(
          buffer,
          InputBufferIndex.handLeft + (sideOffset * handJointNames.length + handJointNameIndex[jointName]) * 3,
        );
      }
    }
  });

  console.log(`readXrInput`, { buffer });
};
