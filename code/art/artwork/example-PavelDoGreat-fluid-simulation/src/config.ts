
// Normal
export const createConfig = () => ({
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    CAPTURE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 1,
    VELOCITY_DISSIPATION: 0.2,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 30,
    SPLAT_RADIUS: 0.25,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLORFUL: true,
    COLOR_UPDATE_SPEED: 10,
    PAUSED: false,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: false,
    BLOOM: true,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 0.8,
    BLOOM_THRESHOLD: 0.6,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS: true,
    SUNRAYS_RESOLUTION: 196,
    SUNRAYS_WEIGHT: 1,

    MOTION_X: 0,
    MOTION_Y: 0,
});

// Simple
// export const createConfig = () => ({
//     SIM_RESOLUTION: 128,
//     DYE_RESOLUTION: 1024,
//     CAPTURE_RESOLUTION: 512,
//     DENSITY_DISSIPATION: 0.1,
//     VELOCITY_DISSIPATION: 0.1,
//     PRESSURE: 1,
//     PRESSURE_ITERATIONS: 20,
//     CURL: 0,
//     SPLAT_RADIUS: 0.1,
//     SPLAT_FORCE: 6000,
//     SHADING: false,
//     COLORFUL: true,
//     COLOR_UPDATE_SPEED: 10,
//     PAUSED: false,
//     BACK_COLOR: { r: 0, g: 0, b: 0 },
//     TRANSPARENT: false,
//     BLOOM: false,
//     BLOOM_ITERATIONS: 8,
//     BLOOM_RESOLUTION: 256,
//     BLOOM_INTENSITY: 0.8,
//     BLOOM_THRESHOLD: 0.6,
//     BLOOM_SOFT_KNEE: 0.7,
//     SUNRAYS: false,
//     SUNRAYS_RESOLUTION: 196,
//     SUNRAYS_WEIGHT: 1,
// });

export type Config = ReturnType<typeof createConfig>;
