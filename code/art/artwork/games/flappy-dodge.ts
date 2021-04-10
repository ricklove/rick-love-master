import { ArtGame, ColorRgb, Vector2 } from './types';

type EntityRenderData = {
    id: number;
    kind: 'player' | 'obstacle' | 'obstacle-still';
    position: Vector2;
    velocity: Vector2;
    size: Vector2;
    color: ColorRgb;
};
type UpdateArgs = {
    onPlayerHit: () => void;
};
type RenderArgs = {
    renderEntity: (data: EntityRenderData) => void;
    removeEntity: (id: number) => void;
    setBackgroundVelocity: (data: { velocity: Vector2 }) => void;
}
export const flappyDodgeGame: ArtGame<UpdateArgs, RenderArgs> = {
    name: `Flappy Dodge`,
    createGame: (timeProvider, environmentProvider) => {

        let destroyed = false;

        const MOTION_X = -0.1;
        const MOTION_Y = -0.025;

        const COLOR_STRENGTH = 1;

        type Entity = {
            id: number;
            color: ColorRgb;
            position: Vector2;
            velocity: Vector2;
            size: Vector2;
            isStill: boolean;
        };
        const state = {
            environment: {
                time: 0,
                timeLast: timeProvider.now(),
                timeMsStart: timeProvider.now(),
                timeDelta: 0,
                tick: 0,
                size: { x: 600, y: 600 },
            },
            input: {
                u: false,
                d: false,
                l: false,
                r: false,
            },
            player: {
                id: 42,
                position: { x: 0.5, y: 0.5 },
                velocity: { x: 0, y: 0 },
                size: { x: 0.05, y: 0.05 },
                color: { r: COLOR_STRENGTH, g: COLOR_STRENGTH, b: COLOR_STRENGTH },
                color1: { r: COLOR_STRENGTH, g: COLOR_STRENGTH, b: COLOR_STRENGTH },
                color2: { r: COLOR_STRENGTH, g: COLOR_STRENGTH, b: COLOR_STRENGTH },
                color2Stength: 0.5,
            },
            obstacles: [] as Entity[],
            obstaclesState: {
                timeNextObstacle: 1,
            },
        };

        const updatePlayer = () => {
            const { player, environment: { timeDelta, size } } = state;

            // Player color
            player.color2Stength += timeDelta * 1;
            if (player.color2Stength > 1) {
                player.color1 = player.color2;
                player.color2 = {
                    r: 1 * COLOR_STRENGTH * 0.5 * Math.random(),
                    g: 1 * COLOR_STRENGTH * 0.5 * Math.random(),
                    b: 1 * COLOR_STRENGTH * 0.5 * Math.random(),
                };
                player.color2Stength = 0;
            }


            const ratio = player.color2Stength;
            player.color = {
                r: (1 - ratio) * player.color1.r + ratio * player.color2.r,
                g: (1 - ratio) * player.color1.g + ratio * player.color2.g,
                b: (1 - ratio) * player.color1.b + ratio * player.color2.b,
            };

            // Player motion
            const speedX = 0.9;
            const speedY = speedX * size.x / size.y;
            player.velocity = {
                x: player.velocity.x + timeDelta * (state.input.l ? -speedX : state.input.r ? speedX : 0),
                y: player.velocity.y + timeDelta * (state.input.d ? -speedY : state.input.u ? speedY : 0),
            };

            player.position.x += timeDelta * player.velocity.x;
            player.position.y += timeDelta * player.velocity.y;

            // Dampening
            player.velocity.x *= 1 - (0.5 * timeDelta);
            player.velocity.y *= 1 - (0.5 * timeDelta);

            // Gravity
            player.velocity.y -= timeDelta * 0.4;

            // Boundaries
            if (player.position.x < 0) { player.position.x = 0; player.velocity.x = 0; }
            if (player.position.x > 1) { player.position.x = 1; player.velocity.x = 0; }
            if (player.position.y < 0) { player.position.y = 0; player.velocity.y = 0; }
            if (player.position.y > 1) { player.position.y = 1; player.velocity.y = 0; }
        };

        const updateObstacles = (onPlayerHit: () => void) => {
            const { player, obstacles, obstaclesState, environment: { time, timeDelta } } = state;

            if (time > obstaclesState.timeNextObstacle) {
                obstaclesState.timeNextObstacle = time + 1.5;

                let freeObstacle = obstacles.find(x => x.position.x < -0.25);
                if (!freeObstacle) {
                    freeObstacle = {
                        id: obstacles.length + 1000,
                        position: { x: 1.25, y: 0.1 },
                        velocity: { x: -0.125, y: 0 },
                        color: { r: 0.01, g: 0, b: 0 },
                        size: { x: 0.1, y: 0.1 },
                        isStill: false,
                    };
                    // Add an obstacle
                    obstacles.push(freeObstacle);
                }

                freeObstacle.color = { r: COLOR_STRENGTH * Math.random(), g: COLOR_STRENGTH * Math.random(), b: COLOR_STRENGTH * Math.random() };

                const motionSignX = Math.sign(MOTION_X);

                freeObstacle.position = { x: motionSignX * -1.05, y: Math.random() };
                freeObstacle.velocity = {
                    x: motionSignX * (0.05 + 0.25 * Math.random()),
                    y: (0.2 + 0.1 - 0.2 * Math.random()),
                };
                freeObstacle.isStill = Math.random() < 0.1;

                freeObstacle.size = { x: 0.1 + 0.02 * Math.random(), y: 0.1 + 0.02 * Math.random() };
            }

            for (const entity of obstacles) {
                if (entity.isStill) {
                    entity.velocity = { x: MOTION_X, y: MOTION_Y };
                }

                entity.position.x += entity.velocity.x * timeDelta;
                entity.position.y += entity.velocity.y * timeDelta;

                // Gravity
                entity.velocity.y -= timeDelta * 0.1;
            }

            // Collisions
            for (const entity of obstacles) {
                const r = 0.35 * (player.size.x + entity.size.x);
                if (r > Math.abs(entity.position.x - player.position.x)
                    && r > Math.abs(entity.position.y - player.position.y)
                ) {
                    onPlayerHit();
                }
            }

        };

        const minTickTimeMs = 16;
        const update = (args: UpdateArgs) => {
            // console.log(`game.update START`, {});

            if (destroyed) {
                console.error(`game.update DESTROYED`, {});
                return;
            }

            if (timeProvider.isPaused()) {
                console.log(`game.update timeProvider.PAUSED`, {});
                return;
            }

            const size = environmentProvider.getDisplaySize();
            state.environment.size = { x: size.width, y: size.height };
            state.environment.timeLast = state.environment.time;
            state.environment.time = 0.001 * (timeProvider.now() - state.environment.timeMsStart);
            state.environment.timeDelta = Math.max(minTickTimeMs * 0.001 * 0.5, state.environment.time - state.environment.timeLast);
            // console.log(`gameInverval`, { environment: state.environment });

            updatePlayer();
            updateObstacles(args.onPlayerHit);

            state.environment.tick++;

            // console.log(`game.update DONE`, {});
        };

        const render = (args: RenderArgs) => {
            const { player, obstacles } = state;

            args.setBackgroundVelocity({
                velocity: {
                    x: MOTION_X,
                    y: MOTION_Y,
                },
            });

            // Render Player
            args.renderEntity({
                id: player.id,
                kind: `player`,
                position: player.position,
                velocity: player.velocity,
                size: player.size,
                color: player.color,
            });

            // Render Entities
            for (const entity of obstacles) {

                const isHidden = entity.position.x < -0.25
                    || entity.position.x > 1.25
                    || entity.position.y < -0.25
                    || entity.position.y > 1.25;

                if (isHidden) {
                    args.removeEntity(entity.id);
                    continue;
                }

                if (entity.isStill) {
                    args.renderEntity({
                        id: entity.id,
                        kind: `obstacle-still`,
                        position: entity.position,
                        velocity: { x: 0, y: 0 },
                        size: entity.size,
                        color: entity.color,
                    });
                    continue;
                }

                args.renderEntity({
                    id: entity.id,
                    kind: `obstacle`,
                    position: entity.position,
                    velocity: entity.velocity,
                    size: entity.size,
                    color: entity.color,
                });
            }
        };

        const windowSubs = [] as { name: string, handler: () => void }[];
        const windowAddEventListener = ((name: string, handler: () => void) => {
            window.addEventListener(name, handler);
            windowSubs.push({ name, handler });
        }) as typeof window.addEventListener;
        const windowEventListenersDestroy = () => {
            windowSubs.forEach(({ name, handler }) => {
                window.removeEventListener(name, handler);
            });
        };
        windowAddEventListener(`keydown`, e => {
            if (e.key === `w` || e.key === `ArrowUp`) { state.input.u = true; }
            if (e.key === `a` || e.key === `ArrowLeft`) { state.input.l = true; }
            if (e.key === `s` || e.key === `ArrowDown`) { state.input.d = true; }
            if (e.key === `d` || e.key === `ArrowRight`) { state.input.r = true; }
        });
        windowAddEventListener(`keyup`, e => {
            if (e.key === `w` || e.key === `ArrowUp`) { state.input.u = false; }
            if (e.key === `a` || e.key === `ArrowLeft`) { state.input.l = false; }
            if (e.key === `s` || e.key === `ArrowDown`) { state.input.d = false; }
            if (e.key === `d` || e.key === `ArrowRight`) { state.input.r = false; }
        });


        return {
            start: () => { },
            update,
            render,
            destroy: () => {
                windowEventListenersDestroy();
                destroyed = true;
            },
        };
    },
};
