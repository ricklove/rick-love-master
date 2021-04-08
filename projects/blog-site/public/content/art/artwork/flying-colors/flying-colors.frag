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

#define NUM_POINTS 10
#define NUM_POINTS_FL 10.0

void main() {

    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float r = fract(u_mouse.x / 1000.0);
    // float r = fract(u_seed);

    random(r);

    float twist = random(r);

    vec3 color = vec3(0);

    for(int i = 0; i < NUM_POINTS; i++){
        float angle = (1.0 - 2.0 * random(r)) * 0.5 * twist * 3.14159;
        float cosAngle = cos(angle);
        float sinAngle = sin(angle);
        vec2 st2 = vec2( 
            st.x * cosAngle + st.y * sinAngle,
            st.y * cosAngle + st.x * sinAngle);

        vec3 c0 = vec3(random(r), random(r), random(r));
        float y0 = 0.5 + 0.5 * random(r) * sin((st2.x * random(r) + u_time * random(r) / (0.3 + random(r))));
        float s1 = 0.5 + 0.5 * random(r) * sin((st2.x * random(r) + u_time * random(r) / (0.3 + random(r))));
        float s2 = 0.5 + 0.5 * random(r) * sin((st2.x * random(r) + u_time * random(r) / (0.3 + random(r))));
        float s3 = 0.5 + 0.5 * random(r) * sin((st2.x * random(r) + u_time * random(r) / (0.3 + random(r))));

        float dist = abs(st2.y - y0);

        float strength = 1.0 - clamp(dist * (10.0 - 8.0 * s1),0.0,1.0);
        float strPow = pow(strength, 0.5 + 5.0 * s3) ;
        color += strPow * c0;
    }

    gl_FragColor = vec4(color,1.);
}