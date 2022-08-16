import fs from 'fs';
import type createContext from 'gl';

export type GL = ReturnType<typeof createContext>;

export type ImageDataGL = {
    data: Uint8Array;
    width: number;
    height: number;
};
export const readPixels = (gl: GL, width: number, height: number): ImageDataGL => {
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return { data: pixels, width, height };
};

function bufferToStdout(gl: GL, width: number, height: number) {
    // Write output
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    process.stdout.write([`P3\n# gl.ppm\n`, width, ` `, height, `\n255\n`].join(``));
    for (let i = 0; i < pixels.length; i += 4) {
        process.stdout.write(pixels[i] + ` ` + pixels[i + 1] + ` ` + pixels[i + 2] + ` `);
    }
}

function bufferToFile(gl: GL, width: number, height: number, filename: string) {
    const file = fs.createWriteStream(filename);

    // Write output
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    file.write([`P3\n# gl.ppm\n`, width, ` `, height, `\n255\n`].join(``));
    for (let i = 0; i < pixels.length; i += 4) {
        file.write(pixels[i] + ` ` + pixels[i + 1] + ` ` + pixels[i + 2] + ` `);
    }
}

function drawTriangle(gl: GL) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-2, -2, -2, 4, 4, -2]), gl.STREAM_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.disableVertexAttribArray(0);
    gl.deleteBuffer(buffer);
}

function loadShader(gl: GL, shaderSource: string, shaderType: number): WebGLShader {
    const shader = gl.createShader(shaderType);
    if (!shader){ throw new Error(`createShader failed`); }

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    // Check the compile status
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
    // Something went wrong during compilation; get the error
        const lastError = gl.getShaderInfoLog(shader);
        console.log(`*** Error compiling shader '` + shader + `':` + lastError);
        gl.deleteShader(shader);

        throw new Error(`getShaderInfoLog failed`);
    }

    return shader;
}

function createProgram(gl: GL, shaders: WebGLShader [], optAttribs = [], optLocations = []) {
    const program = gl.createProgram();
    if (!program){ throw new Error(`createProgram failed`); }

    shaders.forEach(function(shader) {
        gl.attachShader(program, shader);
    });
    if (optAttribs) {
        optAttribs.forEach(function(attrib, ndx) {
            gl.bindAttribLocation(
                program,
                optLocations ? optLocations[ndx] : ndx,
                attrib);
        });
    }
    gl.linkProgram(program);

    // Check the link status
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
    // something went wrong with the link
        const lastError = gl.getProgramInfoLog(program);
        console.log(`Error in program linking:` + lastError);

        gl.deleteProgram(program);
        throw new Error(`getProgramInfoLog failed`);
    }
    return program;
}

function createProgramFromSources(gl: GL, shaderSources: string[], optAttribs = [], optLocations = []) {
    const defaultShaderType = [
        `VERTEX_SHADER`,
        `FRAGMENT_SHADER`,
    ] as const;

    const shaders = [] as WebGLShader[];
    for (let ii = 0; ii < shaderSources.length; ++ii) {
        shaders.push(loadShader(gl, shaderSources[ii], gl[defaultShaderType[ii]]));
    }
    return createProgram(gl, shaders, optAttribs, optLocations);
}

export {
    bufferToStdout,
    bufferToFile,
    drawTriangle,
    loadShader,
    createProgram,
    createProgramFromSources,
};
