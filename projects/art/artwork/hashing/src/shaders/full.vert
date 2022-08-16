precision highp float;

attribute highp vec3 aPosition;
varying highp vec2 vTextureCoord;

void main() {

    // Copy the position data into a vec4, adding 1.0 as the w parameter
    vec4 positionVec4 = vec4(aPosition, 1.0);

    // Scale to make the output fit the canvas
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0; 

    // Send the vertex information on to the fragment shader
    gl_Position = positionVec4;

    // vTextureCoord as topLeft:0 to bottomRight:1
    vTextureCoord = positionVec4.xy / 2.0;
}