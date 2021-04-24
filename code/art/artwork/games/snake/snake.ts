import { ArtGame } from '../art-game';
import { EventProvider } from '../event-provider';
import { ColorRgb, Vector2, scaleByPixelRatio, Rect2 } from '../utils';

type EntityRenderData = {
    id: number;
    kind: 'player' | 'obstacle' | 'obstacle-still';
    position: Vector2;
    velocity: Vector2;
    size: Vector2;
    color: ColorRgb;
};
type RenderArgs = {
    onPlayerHit: (data: { position: Vector2 }) => void;
    onPlayerReward: (data: { position: Vector2 }) => void;
    onBeat: (data: { positions: Vector2[] }) => void;
    renderEntity: (data: EntityRenderData) => void;
    removeEntity: (id: number) => void;
    setBackgroundVelocity: (data: { velocity: Vector2 }) => void;
}
export const snakeGame: ArtGame<RenderArgs> = {
    name: `Snake`,
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
        type Segment = Entity & {
            targetPosition: Vector2;
        };
        const state = {
            environment: {
                time: 0,
                timeLast: timeProvider.now(),
                timeMsStart: timeProvider.now(),
                timeDelta: 0,
                tick: 0,
                size: { x: 600, y: 600 },
                gridSize: { x: 16, y: 9 },
            },
            input: {
                u: false,
                d: false,
                l: false,
                r: false,
                pointer: null as null | {
                    position: Vector2;
                    timeMs: number;
                },
                lastTime: -1000,
            },
            player: {
                id: 42,
                position: { x: 0.5, y: 0.5 },
                targetGridPosition: { x: 10, y: 10 },
                targetPosition: { x: 0.5, y: 0.5 },
                velocity: { x: 0, y: 0 },
                size: { x: 0.01, y: 0.01 },
                sizeInit: { x: 0.01, y: 0.01 },
                color: { r: COLOR_STRENGTH, g: COLOR_STRENGTH, b: COLOR_STRENGTH },
                color1: { r: COLOR_STRENGTH, g: COLOR_STRENGTH, b: COLOR_STRENGTH },
                color2: { r: COLOR_STRENGTH, g: COLOR_STRENGTH, b: COLOR_STRENGTH },
                color2Stength: 0.5,
                segments: [] as Segment[],
            },
            playerState: {
                deadAtTime: null as null | number,
                restartAtTime: null as null | number,
                wasHitThisFrame: false,
                ateThisFrame: false,
                wasThisFrameOnBeat: false,
                timeNextTurn: 0,
                nextDirection: { x: 1, y: 0 },
            },
            food: [] as Entity[],
            foodState: {
            },
        };

        const toPositionFromGridPosition = (gridPosition: Vector2) => {
            return Vector2.divide(
                Vector2.add(gridPosition, { x: 0.5, y: 0.5 }), 
                Vector2.add(state.environment.gridSize, { x:1, y:1 }));
        };

        const adjustGridPositionForWall = (gridPosition: Vector2)=>{
            const g = {...gridPosition};
            const s = state.environment.gridSize;
            if (g.x < 0)   { g.x = 0;     }
            if (g.y < 0)   { g.y = 0;     }
            if (g.x > s.x) { g.x = s.x;   }
            if (g.y > s.y) { g.y = s.y;   }

            return g;
        };

        const updateAutoPilot = () => {
            const { player, playerState, input, environment: { time, timeDelta, size } } = state;

            if( time < state.input.lastTime + 15 ) { return; }
            
            // Turn toward the food
            const f = state.food[0];
            if(!f){ return; }

            const foodDelta = Vector2.subtract( f.position, player.position );
            const nextPlayerPosition_noTurn = toPositionFromGridPosition(Vector2.add(player.targetGridPosition, playerState.nextDirection));

            const turnNone = playerState.nextDirection;
            const turnA = {
                x: playerState.nextDirection.y,
                y: playerState.nextDirection.x,
            };
            const turnB = {
                x: -playerState.nextDirection.y,
                y: -playerState.nextDirection.x,
            };
            const nextPlayerPosition_turnA = toPositionFromGridPosition(Vector2.add(player.targetGridPosition, turnA));
            const nextPlayerPosition_turnB = toPositionFromGridPosition(Vector2.add(player.targetGridPosition, turnB));

            // Turn to food
            const nextFoodDelta = Vector2.subtract( f.position, nextPlayerPosition_noTurn );
            const isGoingTowardsFood = Vector2.lengthSq(nextFoodDelta) < Vector2.lengthSq(foodDelta) ;

            if( !isGoingTowardsFood && Math.random() < 0.75 ){

                const turnAFoodDelta = Vector2.subtract( f.position, nextPlayerPosition_turnA );
                const turnBFoodDelta = Vector2.subtract( f.position, nextPlayerPosition_turnB );

                if( Vector2.lengthSq(turnAFoodDelta) < Vector2.lengthSq(turnBFoodDelta) ){
                    playerState.nextDirection = turnA;
                }else{
                    playerState.nextDirection = turnB;
                }
            }

            // Avoid hit
            const willHitWall_turnA = !Vector2.equal(nextPlayerPosition_turnA, adjustGridPositionForWall(nextPlayerPosition_turnA));
            const willHitWall_turnB = !Vector2.equal(nextPlayerPosition_turnB, adjustGridPositionForWall(nextPlayerPosition_turnB));

            const willHit_turnA = willHitWall_turnA || player.segments.some(x=> Vector2.equal(x.targetPosition, nextPlayerPosition_turnA));
            const willHit_turnB = willHitWall_turnB || player.segments.some(x=> Vector2.equal(x.targetPosition, nextPlayerPosition_turnB));
            if( willHit_turnA && willHit_turnB ){
                playerState.nextDirection = turnNone;
                return;
            }
            if( willHit_turnA ){
                playerState.nextDirection = turnB;
                return;
            }
            if( willHit_turnB ){
                playerState.nextDirection = turnA;
                return;
            }
        };

        const addPlayerSegment = () => {
            const { player } = state;
            const s = player.segments[player.segments.length-1] ?? player;

            player.segments.push({
                id: 1000 + player.segments.length,
                isStill: false,
                color: {...player.color},
                position: {...s.position},
                velocity: {...s.velocity},
                size: {...s.size},
                targetPosition: Vector2.add({...s.targetPosition}, { x: 0.001, y: 0 }),
            });

            const GROWTH_SCALE = 1.01;
            player.size = Vector2.scale( GROWTH_SCALE, player.size );
            player.segments.forEach(x => {x.size = Vector2.scale( GROWTH_SCALE, x.size ); });
        };

        const updatePlayer = () => {
            const { player, playerState, input, environment: { time, timeDelta, size } } = state;

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
            if(input.l){ playerState.nextDirection = { x: -1, y: +0 }; }
            if(input.r){ playerState.nextDirection = { x: +1, y: +0 }; }
            if(input.u){ playerState.nextDirection = { x: +0, y: +1 }; }
            if(input.d){ playerState.nextDirection = { x: +0, y: -1 }; }

            const gridUnitPerSec = 3 * Math.pow(1.01, player.segments.length);
            const timePerUnit = 1 / gridUnitPerSec;

            // Change directions
            if(time > playerState.timeNextTurn){
                playerState.timeNextTurn = time + timePerUnit;
                playerState.wasThisFrameOnBeat = true;

                // Segments
                for(let i = player.segments.length - 1; i >= 0; i--){
                    player.segments[i].targetPosition = player.segments[i-1]?.targetPosition ?? player.targetPosition;
                    const deltaSegment = Vector2.subtract(player.segments[i].targetPosition, player.segments[i].position);
                    player.segments[i].velocity = {
                        x: deltaSegment.x * gridUnitPerSec,
                        y: deltaSegment.y * gridUnitPerSec,
                    };
                }

                // If autopilot
                updateAutoPilot();
                               
                player.targetGridPosition = playerState.deadAtTime ? player.targetGridPosition 
                    : Vector2.add(player.targetGridPosition, playerState.nextDirection);

                // Block
                player.targetGridPosition = adjustGridPositionForWall(player.targetGridPosition);

                player.targetPosition = toPositionFromGridPosition(player.targetGridPosition);
                const delta = Vector2.subtract(player.targetPosition, player.position);
                player.velocity = {
                    x: delta.x * gridUnitPerSec,
                    y: delta.y * gridUnitPerSec,
                };

                // // TEST
                // if( Math.random() < 0.25 ){
                //     addPlayerSegment();
                // }
        
            }

            // const speedX = 0.9;
            // const speedY = speedX * size.x / size.y;

            player.position.x += timeDelta * player.velocity.x;
            player.position.y += timeDelta * player.velocity.y;

            // Segments
            for(const s of player.segments){
                s.position.x += timeDelta * s.velocity.x;
                s.position.y += timeDelta * s.velocity.y;
            }

            // Wrap 
            // if (player.position.x < 0) { player.position.x = 1; player.targetPosition = player.position; }
            // if (player.position.x > 1) { player.position.x = 0; player.targetPosition = player.position; }
            // if (player.position.y < 0) { player.position.y = 1; player.targetPosition = player.position; }
            // if (player.position.y > 1) { player.position.y = 0; player.targetPosition = player.position; }

             // Collisions
             for (const entity of player.segments) {
                if (Vector2.distanceSq(entity.targetPosition, player.targetPosition) <= 0) {
                    state.playerState.wasHitThisFrame = true;
                    state.playerState.deadAtTime = time;
                    break;
                }
            }
            
            // Reset player if all segments have been smashed
            if( state.playerState.deadAtTime && !state.playerState.restartAtTime ){
                const allAtPlayer = player.segments.every(x=>Vector2.distanceSq(x.targetPosition, player.targetPosition) <= 0.01);
                if( allAtPlayer){
                    playerState.restartAtTime = time + 3;
                }
            }
            if( state.playerState.restartAtTime && time > state.playerState.restartAtTime ){
                player.segments = [];
                playerState.deadAtTime = null;
                playerState.restartAtTime = null;
                player.size = {...player.sizeInit};
            }
        };

        const updateObstacles = () => {
            const { player, food, foodState, environment: { time, timeDelta } } = state;
            const gridUnitSize = Vector2.divide( {x:1, y:1}, state.environment.gridSize);

            if( food.length <= 0 ){
                food.push({
                    id: 10000 + food.length,
                    color: player.color,
                    isStill: true,
                    position: { x: 0.1 + 0.8 * Math.random(), y: 0.1 + 0.8 * Math.random() },
                    size: gridUnitSize,
                    velocity: { x: 0, y: 0 },
                });
            }
            // if (time > obstaclesState.timeNextObstacle) {
            //     obstaclesState.timeNextObstacle = time + 1.5;

            //     let freeObstacle = obstacles.find(x => x.position.x < -0.25);
            //     if (!freeObstacle) {
            //         freeObstacle = {
            //             id: obstacles.length + 1000,
            //             position: { x: 1.25, y: 0.1 },
            //             velocity: { x: -0.125, y: 0 },
            //             color: { r: 0.01, g: 0, b: 0 },
            //             size: { x: 0.05, y: 0.05 },
            //             isStill: false,
            //         };
            //         // Add an obstacle
            //         obstacles.push(freeObstacle);
            //     }

            //     freeObstacle.color = { r: COLOR_STRENGTH * Math.random(), g: COLOR_STRENGTH * Math.random(), b: COLOR_STRENGTH * Math.random() };

            //     const motionSignX = Math.sign(MOTION_X);

            //     freeObstacle.position = { x: motionSignX * -1.05, y: Math.random() };
            //     freeObstacle.velocity = {
            //         x: motionSignX * (0.05 + 0.25 * Math.random()),
            //         y: (0.2 + 0.1 - 0.2 * Math.random()),
            //     };
            //     freeObstacle.isStill = Math.random() < 0.1;

            //     freeObstacle.size = { x: 0.05 + 0.01 * Math.random(), y: 0.05 + 0.01 * Math.random() };
            // }

            // for (const entity of obstacles) {
            //     if (entity.isStill) {
            //         entity.velocity = { x: MOTION_X, y: MOTION_Y };
            //     }

            //     entity.position.x += entity.velocity.x * timeDelta;
            //     entity.position.y += entity.velocity.y * timeDelta;

            //     // Gravity
            //     entity.velocity.y -= timeDelta * 0.1;
            // }

            // Collisions
            for (const [i,entity] of food.entries()) {
                if (Rect2.collidesRectangle(entity, player, 0.8)) {
                    state.playerState.ateThisFrame = true;
                    addPlayerSegment();

                    food.splice(i, 1);
                    break;
                }
            }

        };

        const minTickTimeMs = 16;
        const update = () => {
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

            state.playerState.ateThisFrame = false;
            state.playerState.wasHitThisFrame = false;
            state.playerState.wasThisFrameOnBeat = false;
            updatePlayer();
            updateObstacles();

            // Fix sizes
            const displaySize = environmentProvider.getDisplaySize();
            for (const x of [state.player, ...state.food]) {
                x.size.y = x.size.x * displaySize.width / displaySize.height;
            }

            state.environment.tick++;

            // console.log(`game.update DONE`, {});
        };

        const render = (args: RenderArgs) => {
            const { player, playerState, food: obstacles } = state;

            // args.setBackgroundVelocity({
            //     velocity: {
            //         x: MOTION_X,
            //         y: MOTION_Y,
            //     },
            // });

            // Render Player
            args.renderEntity({
                id: player.id,
                kind: `player`,
                position: player.position,
                velocity: player.velocity,
                size: player.size,
                color: player.color,
            });

            if (playerState.ateThisFrame) {
                args.onPlayerReward({ position: player.segments[player.segments.length-1].position });
            }

            if (playerState.wasHitThisFrame) {
                args.onPlayerHit({ position: player.position });
            }

            if (playerState.wasThisFrameOnBeat) {
                args.onBeat({ positions: [player.position, ...player.segments.map(x=>x.position)] });
            }

            // Render player segments
            for (const s of player.segments) {
                args.renderEntity({
                    id: s.id,
                    kind: `obstacle`,
                    position: s.position,
                    velocity: s.velocity,
                    size: s.size,
                    color: s.color,
                });
            }

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


        const subscribeEvents = ({ windowAddEventListener, canvasAddEventListener, tools }: EventProvider) => {
            windowAddEventListener(`keydown`, e => {
                if (e.key === `w` || e.key === `ArrowUp`) { state.input.u = true;  state.input.lastTime = state.environment.time;  }
                if (e.key === `a` || e.key === `ArrowLeft`) { state.input.l = true;  state.input.lastTime = state.environment.time;  }
                if (e.key === `s` || e.key === `ArrowDown`) { state.input.d = true;  state.input.lastTime = state.environment.time;  }
                if (e.key === `d` || e.key === `ArrowRight`) { state.input.r = true;  state.input.lastTime = state.environment.time;  }
            });
            windowAddEventListener(`keyup`, e => {
                if (e.key === `w` || e.key === `ArrowUp`) { state.input.u = false; state.input.lastTime = state.environment.time; }
                if (e.key === `a` || e.key === `ArrowLeft`) { state.input.l = false; state.input.lastTime = state.environment.time; }
                if (e.key === `s` || e.key === `ArrowDown`) { state.input.d = false; state.input.lastTime = state.environment.time; }
                if (e.key === `d` || e.key === `ArrowRight`) { state.input.r = false; state.input.lastTime = state.environment.time; }
            });

            const setPointerPosition = (gamePosition: Vector2) => {
                state.input.pointer = {
                    position: gamePosition,
                    timeMs: timeProvider.now(),
                };
            };

            canvasAddEventListener(`mousedown`, e => {
                setPointerPosition(tools.getMouseGamePosition(e));
            });

            canvasAddEventListener(`mousemove`, e => {

                // Check if mouse active
                if (!state.input.pointer
                    || timeProvider.now() > state.input.pointer.timeMs + 1000) { return; }

                setPointerPosition(tools.getMouseGamePosition(e));
            });

            canvasAddEventListener(`touchstart`, e => {
                setPointerPosition(tools.getTouchPositions(e)[0]);
                e.preventDefault();
                return false;
            });

            canvasAddEventListener(`touchmove`, e => {
                setPointerPosition(tools.getTouchPositions(e)[0]);
                e.preventDefault();
                return false;
            }, false);
        };

        return {
            setup: (eventProvider) => {
                subscribeEvents(eventProvider);
            },
            update,
            render,
            destroy: () => {
                destroyed = true;
            },
        };
    },
    debugRenderer: (tools) => {
        return {
            onPlayerHit: (data) => {
                tools.drawX(data.position, { x: 0.1, y: 0.1 }, `#FF0000`);
            },
            onPlayerReward: (data) => {
                tools.drawX(data.position, { x: 0.1, y: 0.1 }, `#0000FF`);
            },
            onBeat: (data) => {
                data.positions.forEach( p => {
                    tools.drawX(p, { x: 0.1, y: 0.1 }, `#00FFFF`);
                });
            },
            renderEntity: (data) => {
                tools.drawBox(data.position, data.size, data.kind === `player` ? `#0000FF` : undefined);
                tools.drawArrow(data.position, Vector2.add(data.position, data.velocity), data.kind === `player` ? `#0000FF` : undefined);
            },
            removeEntity: (id) => {
                // tools.drawBox(data.position, data.size, `#FF000000`);
            },
            setBackgroundVelocity: (data) => {
                tools.drawArrow({ x: 0.5, y: 0.5 }, Vector2.add({ x: 0.5, y: 0.5 }, data.velocity), `#FFFF00`);
            },
        };
    },
};
