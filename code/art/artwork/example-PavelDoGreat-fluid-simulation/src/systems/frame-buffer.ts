import { WebGlSystem } from './webgl';

export const createFrameBufferFactory = ({ gl }: WebGlSystem) => {

    function createFrameBufferObject(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
        gl.activeTexture(gl.TEXTURE0);
        const texture = gl.createTexture();
        if (!texture) { throw new Error(`texture not created`); }

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

        const frameBuffer = gl.createFramebuffer();
        if (!frameBuffer) { throw new Error(`frame buffer not created`); }

        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const texelSizeX = 1 / w;
        const texelSizeY = 1 / h;

        return {
            texture,
            frameBuffer,
            width: w,
            height: h,
            texelSizeX,
            texelSizeY,
            attach(id: number) {
                gl.activeTexture(gl.TEXTURE0 + id);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                return id;
            },
        };
    }

    function createDoubleFrameBufferObject(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
        let fbo1 = createFrameBufferObject(w, h, internalFormat, format, type, param);
        let fbo2 = createFrameBufferObject(w, h, internalFormat, format, type, param);

        return {
            width: w,
            height: h,
            texelSizeX: fbo1.texelSizeX,
            texelSizeY: fbo1.texelSizeY,
            get read() {
                return fbo1;
            },
            set read(value) {
                fbo1 = value;
            },
            get write() {
                return fbo2;
            },
            set write(value) {
                fbo2 = value;
            },
            swap() {
                const temp = fbo1;
                fbo1 = fbo2;
                fbo2 = temp;
            },
        };
    }


    return {
        createFrameBufferObject,
        createDoubleFrameBufferObject,
    };
};

export type FrameBufferFactory = ReturnType<typeof createFrameBufferFactory>;
export type FrameBufferObject = ReturnType<FrameBufferFactory['createFrameBufferObject']>;
export type DoubleFrameBufferObject = ReturnType<FrameBufferFactory['createDoubleFrameBufferObject']>;


export const createFrameBufferUtils = ({ gl }: WebGlSystem) => {

    const createBlit = () => {
        // 4 2d-coords: [0](-1,-1) [1](-1,1) [2](1,1) [3](1,-1)
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);

        // 6 points (2 triangles) => [0,1,2] [0,2,3]
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

        // coords = size 2, floats, no norm, stride, or offset
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        return (target: null | FrameBufferObject, clear = false) => {
            // console.log(`blit`, { target, clear });

            if (target == null) {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
            else {
                gl.viewport(0, 0, target.width, target.height);
                gl.bindFramebuffer(gl.FRAMEBUFFER, target.frameBuffer);
            }
            if (clear) {
                gl.clearColor(0, 0, 0, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            // CHECK_FRAMEBUFFER_STATUS();

            // 2 Triangles (6 points)
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };
    };
    const blit = createBlit();

    // function CHECK_FRAMEBUFFER_STATUS() {
    //     const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    //     if (status != gl.FRAMEBUFFER_COMPLETE)
    //         console.trace(`Framebuffer error: ${status}`);
    // }

    return {
        blit,
    };
};
