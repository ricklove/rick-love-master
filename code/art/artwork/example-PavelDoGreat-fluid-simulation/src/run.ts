/* eslint-disable no-bitwise */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

import { TimeProvider } from '../../../time-provider';
import { createConfig } from './config';
import { createFrameBufferFactory, createFrameBufferUtils, DoubleFrameBufferObject, FrameBufferObject } from './systems/frame-buffer';
import { getWebGLSystem } from './systems/webgl';
import { startGUI } from './gui';
import { ColorRgb, correctDeltaX, correctDeltaY, generateColor, getTextureScale, isMobile, normalizeColor, randomIntRange, scaleByPixelRatio, wrap } from './utils';
import { createTextureUtils } from './systems/texture';
import { createShaderFactory, ShaderMaterial, ShaderProgram } from './systems/shader';
import { createShaders } from './shaders';
// import { setupAppPopup } from './setup-app-popup';


export const runFluidSimulator = (host: HTMLDivElement, contentPath: string, style: { width: string, height: string }, options?: { timeProvider?: TimeProvider, disableGui?: boolean, disableInput?: boolean, disableStartupSplats?: boolean }) => {

    const timeProvider = options?.timeProvider ?? { now: () => Date.now(), isPaused: () => false };

    // setupAppPopup();

    // Simulation section

    // Setup ---
    // const canvas = document.querySelectorAll(`canvas`)[0] as HTMLCanvasElement;
    const canvas = document.createElement(`canvas`);
    canvas.style.width = style.width;
    canvas.style.height = style.height;
    host.append(canvas);

    resizeCanvas();


    class PointerEntity {
        id = -1;
        texcoordX = 0;
        texcoordY = 0;
        prevTexcoordX = 0;
        prevTexcoordY = 0;
        deltaX = 0;
        deltaY = 0;
        down = false;
        moved = false;
        color = { r: 30, g: 0, b: 300 };
        size = undefined as undefined | { x: number, y: number };
        p = { r: 0, g: 0, b: 0 };
    }
    type PointerEntityType = PointerEntity;

    const pointers = [] as PointerEntityType[];
    const splatStack = [] as number[];
    pointers.push(new PointerEntity());

    console.log(`runFluidSimulator - 01 getWebGLSystem`, {});
    const webGlSystem = getWebGLSystem(canvas);
    if (!webGlSystem) { return null; }

    const { gl, ext } = webGlSystem;
    console.log(`runFluidSimulator - 01B getWebGLSystem`, { gl, ext });

    const frameBufferFactory = createFrameBufferFactory(webGlSystem);
    const {
        createFrameBufferObject,
        createDoubleFrameBufferObject,
    } = frameBufferFactory;


    const {
        captureScreenshot,
        getResolution,
    } = createTextureUtils(webGlSystem, frameBufferFactory);

    const shaderFactory = createShaderFactory(webGlSystem);

    const config = createConfig();
    if (isMobile()) {
        config.DYE_RESOLUTION = 512;
    }
    if (!ext.supportLinearFiltering) {
        config.DYE_RESOLUTION = 512;
        config.SHADING = false;
        config.BLOOM = false;
        config.SUNRAYS = false;
    }

    console.log(`runFluidSimulator - 02 startGUI`, {});

    const gui = options?.disableGui ? null : startGUI({
        config,
        splatStack,
        initFramebuffers,
        updateKeywords,
        captureScreenshot: () => captureScreenshot(render, { resolution: config.CAPTURE_RESOLUTION }),
    });

    console.log(`runFluidSimulator - 03 ditheringTexture`, { url: `${contentPath}/LDR_LLL1_0.png` });
    const ditheringTexture = createTextureAsync(`${contentPath}/LDR_LLL1_0.png`);

    console.log(`runFluidSimulator - 04 createShaders`, {});
    const shaders = createShaders(shaderFactory);
    const blurProgram = new ShaderProgram(shaderFactory, shaders.blurVertexShader, shaders.blurShader);
    const copyProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.copyShader);
    const clearProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.clearShader);
    const colorProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.colorShader);
    const checkerboardProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.checkerboardShader);
    const bloomPrefilterProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.bloomPrefilterShader);
    const bloomBlurProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.bloomBlurShader);
    const bloomFinalProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.bloomFinalShader);
    const sunraysMaskProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.sunraysMaskShader);
    const sunraysProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.sunraysShader);
    const splatProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.splatShader);
    const advectionProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.advectionShader);
    const divergenceProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.divergenceShader);
    const curlProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.curlShader);
    const vorticityProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.vorticityShader);
    const pressureProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.pressureShader);
    const gradientSubtractProgram = new ShaderProgram(shaderFactory, shaders.baseVertexShader, shaders.gradientSubtractShader);
    const displayMaterial = new ShaderMaterial(shaderFactory, shaders.baseVertexShader, shaders.displayShaderSource);

    const {
        blit,
    } = createFrameBufferUtils(webGlSystem);

    let dye: DoubleFrameBufferObject;
    let velocity: DoubleFrameBufferObject;
    let divergence: FrameBufferObject;
    let curl: FrameBufferObject;
    let pressure: DoubleFrameBufferObject;
    let bloom: FrameBufferObject;
    const bloomFramebuffers = [] as FrameBufferObject[];
    let sunrays: FrameBufferObject;
    let sunraysTemp: FrameBufferObject;

    function resizeFBO(target: FrameBufferObject, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
        const newFBO = createFrameBufferObject(w, h, internalFormat, format, type, param);
        copyProgram.bind();
        gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
        blit(newFBO);
        return newFBO;
    }

    function resizeDoubleFBO(target: DoubleFrameBufferObject, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
        if (target.width === w && target.height === h)
            return target;
        target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
        target.write = createFrameBufferObject(w, h, internalFormat, format, type, param);
        target.width = w;
        target.height = h;
        target.texelSizeX = 1 / w;
        target.texelSizeY = 1 / h;
        return target;
    }

    function initFramebuffers() {
        const simRes = getResolution(config.SIM_RESOLUTION);
        const dyeRes = getResolution(config.DYE_RESOLUTION);

        const texType = ext.halfFloatTexType;
        const rgba = ext.formatRGBA;
        const rg = ext.formatRG;
        const r = ext.formatR;
        const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

        gl.disable(gl.BLEND);

        if (dye == null)
            dye = createDoubleFrameBufferObject(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
        else
            dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

        if (velocity == null)
            velocity = createDoubleFrameBufferObject(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
        else
            velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

        divergence = createFrameBufferObject(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        curl = createFrameBufferObject(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        pressure = createDoubleFrameBufferObject(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);

        initBloomFramebuffers();
        initSunraysFramebuffers();
    }

    function initBloomFramebuffers() {
        const res = getResolution(config.BLOOM_RESOLUTION);

        const texType = ext.halfFloatTexType;
        const rgba = ext.formatRGBA;
        const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

        bloom = createFrameBufferObject(res.width, res.height, rgba.internalFormat, rgba.format, texType, filtering);

        bloomFramebuffers.length = 0;
        for (let i = 0; i < config.BLOOM_ITERATIONS; i++) {
            const width = res.width >> (i + 1);
            const height = res.height >> (i + 1);

            if (width < 2 || height < 2) break;

            const fbo = createFrameBufferObject(width, height, rgba.internalFormat, rgba.format, texType, filtering);
            bloomFramebuffers.push(fbo);
        }
    }

    function initSunraysFramebuffers() {
        const res = getResolution(config.SUNRAYS_RESOLUTION);

        const texType = ext.halfFloatTexType;
        const r = ext.formatR;
        const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

        sunrays = createFrameBufferObject(res.width, res.height, r.internalFormat, r.format, texType, filtering);
        sunraysTemp = createFrameBufferObject(res.width, res.height, r.internalFormat, r.format, texType, filtering);
    }


    function createTextureAsync(url: string) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));

        const obj = {
            texture,
            width: 1,
            height: 1,
            attach(id: number) {
                gl.activeTexture(gl.TEXTURE0 + id);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                return id;
            },
        };

        const image = new Image();
        image.addEventListener(`load`, () => {
            obj.width = image.width;
            obj.height = image.height;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        });
        image.src = url;

        return obj;
    }

    function updateKeywords() {
        const displayKeywords = [];
        if (config.SHADING) displayKeywords.push(`SHADING`);
        if (config.BLOOM) displayKeywords.push(`BLOOM`);
        if (config.SUNRAYS) displayKeywords.push(`SUNRAYS`);
        displayMaterial.setKeywords(displayKeywords);
    }

    console.log(`runFluidSimulator - 05 updateKeywords`, {});
    updateKeywords();

    console.log(`runFluidSimulator - 06 initFramebuffers`, {});
    initFramebuffers();

    console.log(`runFluidSimulator - 07 multipleSplats`, {});
    if (!options?.disableStartupSplats) {
        multipleSplats(randomIntRange(5, 25));
    }

    function update() {
        // console.log(`runFluidSimulator.update START`, {});
        if (timeProvider.isPaused()) {
            console.log(`runFluidSimulator.update timeProvider.PAUSED`, {});
            requestAnimationFrame(update);
            return;
        }

        const dt = calcDeltaTime();

        if (resizeCanvas()) {
            initFramebuffers();
            updateKeywords();
        }
        updateColors(dt);
        applyInputs();
        if (!config.PAUSED)
            step(dt);
        render(null);
        requestAnimationFrame(update);
    }

    let lastUpdateTime = timeProvider.now();
    function calcDeltaTime() {
        const now = timeProvider.now();
        const dtActual = (now - lastUpdateTime) / 1000;
        const dt = Math.min(dtActual, 0.016666);
        lastUpdateTime = now;
        return dt;
    }

    function resizeCanvas() {
        const width = scaleByPixelRatio(canvas.clientWidth);
        const height = scaleByPixelRatio(canvas.clientHeight);
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            return true;
        }
        return false;
    }

    let colorUpdateTimer = 0;
    function updateColors(dt: number) {
        if (!config.COLORFUL) return;

        colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
        if (colorUpdateTimer >= 1) {
            colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
            pointers.forEach(p => {
                p.color = generateColor();
            });
        }
    }

    function applyInputs() {

        const lastSplat = splatStack.pop();
        if (lastSplat != null) {
            console.log(`applyInputs: lastSplat`, { lastSplat, splatStack, pointers });

            multipleSplats(lastSplat);
        }

        pointers.forEach(p => {
            if (p.moved) {
                p.moved = false;
                splatPointer(p);
            }
        });

    }

    function step(dt: number) {
        gl.disable(gl.BLEND);

        // Calculate curl strength (based on cross-velocity gradient)
        curlProgram.bind();
        gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(curl);

        // Apply a vortex acceleration to velocity (based on curl strength)
        vorticityProgram.bind();
        gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
        gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
        gl.uniform1f(vorticityProgram.uniforms.dt, dt);
        blit(velocity.write);
        velocity.swap();

        // Calculate divergence strength (based on parallel-velocity gradient)
        divergenceProgram.bind();
        gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(divergence);

        // Dilute last pressure
        clearProgram.bind();
        gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
        gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
        blit(pressure.write);
        pressure.swap();

        // Distribute pressure over N iterations based on divergence
        pressureProgram.bind();
        gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
        for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
            gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
            blit(pressure.write);
            pressure.swap();
        }

        // Apply pressure gradient as a force to velocity
        gradientSubtractProgram.bind();
        gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
        gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
        blit(velocity.write);
        velocity.swap();

        // Move the velocity position (based on the velocity)
        advectionProgram.bind();
        gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        if (!ext.supportLinearFiltering)
            gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
        const velocityId = velocity.read.attach(0);
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
        gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
        gl.uniform1f(advectionProgram.uniforms.dt, dt);
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
        gl.uniform2f(advectionProgram.uniforms.motion, config.MOTION_X, config.MOTION_Y);
        blit(velocity.write);
        velocity.swap();

        // Move the dye position (based on the velocity)
        if (!ext.supportLinearFiltering)
            gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
        gl.uniform2f(advectionProgram.uniforms.motion, config.MOTION_X, config.MOTION_Y);
        blit(dye.write);
        dye.swap();
    }

    function render(target: null | FrameBufferObject) {
        if (config.BLOOM)
            applyBloom(dye.read, bloom);
        if (config.SUNRAYS) {
            applySunrays(dye.read, dye.write, sunrays);
            blur(sunrays, sunraysTemp, 1);
        }

        if (target == null || !config.TRANSPARENT) {
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
        }
        else {
            gl.disable(gl.BLEND);
        }

        if (!config.TRANSPARENT)
            drawColor(target, normalizeColor(config.BACK_COLOR));
        if (target == null && config.TRANSPARENT)
            drawCheckerboard(target);
        drawDisplay(target);
    }

    function drawColor(target: null | FrameBufferObject, color: ColorRgb) {
        colorProgram.bind();
        gl.uniform4f(colorProgram.uniforms.color, color.r, color.g, color.b, 1);
        blit(target);
    }

    function drawCheckerboard(target: null | FrameBufferObject) {
        checkerboardProgram.bind();
        gl.uniform1f(checkerboardProgram.uniforms.aspectRatio, canvas.width / canvas.height);
        blit(target);
    }

    const TESTING = false;
    let testCount = 0;
    const getTestMaterials = () => [
        dye.read,
        velocity.read,
        // divergence,
        // curl,
        // pressure.read,
        // bloom,
        // ditheringTexture,
        // sunrays,
        // sunraysTemp,
    ];
    function drawDisplay(target: null | FrameBufferObject) {
        // console.log(`drawDisplay`, { target });

        const width = target == null ? gl.drawingBufferWidth : target.width;
        const height = target == null ? gl.drawingBufferHeight : target.height;

        if (TESTING) {
            displayMaterial.bind();
            const tMats = getTestMaterials();
            const tMat = tMats[Math.floor(testCount / 100) % tMats.length];
            gl.uniform1i(displayMaterial.uniforms.uTexture, tMat.attach(0));
            blit(target);
            testCount++;
            return;
        }

        displayMaterial.bind();
        if (config.SHADING)
            gl.uniform2f(displayMaterial.uniforms.texelSize, 1 / width, 1 / height);
        gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
        if (config.BLOOM) {
            gl.uniform1i(displayMaterial.uniforms.uBloom, bloom.attach(1));
            gl.uniform1i(displayMaterial.uniforms.uDithering, ditheringTexture.attach(2));
            const scale = getTextureScale(ditheringTexture, width, height);
            gl.uniform2f(displayMaterial.uniforms.ditherScale, scale.x, scale.y);
        }
        if (config.SUNRAYS)
            gl.uniform1i(displayMaterial.uniforms.uSunrays, sunrays.attach(3));
        blit(target);
    }

    function applyBloom(source: FrameBufferObject, destination: FrameBufferObject) {
        if (bloomFramebuffers.length < 2)
            return;

        let last = destination;

        gl.disable(gl.BLEND);
        bloomPrefilterProgram.bind();
        const knee = config.BLOOM_THRESHOLD * config.BLOOM_SOFT_KNEE + 0.0001;
        const curve0 = config.BLOOM_THRESHOLD - knee;
        const curve1 = knee * 2;
        const curve2 = 0.25 / knee;
        gl.uniform3f(bloomPrefilterProgram.uniforms.curve, curve0, curve1, curve2);
        gl.uniform1f(bloomPrefilterProgram.uniforms.threshold, config.BLOOM_THRESHOLD);
        gl.uniform1i(bloomPrefilterProgram.uniforms.uTexture, source.attach(0));
        blit(last);

        bloomBlurProgram.bind();
        for (const dest of bloomFramebuffers) {
            gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
            gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
            blit(dest);
            last = dest;
        }

        gl.blendFunc(gl.ONE, gl.ONE);
        gl.enable(gl.BLEND);

        for (let i = bloomFramebuffers.length - 2; i >= 0; i--) {
            const baseTex = bloomFramebuffers[i];
            gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
            gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
            gl.viewport(0, 0, baseTex.width, baseTex.height);
            blit(baseTex);
            last = baseTex;
        }

        gl.disable(gl.BLEND);
        bloomFinalProgram.bind();
        gl.uniform2f(bloomFinalProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        gl.uniform1i(bloomFinalProgram.uniforms.uTexture, last.attach(0));
        gl.uniform1f(bloomFinalProgram.uniforms.intensity, config.BLOOM_INTENSITY);
        blit(destination);
    }

    function applySunrays(source: FrameBufferObject, mask: FrameBufferObject, destination: FrameBufferObject) {
        gl.disable(gl.BLEND);
        sunraysMaskProgram.bind();
        gl.uniform1i(sunraysMaskProgram.uniforms.uTexture, source.attach(0));
        blit(mask);

        sunraysProgram.bind();
        gl.uniform1f(sunraysProgram.uniforms.weight, config.SUNRAYS_WEIGHT);
        gl.uniform1i(sunraysProgram.uniforms.uTexture, mask.attach(0));
        blit(destination);
    }

    function blur(target: FrameBufferObject, temp: FrameBufferObject, iterations: number) {
        blurProgram.bind();
        for (let i = 0; i < iterations; i++) {
            gl.uniform2f(blurProgram.uniforms.texelSize, target.texelSizeX, 0);
            gl.uniform1i(blurProgram.uniforms.uTexture, target.attach(0));
            blit(temp);

            gl.uniform2f(blurProgram.uniforms.texelSize, 0, target.texelSizeY);
            gl.uniform1i(blurProgram.uniforms.uTexture, temp.attach(0));
            blit(target);
        }
    }

    function splatPointer(pointer: PointerEntity) {
        const dx = pointer.deltaX * config.SPLAT_FORCE;
        const dy = pointer.deltaY * config.SPLAT_FORCE;
        // const dy = -10;
        splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color, pointer.size);
    }

    function multipleSplats(amount: number) {
        for (let i = 0; i < amount; i++) {
            const color = generateColor();
            color.r *= 10;
            color.g *= 10;
            color.b *= 10;
            const x = Math.random();
            const y = Math.random();
            const dx = 1000 * (Math.random() - 0.5);
            const dy = 1000 * (Math.random() - 0.5);
            splat(x, y, dx, dy, color);
        }
    }

    function splat(x: number, y: number, dx: number, dy: number, color: ColorRgb, size?: { x: number, y: number }) {
        // console.log(`splat`, { x, y, dx, dy, color });

        splatProgram.bind();
        gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
        gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
        gl.uniform2f(splatProgram.uniforms.point, x, y);
        gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
        gl.uniform1f(splatProgram.uniforms.radius, correctRadius((size?.x ?? (config.SPLAT_RADIUS * 2)) * 0.5 / 100));
        blit(velocity.write);
        velocity.swap();

        gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
        gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
        blit(dye.write);
        dye.swap();
    }

    function correctRadius(radius: number) {
        const aspectRatio = canvas.width / canvas.height;
        if (aspectRatio > 1)
            radius *= aspectRatio;
        return radius;
    }

    console.log(`runFluidSimulator - 08 addEventListeners`, {});

    const windowSubs = [] as { name: string, handler: () => void }[];
    const windowAddEventListener = ((name: string, handler: () => void) => {
        if (options?.disableInput) { return; }

        window.addEventListener(name, handler);
        windowSubs.push({ name, handler });
    }) as typeof window.addEventListener;
    const windowEventListenersDestroy = () => {
        windowSubs.forEach(({ name, handler }) => {
            window.removeEventListener(name, handler);
        });
    };

    const canvasSubs = [] as { name: string, handler: () => void }[];
    const canvasAddEventListener = ((name: string, handler: () => void) => {
        if (options?.disableInput) { return; }

        canvas.addEventListener(name, handler);
        canvasSubs.push({ name, handler });
    }) as typeof canvas.addEventListener;
    const canvasEventListenersDestroy = () => {
        canvasSubs.forEach(({ name, handler }) => {
            canvas.removeEventListener(name, handler);
        });
    };

    canvasAddEventListener(`mousedown`, e => {
        const posX = scaleByPixelRatio(e.offsetX);
        const posY = scaleByPixelRatio(e.offsetY);
        let pointer = pointers.find(p => p.id === -1);
        if (pointer == null)
            pointer = new PointerEntity();
        updatePointerDownData(pointer, -1, posX, posY);
    });

    canvasAddEventListener(`mousemove`, e => {
        const pointer = pointers[0];
        if (!pointer.down) return;
        const posX = scaleByPixelRatio(e.offsetX);
        const posY = scaleByPixelRatio(e.offsetY);
        updatePointerMoveData(pointer, posX, posY);
    });

    windowAddEventListener(`mouseup`, () => {
        updatePointerUpData(pointers[0]);
    });

    canvasAddEventListener(`touchstart`, e => {
        e.preventDefault();
        const touches = e.targetTouches as unknown as Touch[];
        while (touches.length >= pointers.length)
            pointers.push(new PointerEntity());
        for (const [i, touch] of touches.entries()) {
            const posX = scaleByPixelRatio(touch.pageX);
            const posY = scaleByPixelRatio(touch.pageY);
            updatePointerDownData(pointers[i + 1], touch.identifier, posX, posY);
        }
    });

    canvasAddEventListener(`touchmove`, e => {
        e.preventDefault();
        const touches = e.targetTouches as unknown as Touch[];
        for (const [i, touch] of touches.entries()) {
            const pointer = pointers[i + 1];
            if (!pointer.down) continue;
            const posX = scaleByPixelRatio(touch.pageX);
            const posY = scaleByPixelRatio(touch.pageY);
            updatePointerMoveData(pointer, posX, posY);
        }
    }, false);

    windowAddEventListener(`touchend`, e => {
        const touches = e.changedTouches as unknown as Touch[];
        for (const touch of touches) {
            const pointer = pointers.find(p => p.id === touch.identifier);
            if (pointer == null) continue;
            updatePointerUpData(pointer);
        }
    });

    windowAddEventListener(`keydown`, e => {
        if (e.code === `KeyP`)
            config.PAUSED = !config.PAUSED;
        if (e.key === ` `)
            splatStack.push(randomIntRange(5, 25));
    });

    function updatePointerDownData(pointer: PointerEntity, id: number, posX: number, posY: number) {
        pointer.id = id;
        pointer.down = true;
        pointer.moved = false;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1 - posY / canvas.height;
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.deltaX = 0;
        pointer.deltaY = 0;
        pointer.color = generateColor();

        // console.log(`updatePointerDownData`, { pointer });
    }

    function updatePointerMoveData(pointer: PointerEntity, posX: number, posY: number) {
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1 - posY / canvas.height;
        pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX, canvas);
        pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY, canvas);
        pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }

    function updatePointerUpData(pointer: PointerEntity) {
        pointer.down = false;
    }

    console.log(`runFluidSimulator - 09 update Start Loop`, {});
    update();

    console.log(`runFluidSimulator - 10 DONE`, {});

    const pointerMap = new Map<number, PointerEntity>();
    return {
        canvas,
        getSize: () => ({
            width: canvas.width,
            height: canvas.height,
        }),
        config,
        updateConfig: () => {
            updateKeywords();
        },
        splat: (id: number, active: boolean, x: number, y: number, dx: number, dy: number, size?: { x: number, y: number }, color?: ColorRgb) => {
            let p = pointerMap.get(id);
            if (!p) {
                p = new PointerEntity();
                pointerMap.set(id, p);
                pointers.push(p);
                p.id = id;
                // console.log(`splat - new`, { id, active, x, y });
            }
            // console.log(`splat`, { id, color, active, x, y });


            p.down = active;
            p.moved = active;
            p.texcoordX = x;
            p.texcoordY = y;
            p.prevTexcoordX = x - dx;
            p.prevTexcoordY = y - dy;
            p.deltaX = correctDeltaX(p.texcoordX - p.prevTexcoordX, canvas);
            p.deltaY = correctDeltaY(p.texcoordY - p.prevTexcoordY, canvas);
            p.color = color ?? generateColor();
            p.size = size;
        },
        close: () => {
            gui?.gui?.destroy();
            windowEventListenersDestroy();
            canvasEventListenersDestroy();

            gl.canvas.width = 1;
            gl.canvas.height = 1;
            canvas.remove();
        },
    };
};
