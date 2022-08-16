import createContext from 'gl';
import { loadImage, loadImageFileIntoTexture, saveImage, saveImageGl } from './files';

const main = async () => {
    // Create context
    const width = 32;
    const height = 32;
    const gl = createContext(width, height);

    const texture = await loadImageFileIntoTexture(`./build/0000-arm-axe-parts.xcf/0-P_AxeC.png`, gl);
    // gl.drawElements

    const createGeometry = () => {
        /* eslint-disable array-element-newline */
        const vertices = [
            -0.5, 0.5, 0.0,
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0,
            0.5, 0.5, 0.0,
        ];
        /* eslint-enable array-element-newline */
        const indices = [3, 2, 1, 3, 1, 0];

        // Create an empty buffer object to store vertex buffer
        const vertex_buffer = gl.createBuffer();

        // Bind appropriate array buffer to it
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

        // Pass the vertex data to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Unbind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Create an empty buffer object to store Index buffer
        const Index_Buffer = gl.createBuffer();

        // Bind appropriate array buffer to it
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

        // Pass the vertex data to the buffer
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        // Unbind the buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return { indices, vertex_buffer, Index_Buffer };
    };

    const buffers = createGeometry();

    const createShaders = () => {

        const vertCode = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
}
      `;
        const fragCode = `
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
        `;


        // Create a vertex shader object
        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertShader){ throw new Error(`createShader failed`);}

        // Attach vertex shader source code
        gl.shaderSource(vertShader, vertCode);

        // Compile the vertex shader
        gl.compileShader(vertShader);

        // Create fragment shader object
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragShader){ throw new Error(`createShader failed`);}

        // Attach fragment shader source code
        gl.shaderSource(fragShader, fragCode);

        // Compile the fragmentt shader
        gl.compileShader(fragShader);

        // Create a shader program object to
        // store the combined shader program
        const shaderProgram = gl.createProgram();
        if (!shaderProgram){ throw new Error(`createProgram failed`);}

        // Attach a vertex shader
        gl.attachShader(shaderProgram, vertShader);

        // Attach a fragment shader
        gl.attachShader(shaderProgram, fragShader);

        // Link both the programs
        gl.linkProgram(shaderProgram);

        // Use the combined shader program object
        gl.useProgram(shaderProgram);

        return {
            shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, `aVertexPosition`),
                textureCoord: gl.getAttribLocation(shaderProgram, `aTextureCoord`),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, `uProjectionMatrix`),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, `uModelViewMatrix`),
                uSampler: gl.getUniformLocation(shaderProgram, `uSampler`),
            },
        };

        // return { shaderProgram };
    };
    const programInfo = createShaders();

    const attachShaders = () => {
        // Bind vertex buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex_buffer);

        // Bind index buffer object
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.Index_Buffer);

        // Get the attribute location
        const coord = gl.getAttribLocation(programInfo.shaderProgram, `coordinates`);

        // Point an attribute to the currently bound VBO
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        // Enable the attribute
        gl.enableVertexAttribArray(coord);
    };
    attachShaders();

    // const drawScene = () => {
    //     // Clear the canvas
    //     gl.clearColor(0.5, 0.5, 0.5, 0.9);

    //     // Enable the depth test
    //     gl.enable(gl.DEPTH_TEST);

    //     // Clear the color buffer bit
    //     gl.clear(gl.COLOR_BUFFER_BIT);

    //     // Set the view port
    //     gl.viewport(0, 0, width, height);

    //     // Draw the triangle
    //     gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    // };
    // drawScene();

    const drawScene = () => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        // const fieldOfView = 45 * Math.PI / 180; // in radians
        // const aspect = width / height;
        // const zNear = 0.1;
        // const zFar = 100.0;
        // // const projectionMatrix = mat4.create();

        // // // note: glmatrix.js always has the first argument
        // // // as the destination to receive the result.
        // // mat4.perspective(projectionMatrix,
        // //     fieldOfView,
        // //     aspect,
        // //     zNear,
        // //     zFar);

        // // Set the drawing position to the "identity" point, which is
        // // the center of the scene.
        // const modelViewMatrix = mat4.create();

        // // Now move the drawing position a bit to where we want to
        // // start drawing the square.

        // mat4.translate(modelViewMatrix, // destination matrix
        //     modelViewMatrix, // matrix to translate
        //     [-0.0, 0.0, -6.0]); // amount to translate
        // mat4.rotate(modelViewMatrix, // destination matrix
        //     modelViewMatrix, // matrix to rotate
        //     cubeRotation, // amount to rotate in radians
        //     [0, 0, 1]); // axis to rotate around (Z)
        // mat4.rotate(modelViewMatrix, // destination matrix
        //     modelViewMatrix, // matrix to rotate
        //     cubeRotation * .7, // amount to rotate in radians
        //     [0, 1, 0]); // axis to rotate around (X)

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the texture coordinates from
        // the texture coordinate buffer into the textureCoord attribute.
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.textureCoord);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        // Specify the texture to map onto the faces.

        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

        // Update the rotation for the next draw

        cubeRotation += deltaTime;
    };

    // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    // const vertexSrc = [
    //     `attribute vec2 a_position;`,
    //     `void main() {`,
    //     `gl_Position = vec4(a_position, 0, 1);`,
    //     `}`,
    // ].join(`\n`);

    // const fragmentSrc = [
    //     `void main() {`,
    //     `gl_FragColor = vec4(0, 1, 0, 1);  // green`,
    //     `}`,
    // ].join(`\n`);

    // // setup a GLSL program
    // const program = createProgramFromSources(gl, [vertexSrc, fragmentSrc]);

    // if (!program) {
    //     return;
    // }
    // gl.useProgram(program);

    // // look up where the vertex data needs to go.
    // const positionLocation = gl.getAttribLocation(program, `a_position`);

    // // Create a buffer and put a single clipspace rectangle in
    // // it (2 triangles)
    // const buffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // gl.bufferData(
    //     gl.ARRAY_BUFFER,
    //     new Float32Array([
    //         -1.0,
    //         -1.0,
    //         1.0,
    //         -1.0,
    //         -1.0,
    //         1.0,
    //         -1.0,
    //         1.0,
    //         1.0,
    //         -1.0,
    //         1.0,
    //         1.0]),
    //     gl.STATIC_DRAW);
    // gl.enableVertexAttribArray(positionLocation);
    // gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // // draw
    // gl.drawArrays(gl.TRIANGLES, 0, 6);

    // bufferToStdout(gl, width, height);
    // dumpBuffer(gl, width, height);

    await saveImageGl(`./test.png`, gl, width, height, `png`);

    // gl.destroy();
};

void main();
