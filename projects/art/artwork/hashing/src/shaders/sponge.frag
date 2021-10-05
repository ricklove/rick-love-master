precision highp float;

varying highp vec2 vTextureCoord;

uniform vec2 uResolution;
uniform highp sampler2D uInput;
// uniform vec2 p;
// uniform float r;
// const int SIZE = 500;

/**
 * Returns accurate MOD when arguments are approximate integers.
 */
float modI(float a, float b) {
  float m = a - floor((a + 0.5) / b) * b;
  return floor(m + 0.5);
}

void main() {
  // vec2 st = gl_FragCoord.xy / uResolution.xy;
  vec2 xy = gl_FragCoord.xy;
  // vec2 xy = vTextureCoord.xy;

  // vec2 c = p + vPos * r, z = c;
  // float n = 0.0;

  // for(int i = SIZE; i > 0; i--) {
  //   if(z.x * z.x + z.y * z.y > 4.0) {
  //     n = float(i) / float(SIZE);
  //     break;
  //   }
  //   z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
  // }

  // gl_FragColor = texture2D(uInput, gl_FragCoord.xy);
  // gl_FragColor = texture2D(uInput, vTextureCoord);

  //float r = modI(x, 4.0) <= 0.1 ? 0.5 : 0.0;
  float r = modI(xy.x, 64.) / 64.0;
  float g = modI(xy.y, 64.) / 64.0;
  float b = 1.0;

  gl_FragColor = vec4(r, g, b, 1);
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
