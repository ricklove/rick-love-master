/* eslint-disable new-cap */
/* eslint-disable no-new */
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import p5 from 'p5';
import { createRandomGenerator } from '../../rando';


const parseTokenId_puzzle01 = (tokenId: string) => { return tokenId; };

export const art_puzzle01 = {
    key: `art-puzzle-01`,
    title: `Puzzle 01`,
    description: `Try to puzzle it out and unlock the answer.`,
    artist: `Rick Love`,
    getTokenDescription: (tokenId: string) => {
        const tokenData = parseTokenId_puzzle01(tokenId);
        if (!tokenData) { return null; }

        return `TokenId: ${tokenData}`;
    },
    renderArt: (hostElement: HTMLElement, tokenId: string) => {
        // const { a, b, c } = { a: 57, b: 23, c: 15 };


        const tokenData = parseTokenId_puzzle01(tokenId);

        type Vector2 = { x: number, y: number };

        type BoardItem = {
            /** Seed for the render math */
            renderSeed: string;
            item: 'player' | 'exit' | 'entrance' | 'wall' | 'wall-broken';
            pos: Vector2;

            renderPos?: Vector2;
            targetRenderPos?: Vector2;
            activeMove?: ActualMove;
        }
        type MoveDirection = 'up' | 'down' | 'left' | 'right';
        const oppositeDirection = (dir: MoveDirection): MoveDirection => {
            switch (dir) {
                case `up`: return `down`;
                case `down`: return `up`;
                case `left`: return `right`;
                case `right`: return `left`;
                default: return `up`;
            }
        };
        type Move = {
            direction: MoveDirection;
            distance: number;
        };
        type ActualMove = {
            direction: MoveDirection;
            distance: number;
            startPosition: Vector2;
            endPosition: Vector2;
        };
        const state = {
            board: [] as BoardItem[],
            boardVisits: [] as { pos: Vector2 }[],
            moveSequence: [] as ActualMove[],
            player: {} as BoardItem,
            moveIndex: 0,
        };

        const canvasSize = 350;
        const gridSize = 16;
        const itemSize = 20;
        const gridAreaOffset = 15;
        const maxMoveCount = 20;

        const calculateNextPos = (posRaw: Vector2, dir: MoveDirection): Vector2 => {
            const pos = { ...posRaw };
            if (dir === `up`) { pos.y--; }
            if (dir === `down`) { pos.y++; }
            if (dir === `left`) { pos.x--; }
            if (dir === `right`) { pos.x++; }
            return pos;
        };

        return new p5((s: p5) => {
            s.setup = () => {
                s.createCanvas(canvasSize, canvasSize);
                s.background(0);
                // s.colorMode(s.HSB);

                // Create board out of backwards generation of correct moves
                const { random } = createRandomGenerator(tokenId);

                const { board, boardVisits } = state;
                const exit: BoardItem = {
                    renderSeed: `${random()}`,
                    item: `exit`,
                    pos: {
                        x: Math.floor(1 + (gridSize - 2) * random()),
                        y: Math.floor(1 + (gridSize - 2) * random()),
                    },
                };

                state.player = {
                    renderSeed: `${random()}`,
                    item: `player`,
                    pos: { ...exit.pos },
                    renderPos: { x: 0, y: 0 },
                };
                const { player } = state;

                board.push(exit);
                // board.push(player);

                // // Crete outer wall
                // for (let i = 0; i < gridSize; i++) {
                //     board.push({ renderSeed: `${random()}`, item: `wall`, pos: { x: i, y: 0 } });
                //     board.push({ renderSeed: `${random()}`, item: `wall`, pos: { x: i, y: gridSize - 1 } });
                //     board.push({ renderSeed: `${random()}`, item: `wall`, pos: { x: 0, y: i } });
                //     board.push({ renderSeed: `${random()}`, item: `wall`, pos: { x: gridSize - 1, y: i } });
                // }

                const randomMoveDirection = (): MoveDirection => {
                    const r = random();
                    if (r > 0.75) { return `up`; }
                    if (r > 0.5) { return `down`; }
                    if (r > 0.25) { return `left`; }
                    return `right`;
                };
                const randomMove = (): Move => {
                    return {
                        direction: randomMoveDirection(),
                        distance: Math.floor(0 + gridSize * 0.75 * random()),
                    };
                };

                const wallColorMaxCount = 16;
                const wallColorCount = 4 + Math.floor(random() * (wallColorMaxCount - 4));
                const wallColors = [...new Array(wallColorCount)].map(x => `${random()}`);
                const getNextWallRandomSeed = () => {
                    return wallColors[Math.floor(random() * wallColorCount)];
                };

                // Reversed moves to generate board
                let lastReverseMove = {
                    distance: 0,
                    direction: `unknown`,
                } as unknown as Move;

                const calculatePlayerReverseMove = (reverseMove: Move): null | ActualMove => {
                    let d = reverseMove.distance;
                    let lastPos = { ...player.pos };

                    const dir = reverseMove.direction;
                    while (d > 0) {
                        const pos = calculateNextPos(lastPos, dir);
                        const nextPos = calculateNextPos(lastPos, dir);

                        // Past edge - fail
                        if (pos.x <= 0 || pos.x >= gridSize - 1
                            || pos.y <= 0 || pos.y >= gridSize - 1) { return null; }

                        // Hit existing wall - fail
                        const itemAtPos = board.find(x => x.item !== `player` && x.pos.x === pos.x && x.pos.y === pos.y);
                        if (itemAtPos?.item === `wall`) { return null; }

                        // Already next wall - fail
                        const itemAtNextPos = board.find(x => x.item !== `player` && x.pos.x === nextPos.x && x.pos.y === nextPos.y);
                        if (itemAtNextPos?.item === `wall`) { return null; }

                        d--;
                        lastPos = { ...pos };
                    }

                    // If in line with any existing endmove, reject
                    const inLineWithLastPos = state.moveSequence.find(m => m.endPosition.x === lastPos.x || m.endPosition.y === lastPos.y);
                    if (inLineWithLastPos) { return null; }

                    const actualDistance = reverseMove.distance - d;
                    return {
                        direction: oppositeDirection(reverseMove.direction),
                        distance: actualDistance,
                        endPosition: { ...player.pos },
                        startPosition: lastPos,
                    };
                };

                // Add outer wall
                for (let i = 0; i < gridSize; i++) {
                    board.push({ renderSeed: getNextWallRandomSeed(), item: `wall`, pos: { x: i, y: 0 } });
                    board.push({ renderSeed: getNextWallRandomSeed(), item: `wall`, pos: { x: i, y: gridSize - 1 } });
                    board.push({ renderSeed: getNextWallRandomSeed(), item: `wall`, pos: { x: 0, y: i } });
                    board.push({ renderSeed: getNextWallRandomSeed(), item: `wall`, pos: { x: gridSize - 1, y: i } });
                }

                // Add game walls
                for (let i = 0; i < maxMoveCount; i++) {

                    // Reverse Move player
                    let reverseMove = randomMove();
                    while (reverseMove.direction === lastReverseMove.direction
                        || reverseMove.direction === oppositeDirection(lastReverseMove.direction)) {
                        reverseMove = randomMove();
                    }

                    // Calculate reverse move
                    const actualMove = calculatePlayerReverseMove(reverseMove);
                    if (!actualMove || actualMove.distance <= 0) {
                        continue;
                    }

                    // Add wall which would have stopped the player (having made this move forward)
                    if (state.moveSequence.length > 0) {
                        const nextPos = calculateNextPos(player.pos, oppositeDirection(reverseMove.direction));
                        board.push({
                            item: `wall`,
                            pos: nextPos,
                            renderSeed: getNextWallRandomSeed(),
                        });
                    }

                    // Move player
                    player.pos = actualMove.startPosition;
                    state.moveSequence.unshift(actualMove);
                    lastReverseMove = actualMove;

                    // Add board visits
                    let p = actualMove.startPosition;
                    state.boardVisits.push({ pos: { ...p } });
                    while (p.x !== actualMove.endPosition.x
                        || p.y !== actualMove.endPosition.y) {
                        p = calculateNextPos(p, actualMove.direction);
                        state.boardVisits.push({ pos: { ...p } });
                    }

                    console.log(`boardVisits`, { actualReverseMove: actualMove, boardVisits: [...state.boardVisits] });
                }

                // Add random walls
                for (let x = 0; x < gridSize; x++) {
                    for (let y = 0; y < gridSize; y++) {
                        const isVisited = !!boardVisits.find(b => b.pos.x === x && b.pos.y === y);
                        const item = !!board.find(b => b.pos.x === x && b.pos.y === y);

                        if (isVisited || item) { continue; }

                        if (random() > 0.75) {
                            board.push({
                                item: `wall`,
                                pos: { x, y },
                                renderSeed: getNextWallRandomSeed(),
                            });
                        }
                    }
                }


                player.renderPos = getRenderPosition(player.pos);
                state.board.forEach(x => drawPuzzleItem(x));
            };

            const getRenderPosition = (p: Vector2) => {
                const x = gridAreaOffset + p.x * itemSize;
                const y = gridAreaOffset + p.y * itemSize;
                return { x, y };
            };

            const drawPuzzleItem = (item: typeof state.board[0]) => {
                const { random } = createRandomGenerator(item.renderSeed);
                const { a, b, c } = { a: 1 + Math.floor(57 * random()), b: 1 + Math.floor(213 * random()), c: 1 + Math.floor(115 * random()) };
                const { cr, cg, cb, ca } = { cr: Math.floor(25 + 230 * random()), cg: Math.floor(25 + 230 * random()), cb: Math.floor(25 + 230 * random()), ca: Math.floor(25 + 125 * random()) };

                const { x, y } = item.renderPos ?? getRenderPosition(item.pos);
                s.fill(cr, cg, cb, ca);
                s.stroke(cr, cg, cb, 255);
                s.strokeWeight(1);

                const gameWon = state.moveIndex >= state.moveSequence.length && !state.player.targetRenderPos;

                const aOffset = tick / 100;
                const tOffset = Math.abs(Math.floor(Math.sin((tick + a * c) / 1000) * canvasSize));
                const alphaCycle = 100;

                if (item.item === `player`) {
                    if (gameWon) {
                        s.stroke(0, 0, 0, 10);

                        let mod = tick;
                        for (let i = 0; i < 16; i++) {
                            s.fill(cr, cg, (cb + i * c) % 255, Math.floor(Math.sin((tick + a * c) / alphaCycle) * 25 + 35));

                            const j = 0;
                            s.circle(200 - a / 2 + j % a, 200 - b / 2 + j % b, 270 - (i * 5) % c);
                            s.translate(tOffset, tOffset);
                            // s.rotate((a + b + c + tick * 0.001) % 2);
                            s.rotate(((a + b + c + mod) * 0.001));
                            s.translate(-tOffset, -tOffset);
                            mod++;
                        }
                        return;
                    }

                    s.fill(0, 0, 0, 0);
                    const circleCount = 4;
                    const spiralRadius = 0.1;
                    for (let i = 0; i < circleCount; i++) {
                        s.stroke(cr, cg, cb, Math.floor(255 * (i + 1) / (circleCount + 1)));

                        s.circle(x + itemSize * (0.5 + spiralRadius * Math.cos(2 * Math.PI * (i / circleCount + tick / 100))), y + itemSize * (0.5 + spiralRadius * Math.sin(2 * Math.PI * (i / circleCount + tick / 100))), itemSize);
                    }

                    // s.circle(x + 0.5 * itemSize, y + 0.5 * itemSize, itemSize);
                    return;
                }

                if (item.item === `exit`) {
                    if (gameWon) {
                        s.fill(cr, cg, cb, Math.floor(Math.sin((tick + a * c) / alphaCycle) * 25 + 35));
                        s.stroke(0, 0, 0, 10);

                        let angle = a;
                        let trans = c;
                        for (let i = 0; i < 32; i++) {

                            // s.rect(x + itemSize * 0.25, y + itemSize * 0.25, itemSize * 0.5, itemSize * 0.5);
                            s.translate(trans, trans);
                            s.rotate(angle + aOffset);
                            s.rect(x + itemSize * 0.25, y + itemSize * 0.25, c * x, c * y);
                            s.rotate(-angle - aOffset);
                            s.translate(-trans, -trans);
                            angle += b;
                            trans += c;
                            trans %= 125;
                        }
                        return;
                    }

                    // s.fill(cr, cg, cb, 200);
                    s.fill(255, 255, 255);
                    s.rect(x, y, itemSize, itemSize);
                    s.fill(0, 0, 0);
                    s.rect(x + itemSize * 0.25, y + itemSize * 0.25, itemSize * 0.5, itemSize * 0.5);
                    return;
                }

                if (item.item === `wall-broken`) {
                    s.fill(cr, cg, cb, Math.floor(Math.sin((tick + a * c) / alphaCycle) * 25 + 25));
                    s.stroke(0, 0, 0, 10);

                    let angle = a;
                    const trans = c % (canvasSize * 0.5);
                    for (let i = 0; i < 8; i++) {

                        s.translate(-trans, -trans);
                        s.rotate(angle + aOffset);
                        s.rect(x, y, itemSize * x, itemSize * y);
                        s.rotate(-angle - aOffset);
                        s.translate(trans, trans);
                        angle += b;
                        // trans += c;
                        // trans %= 3;
                    }
                    return;

                    // s.rect(x + itemSize * 0.25, y + itemSize * 0.25, itemSize * 0.5, itemSize * 0.5);
                    // s.rect(x, y, itemSize * x, itemSize * y);
                    // return;
                }

                if (gameWon) {
                    // return;
                    s.fill(cr, cg, cb, Math.floor(Math.sin((tick + a * c) / alphaCycle) * 25 + 25));
                    s.rect(x, y, itemSize, itemSize);
                    return;
                }
                // s.rect(x, y, itemSize, itemSize);

                s.fill(0, 0, 0, 0);
                const circleCount = 4;
                const spiralRadius = 0.1;
                const iOffset = random();
                for (let i = 0; i < circleCount; i++) {
                    s.stroke(cr, cg, cb, Math.floor(255 * (i + 1) / (circleCount + 1)));
                    s.rect(x + itemSize * (0 + spiralRadius * Math.cos(2 * Math.PI * ((iOffset + i) / circleCount + tick / 100))), y + itemSize * (0 + spiralRadius * Math.sin(2 * Math.PI * ((iOffset + i) / circleCount + tick / 100))), itemSize, itemSize);
                }
            };

            let tick = 0;
            s.draw = () => {
                s.background(0);
                // s.background(0, 0, 0, 5);

                const drawMoveHistory = (m: typeof state.moveSequence[0]) => {
                    s.noFill();
                    s.stroke(255, 255, 255, 100);

                    const x1 = gridAreaOffset + m.startPosition.x * itemSize + itemSize * 0.5;
                    const y1 = gridAreaOffset + m.startPosition.y * itemSize + itemSize * 0.5;
                    const x2 = gridAreaOffset + m.endPosition.x * itemSize + itemSize * 0.5;
                    const y2 = gridAreaOffset + m.endPosition.y * itemSize + itemSize * 0.5;
                    s.line(x1, y1, x2, y2);
                    s.line(x1 + itemSize * 0.25, y1 + itemSize * 0.25, x2, y2);

                    // s.text(`${i}`, x1,y1);
                };

                // state.board.forEach(x => drawPuzzleItem(x));
                state.board.filter(x => x.item === `wall-broken`).forEach(x => drawPuzzleItem(x));
                state.board.filter(x => x.item !== `wall-broken`).forEach(x => drawPuzzleItem(x));

                drawPuzzleItem(state.player);

                // Animate
                if (state.player.activeMove && state.player.renderPos && state.player.targetRenderPos) {
                    // state.player.renderPos = {
                    //     x: 0.9 * state.player.renderPos.x + 0.1 * state.player.targetRenderPos.x,
                    //     y: 0.9 * state.player.renderPos.y + 0.1 * state.player.targetRenderPos.y,
                    // };

                    const speed = 3;
                    for (let i = 0; i < speed; i++) {
                        state.player.renderPos = calculateNextPos(state.player.renderPos, state.player.activeMove.direction);

                        const dist = Math.abs(state.player.renderPos.x - state.player.targetRenderPos.x)
                            + Math.abs(state.player.renderPos.y - state.player.targetRenderPos.y);
                        if (dist < 1) {
                            state.player.renderPos = state.player.targetRenderPos;
                            break;
                        }
                    }
                }

                // If player is done animating destroy wall
                const { activeMove } = state.player;

                const pPos = state.player.renderPos;
                const tPos = state.player.targetRenderPos;
                if (activeMove && pPos && tPos && pPos.x === tPos.x && pPos.y === tPos.y) {
                    console.log(`Reached`, { activeMove, pPos, tPos });
                    state.player.targetRenderPos = undefined;

                    // Break any walls that have been reached
                    for (const m of state.moveSequence.slice(0, state.moveIndex)) {
                        const wallPos = calculateNextPos(m.endPosition, m.direction);
                        const wall = state.board.find(x => x.pos.x === wallPos.x && x.pos.y === wallPos.y);
                        if (!wall) { continue; }

                        wall.item = `wall-broken`;
                    }
                }


                // Debug
                //  state.moveSequence.forEach(x => drawMoveHistory(x));
                tick++;
            };

            s.keyPressed = () => {
                const { key, keyCode } = s;

                const getKeyDirection = (): null | MoveDirection => {
                    switch (key) {
                        case `w`: return `up`;
                        case `a`: return `left`;
                        case `s`: return `down`;
                        case `d`: return `right`;
                        default: break;
                    }
                    switch (keyCode) {
                        case s.UP_ARROW: return `up`;
                        case s.LEFT_ARROW: return `left`;
                        case s.DOWN_ARROW: return `down`;
                        case s.RIGHT_ARROW: return `right`;
                        default: return null;
                    }
                };

                const d = getKeyDirection();
                if (!d) { return; }

                // Move the player
                const nextMove = state.moveSequence[state.moveIndex];
                if (!nextMove) { return; }

                if (nextMove.direction !== d) {
                    state.moveIndex = 0;
                    state.player.activeMove = undefined;
                    state.player.renderPos = undefined;
                    state.player.targetRenderPos = undefined;
                    state.board.filter(x => x.item === `wall-broken`).forEach(x => { x.item = `wall`; });
                    return;
                }

                state.player.activeMove = nextMove;
                state.player.renderPos = getRenderPosition(nextMove.startPosition);
                state.player.targetRenderPos = getRenderPosition(nextMove.endPosition);
                state.moveIndex++;
            };
        }, hostElement);
    },
};
