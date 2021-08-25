import createContext from 'gl';
import { saveImage, saveImageGl } from './files';
import { bufferToStdout, createProgramFromSources, readPixels } from './utils';

const main = async () => {
    // Create context
    const width = 64;
    const height = 64;
    const gl = createContext(width, height);

    const vertexSrc = [
        `attribute vec2 a_position;`,
        `void main() {`,
        `gl_Position = vec4(a_position, 0, 1);`,
        `}`,
    ].join(`\n`);

    const fragmentSrc = [
        `void main() {`,
        `gl_FragColor = vec4(0, 1, 0, 1);  // green`,
        `}`,
    ].join(`\n`);

    // setup a GLSL program
    const program = createProgramFromSources(gl, [vertexSrc, fragmentSrc]);

    if (!program) {
        return;
    }
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    const positionLocation = gl.getAttribLocation(program, `a_position`);

    // Create a buffer and put a single clipspace rectangle in
    // it (2 triangles)
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -1.0,
            -1.0,
            1.0,
            -1.0,
            -1.0,
            1.0,
            -1.0,
            1.0,
            1.0,
            -1.0,
            1.0,
            1.0]),
        gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // bufferToStdout(gl, width, height);
    // dumpBuffer(gl, width, height);

    await saveImageGl(`./build/test.png`, gl, width, height, `png`);

    // gl.destroy();
};

void main();
