#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_seed;

float random(inout float r)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float d = r * 1000.0;
    highp float dt= dot(vec2(d,42),vec2(a,b));
    highp float sn= mod(dt,3.14);
    r = fract(sin(sn) * c);
    return r;
}

#define NUM_POINTS 5
#define NUM_POINTS_FL 5.0

void main() {

    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    // float r = u_mouse.x;
     float r = fract(u_mouse.x / 1000.0);
    // float r = fract(u_seed / 1000.0);

    random(r);

    vec3 color = vec3(0);

    for(int i = 0; i < NUM_POINTS; i++){
        vec3 c0 = vec3(random(r), random(r), random(r));
        float s0 = 0.5 + 0.5 * random(r) * sin((st.x * random(r) + u_time * random(r) / (0.3 + random(r))));
        float s1 = 0.5 + 0.5 * random(r) * sin((st.x * random(r) + u_time * random(r) / (0.3 + random(r))));
        float s2 = 0.5 + 0.5 * random(r) * sin((st.x * random(r) + u_time * random(r) / (0.3 + random(r))));
        float s3 = 0.5 + 0.5 * random(r) * sin((st.x * random(r) + u_time * random(r) / (0.3 + random(r))));
        vec2 p0 = vec2(random(r), s0);

        // float dist = distance(st, p0);
        float dist = abs(st.y - p0.y);
        // float distY = abs(st.y - p0.y);
        // float distX = abs(st.x - p0.x);
        // float dist = distY - 0.1 * distX;
        float strength = 1.0 - clamp(dist * (10.0 - 8.0 * s1),0.0,1.0);
        float strPow = pow(strength, 0.5 + 2.0 * s3) ;
        color += (3.0 * s2 * strPow/NUM_POINTS_FL) * c0;
    }

    gl_FragColor = vec4(color,1.);
}