"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var vr_games_exports = {};
__export(vr_games_exports, {
  VrTestGame: () => VrTestGame
});
module.exports = __toCommonJS(vr_games_exports);

// src/vr-test-03-bare.tsx
var import_react = __toESM(require("react"), 1);

// src/bare/00-bare-three.ts
var THREE = __toESM(require("three"), 1);
var createBareThreeScene = () => {
  let camera;
  let scene;
  let renderer;
  function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2e3);
    camera.position.y = 400;
    scene = new THREE.Scene();
    let object;
    const ambientLight = new THREE.AmbientLight(13421772, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(16777215, 0.8);
    camera.add(pointLight);
    scene.add(camera);
    const map = new THREE.TextureLoader().load(`textures/uv_grid_opengl.jpg`);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    const material = new THREE.MeshPhongMaterial({ map, side: THREE.DoubleSide });
    object = new THREE.Mesh(new THREE.SphereGeometry(75, 20, 10), material);
    object.position.set(-300, 0, 200);
    scene.add(object);
    object = new THREE.Mesh(new THREE.IcosahedronGeometry(75, 1), material);
    object.position.set(-100, 0, 200);
    scene.add(object);
    object = new THREE.Mesh(new THREE.OctahedronGeometry(75, 2), material);
    object.position.set(100, 0, 200);
    scene.add(object);
    object = new THREE.Mesh(new THREE.TetrahedronGeometry(75, 0), material);
    object.position.set(300, 0, 200);
    scene.add(object);
    object = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 4, 4), material);
    object.position.set(-300, 0, 0);
    scene.add(object);
    object = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100, 4, 4, 4), material);
    object.position.set(-100, 0, 0);
    scene.add(object);
    object = new THREE.Mesh(new THREE.CircleGeometry(50, 20, 0, Math.PI * 2), material);
    object.position.set(100, 0, 0);
    scene.add(object);
    object = new THREE.Mesh(new THREE.RingGeometry(10, 50, 20, 5, 0, Math.PI * 2), material);
    object.position.set(300, 0, 0);
    scene.add(object);
    object = new THREE.Mesh(new THREE.CylinderGeometry(25, 75, 100, 40, 5), material);
    object.position.set(-300, 0, -200);
    scene.add(object);
    const points = [];
    for (let i = 0; i < 50; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * Math.sin(i * 0.1) * 15 + 50, (i - 5) * 2));
    }
    object = new THREE.Mesh(new THREE.LatheGeometry(points, 20), material);
    object.position.set(-100, 0, -200);
    scene.add(object);
    object = new THREE.Mesh(new THREE.TorusGeometry(50, 20, 20, 20), material);
    object.position.set(100, 0, -200);
    scene.add(object);
    object = new THREE.Mesh(new THREE.TorusKnotGeometry(50, 10, 50, 20), material);
    object.position.set(300, 0, -200);
    scene.add(object);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener(`resize`, onWindowResize);
  }
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  let time = Date.now() * 1e-4;
  const traverse = (objectRaw) => {
    const object = objectRaw;
    if (object.isMesh === true) {
      object.rotation.x = time * 5;
      object.rotation.y = time * 2.5;
    }
  };
  function render() {
    time = Date.now() * 1e-4 * 50;
    camera.position.x = Math.cos(time) * 800;
    camera.position.z = Math.sin(time) * 800;
    camera.lookAt(scene.position);
    scene.traverse(traverse);
    renderer.render(scene, camera);
  }
  init();
  animate();
};

// src/vr-test-03-bare.tsx
var VrTestGame = () => {
  const load = () => {
    createBareThreeScene();
  };
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", { style: { position: `relative` } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { position: `absolute`, bottom: 0, top: 0, left: 0, right: 0, background: `#000000` } }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: load }, "Load"))));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VrTestGame
});
