/* eslint-disable unicorn/filename-case */

// WebGl Context ---
export function getWebGLSystem(canvas: HTMLCanvasElement): null | {
    gl: WebGL2RenderingContext | WebGLRenderingContext;
    ext: {
        formatRGBA: SupportedFormat;
        formatRG: SupportedFormat;
        formatR: SupportedFormat;
        halfFloatTexType: number;
        supportLinearFiltering: null | OES_texture_float_linear | OES_texture_half_float_linear;
    };
} {
    const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };

    const gl2 = canvas.getContext(`webgl2`, params) as null | WebGL2RenderingContext;
    if (gl2) {
        const gl = gl2;
        gl.getExtension(`EXT_color_buffer_float`);
        const supportLinearFiltering = gl.getExtension(`OES_texture_float_linear`);
        const halfFloatTexType = gl.HALF_FLOAT;
        gl.clearColor(0, 0, 0, 1);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
        const formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        const formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);

        return {
            gl,
            ext: {
                formatRGBA,
                formatRG,
                formatR,
                halfFloatTexType,
                supportLinearFiltering,
            },
        };
    }

    const gl1 = (canvas.getContext(`webgl`, params) || canvas.getContext(`experimental-webgl`, params)) as null | WebGLRenderingContext;
    if (!gl1) { return null; }

    const gl = gl1;

    const halfFloat = gl.getExtension(`OES_texture_half_float`) as OES_texture_half_float;
    const supportLinearFiltering = gl.getExtension(`OES_texture_half_float_linear`);

    gl.clearColor(0, 0, 0, 1);

    const halfFloatTexType = halfFloat.HALF_FLOAT_OES;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    const formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    const formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);

    return {
        gl,
        ext: {
            formatRGBA,
            formatRG,
            formatR,
            halfFloatTexType,
            supportLinearFiltering,
        },
    };
}
export type WebGlSystem = NonNullable<ReturnType<typeof getWebGLSystem>>;

type SupportedFormat = {
    internalFormat: number;
    format: number;
};
function getSupportedFormat(gl: WebGL2RenderingContext | WebGLRenderingContext, internalFormat: number, format: number, type: number): SupportedFormat {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        const gl2 = gl as WebGL2RenderingContext;
        switch (internalFormat) {
            case gl2.R16F:
                return getSupportedFormat(gl, gl2.RG16F, gl2.RG, type);
            case gl2.RG16F:
                return getSupportedFormat(gl, gl2.RGBA16F, gl2.RGBA, type);
            default:
                throw new Error(`Unknown Render Format`);
            // return null;
        }
    }

    return {
        internalFormat,
        format,
    };
}

function supportRenderTextureFormat(gl: WebGL2RenderingContext | WebGLRenderingContext, internalFormat: number, format: number, type: number) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return status === gl.FRAMEBUFFER_COMPLETE;
}
