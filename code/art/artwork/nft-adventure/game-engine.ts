import { createRandomGenerator } from 'art/rando';
import type p5 from 'p5';
import { GameArt, GameStep, GameStepAction } from './types';
import { GameImage, loadAndScaleImage } from './utils';

type GameItem = {
    key: string;
    description: string;
};
type GameData = {
    story: GameStep[];
    items: readonly GameItem [];
};
export type GameCache = {
    images?: { [base64: string]: GameImage };
};
export const drawGameStep = ({
    step,
    gameCache,
    actionIndex,
    s: sRaw,
    timeMs: timeMsRaw,
    frame,
    seed,
    input,
    mode,
}: {
    step: GameStep;
    gameCache: GameCache;
    actionIndex?: number;
    s: p5;
    timeMs: number;
    frame: { width: number, height: number };
    seed: string;
    input: string;
    mode: 'step' | 'response';
}): { done: boolean } => {

    if (!step){ return { done: true };}

    // s Buffer
    const sQueue = [] as { callback: () => void, lineCount: number }[];
    const s = {
        color: (r: number, g: number, b: number, a?: number) => sRaw.color(r, g, b, a),
        textWidth: (text: string) => sRaw.textWidth(text),
        noStroke: () => {
            sQueue.push({ callback: () => sRaw.noStroke(), lineCount });
        },
        stroke: (color: p5.Color) => {
            sQueue.push({ callback: () => sRaw.stroke(color), lineCount });
        },
        fill: (color: p5.Color) => {
            sQueue.push({ callback: () => sRaw.fill(color), lineCount });
        },
        noTint: () => {
            sQueue.push({ callback: () => sRaw.noTint(), lineCount });
        },
        tint: (gray: number, alpha: number) => {
            sQueue.push({ callback: () => sRaw.tint(gray, alpha), lineCount });
        },
        background: (color: p5.Color) => {
            // console.log(`background`, { color });
            sQueue.push({ callback: () => sRaw.background(color), lineCount });
        },
        textAlign: (value: p5.HORIZ_ALIGN) => {
            sQueue.push({ callback: () => sRaw.textAlign(value), lineCount });
        },
        textSize: (value: number) => {
            // This is needed for text width
            sRaw.textSize(value);
            sQueue.push({ callback: () => sRaw.textSize(value), lineCount });
        },
        text: (text: string, x: number, y: number, x2: number, y2: number) => {
            sQueue.push({ callback: () => sRaw.text(text, x, y, x2, y2), lineCount });
        },
        image: (value: p5.Image, x: number, y: number, w: number, h: number) => {
            sQueue.push({ callback: () => sRaw.image(value, x, y, w, h), lineCount });
        },
        rect: (x: number, y: number, w: number, h: number) => {
            sQueue.push({ callback: () => sRaw.rect(x, y, w, h), lineCount });
        },
        rotate: (value: number) => {
            sQueue.push({ callback: () => sRaw.rotate(value), lineCount });
        },
        scale: (x: number, y: number) => {
            sQueue.push({ callback: () => sRaw.scale(x, y), lineCount });
        },
    };

    const FONT_SIZE_L = 12;
    const FONT_SIZE_M = 8;
    const FONT_SIZE_S = 6;
    const LINE_HEIGHT = 20;
    const LINE_HEIGHT_MULTIPLIER = 1.4;
    const PAD = 4;
    const LINE_PAD = 12;
    const actionCount = step.actions.length;

    let lineCount = 0.0;

    const inner = () => {

        const timeMs = timeMsRaw;

        const { random: randomSlow } = createRandomGenerator(`${seed}${step}${Math.floor(timeMs / 250)}`);
        const { random: random } = createRandomGenerator(`${seed}${step}${Math.floor(timeMs / 50)}`);
        const shouldGlitch = step.glitch && randomSlow() > (1.0 - step.glitch.ratio);

        const charsPerSecond = 30;
        let charLength = Math.floor(timeMs / 1000 * charsPerSecond);

        const getBackgroundColor = (opacity = 1) =>
            s.color(25 - 25 * Math.cos((2 * Math.PI * timeMs / 1000) / 10), 0, 0, opacity * 255);
        const clearScreen = () => {
            s.background(getBackgroundColor());
            lineCount = 0;
        };
        const jumpToBottomLineOfScreen = (offsetLines = 1) => {
            const frameBottomLine = frame.height - PAD - LINE_HEIGHT * offsetLines;
            if (lineCount * LINE_HEIGHT < frameBottomLine){
                lineCount = frameBottomLine / LINE_HEIGHT;
            }
        };

        clearScreen();
        s.noStroke();
        s.fill(s.color(255, 255, 255));
        s.textAlign(`left`);
        s.textSize(FONT_SIZE_L);

        const printText = ({
            text,
            textLength,
            fontSize,
        }: {
            text: string;
            textLength: number;
            fontSize: number;
        }) => {

            s.textSize(fontSize);
            const charWidth = Math.ceil(s.textWidth(`MW`) / 2) + 1;

            const maxLineLength = Math.floor((frame.width - PAD * 2) / charWidth);
            const lines = text.split(`\n`);
            let remainingTextLength = textLength;
            const wrapped = [];

            outer: for (const l of lines){
                wrapped.push(``);

                const words = l.split(` `);
                for (const w of words){

                    if (w.length + wrapped[wrapped.length - 1].length > maxLineLength){
                    // Next line
                        wrapped.push(``);
                    }

                    const wRemaining = w.length > remainingTextLength ? w.substr(0, remainingTextLength) : w;
                    wrapped[wrapped.length - 1] += wRemaining + ` `;

                    remainingTextLength -= w.length;
                    if (remainingTextLength <= 0){
                        break outer;
                    }
                }
            }

            // Draw lines
            for (const l of wrapped){
                s.text(l,
                    Math.floor(PAD),
                    Math.floor(PAD * +1 + lineCount * LINE_HEIGHT),
                    Math.floor(PAD * -2 + frame.width),
                    Math.floor(PAD * +1 + (lineCount + 1) * LINE_HEIGHT),
                );
                lineCount += (fontSize * LINE_HEIGHT_MULTIPLIER) / LINE_HEIGHT;
            }

            lineCount += LINE_PAD / LINE_HEIGHT;
        };

        const drawTitleText = (t: string) => {
            s.text(t,
                PAD,
                PAD * +1 + 0 * LINE_HEIGHT,
                PAD * -2 + frame.width,
                PAD * +1 + 2 * LINE_HEIGHT,
            );
        };
        const drawAsciiArtText = (t: string) => {
            s.text(t,
                PAD,
                PAD + +3 + 2 * LINE_HEIGHT,
                PAD * -2 + frame.width,
                PAD * -1 + frame.height,
            );
        };
        const drawBase64Art = (base64: string, opacity = 1) => {
            const xTarget = PAD;
            const yTarget = PAD + +3 + 2 * LINE_HEIGHT;
            const wTarget = PAD * -1 + frame.width - (PAD);
            const hTarget = PAD * -1 + frame.height - (PAD + +3 + 2 * LINE_HEIGHT);

            if (!gameCache.images){ gameCache.images = {};}
            if (!gameCache.images[base64]){
                gameCache.images[base64] = loadAndScaleImage(sRaw, base64, [{ width: wTarget, height: hTarget }]);
            }
            const { isLoaded, imageScales } = gameCache.images[base64];
            const { image } = imageScales?.[0] ?? {};
            console.log(`drawBase64Art`, { isLoaded: isLoaded(), drawBase64Art, image });

            if (!image){ return;}

            const w = image.width;
            const h = image.height;
            const x = xTarget + Math.floor((wTarget - w) / 2);
            const y = yTarget + Math.floor((hTarget - h) / 2);

            // image.

            if (opacity < 1){
                s.tint(255, opacity * 255);
            } else {
                s.tint(255, 255);
                // s.noTint();
            }

            s.image(image,
                x,
                y,
                w,
                h,
            );

            // s.noTint();

            // if (opacity < 1){
            //     s.noStroke();
            //     s.fill(getBackgroundColor(opacity));
            //     s.rect(x, y, w, h);
            // }

            // lineCount += (PAD * 2 + h) / LINE_HEIGHT;
        };

        const drawArt = (art: undefined | GameArt, alwaysDraw: boolean) => {
            if (art?.ascii){
                if (!drawWaitMessage(5000, art.ascii, art.ascii, drawAsciiArtText, {
                    color: titleColor,
                    fontSize: FONT_SIZE_S,
                    alwaysDraw,
                }).done){
                    return { done: false };
                }
            }
            if (art?.base64){
                const FADE_CHAR_TIME = 2 * charsPerSecond;
                const DISPLAY_CHAR_TIME = 5 * charsPerSecond;

                const fadeInOpacity = charLength > FADE_CHAR_TIME ? 1 : (charLength / FADE_CHAR_TIME);
                charLength -= DISPLAY_CHAR_TIME;
                const fadeOutOpacity = charLength <= 0 ? 1 : (1.0 - 0.85 * Math.min(1, charLength / FADE_CHAR_TIME));

                const opacity = Math.min(fadeInOpacity, fadeOutOpacity);
                if (alwaysDraw || charLength < 0){
                    drawBase64Art(art.base64, opacity);
                }

                if (charLength < 0){
                    return { done: false };
                }
            }
        };


        const drawDescriptionText = (t: string) => {
            s.text(t,
                PAD,
                PAD + +3 + 2 * LINE_HEIGHT,
                PAD * -2 + frame.width,
                PAD * -6 + frame.height - (actionCount + 2) * LINE_HEIGHT,
            );
        };
        const drawActionsText = (t: string) => {
            console.log(t);
            s.text(t,
                PAD,
                PAD * -4 + frame.height - (actionCount + 2) * LINE_HEIGHT,
                PAD * -2 + frame.width,
                PAD * -3 + frame.height - 2 * LINE_HEIGHT,
            );
        };
        const drawActionInputText = (t: string) => {
            s.text(t,
                PAD,
                PAD * -2 + frame.height - 2 * LINE_HEIGHT,
                PAD * -2 + frame.width,
                PAD * -1 + frame.height,
            );
        };

        const drawNextPart = (text: string, drawText: (t: string) => void,
            options: { color: p5.Color, fontSize: number, speedMultiplier?: number },
        ) => {
            const {
                color,
                fontSize,
                speedMultiplier = 1,
            } = options;

            s.fill(color);
            s.textSize(fontSize);

            if (!text){
                return { done: true };
            }

            printText({ text, textLength: charLength * speedMultiplier, fontSize });

            if (charLength * speedMultiplier < text.length){
            // const t = text.substr(0, charLength * speedMultiplier);
            // drawText(t);
                return { done: false };
            }

            // printText({ text, textLength: charLength, fontSize });
            // drawText(text, charLength,);
            charLength -= Math.floor(text.length / speedMultiplier);

            return { done: true };
        };

        const drawWaitMessage = (timeMs: number,
            text?: string, altText?: string,
            drawText?: (t: string) => void,
            options?: { color?: p5.Color, fontSize?: number, alwaysDraw?: boolean },
        ) => {
            const {
                color,
                fontSize,
                alwaysDraw,
            } = options ?? {};

            const waitChars = timeMs / 1000 * charsPerSecond;
            const isWaiting = charLength < waitChars;
            if (alwaysDraw || isWaiting){
                const waitText = !text ? ``
                    : !altText ? text
                        : ((charLength / charsPerSecond * 1000) % 1000 < 500 ? text : altText);
                if (color){
                    s.fill(color);
                }
                if (fontSize){
                    s.textSize(fontSize);
                }
                if (waitText && drawText){
                    printText({ text: waitText, textLength: waitText.length, fontSize: FONT_SIZE_M });
                //drawText(waitText);
                }

                if (isWaiting){
                    return { done: false };
                }
            }

            charLength -= waitChars;
            return { done: true };
        };

        // const titleColor = s.color(
        //     255 - 60 + 30 * Math.sin((2 * Math.PI * (timeMs + 100) / 1000) / 3),
        //     255 - 60 + 30 * Math.sin((2 * Math.PI * (timeMs + 400) / 1000) / 3),
        //     255 - 60 + 30 * Math.sin((2 * Math.PI * (timeMs + 800) / 1000) / 3),
        // );

        // Use random glitch effect
        if (step.glitch && shouldGlitch){
            s.rotate(0.25 * random());
            s.scale(1 - 0.25 * random(), 1);
            s.background(s.color(0, 150 * random(), 0));

            if (randomSlow() > 0.25){
                s.fill(s.color(255, 255, 255));
                s.textAlign(`center`);
                s.textSize(10);
                const glitches = step.glitch.messages;
                s.text(glitches[Math.floor(random() * glitches.length) ],
                    PAD,
                    PAD + LINE_HEIGHT * 5,
                    PAD * -2 + frame.width,
                    PAD * -2 + frame.height,
                );
                return { done: false };
            }
        }

        if (mode !== `step`){
            charLength = Number.MAX_SAFE_INTEGER;
        }

        // Skip title typing
        charLength += step.title.trim().length;
        s.textAlign(`center`);
        const titleColor = s.color(255, 255, 255);
        if (!drawNextPart(step.title.trim(), drawTitleText, {
            color: titleColor,
            fontSize: FONT_SIZE_L,
        }).done){
            return { done: false };
        }

        drawArt(step.art, mode === `step`);

        s.textAlign(`left`);
        if (!drawNextPart(step.description.trim(), drawDescriptionText, {
            color: s.color(255, 255, 255),
            fontSize: FONT_SIZE_M,
        }).done){
            return { done: false };
        }
        if (!drawWaitMessage(1000).done){
            return { done: false };
        }

        const drawActionInputSection = (
            actions: GameStepAction[], actionIndex: undefined|number, actionInput: undefined|string,
        ) => {
            jumpToBottomLineOfScreen(1 + (1 + actions.length * FONT_SIZE_M * LINE_HEIGHT_MULTIPLIER / LINE_HEIGHT));

            const actionsText = `${actions.map(x => `    - ${x.name}`).join(`\n`)}`;
            if (!drawNextPart(actionsText, drawActionsText, {
                color: s.color(255, 255, 100),
                fontSize: FONT_SIZE_M,
            }).done){
                return { done: false };
            }

            // Blink
            const blinkTime = actionIndex != null ? 3000
                : actionInput ? 0
                    : Number.MAX_SAFE_INTEGER;
            if (!drawWaitMessage(blinkTime, `>`, `> |`, drawActionInputText, {
                color: s.color(100, 255, 100),
                fontSize: FONT_SIZE_M,
            }).done){
                return { done: false };
            }

            const action = actions[actionIndex ?? -1];
            const commandText = action?.name ?? actionInput?.trimEnd() ?? ``;
            if (!drawNextPart(`> ${commandText}`, drawActionInputText, {
                color: s.color(100, 255, 100),
                fontSize: FONT_SIZE_M,
            }).done){
                return { done: false };
            }

            return { done: true };
        };

        if (!drawActionInputSection(step.actions, actionIndex, input).done){
            return { done: false };
        }

        if (mode === `step`){
            if (!drawWaitMessage(1000).done){
                return { done: false };
            }
        }

        const action = step.actions[actionIndex ?? -1];
        if (mode === `response` && action){
            charLength = Math.floor(timeMs / 1000 * charsPerSecond);
            clearScreen();

            const actionResponse = action.description;
            const gameOver = action.result?.gameOver ?? false;
            const actionColor = s.color(255, 255, 0);
            const responseColor = gameOver ? s.color(255, 100, 100) : s.color(100, 100, 255);
            if (!drawNextPart(actionResponse.trim(), drawDescriptionText, {
                color: actionColor,
                fontSize: FONT_SIZE_M,
            }).done){
                return { done: false };
            }

            const waitTime = actionResponse.trim() ? 3000 : 500;
            if (!drawWaitMessage(waitTime).done){
                return { done: false };
            }

            if (action.result?.gameOver == null){
                s.textAlign(`center`);
                if (!drawNextPart(`TO BE CONTINUED`, drawActionInputText, {
                    color: responseColor,
                    fontSize: FONT_SIZE_L,
                }).done){
                    return { done: false };
                }

                s.textAlign(`left`);
                if (!drawActionInputSection(gameOverActions.map(x => ({ name: x, description: `` })), undefined, input).done){
                    return { done: false };
                }
            }

            if (gameOver){
            // clearScreen();

                const gameOverArt = action.result?.art;
                if (gameOverArt){
                    drawArt(gameOverArt, true);
                }

                if (!drawNextPart(gameOver.trim(), drawDescriptionText, {
                    color: responseColor,
                    fontSize: FONT_SIZE_M,
                }).done){
                    return { done: false };
                }

                if (!drawWaitMessage(1000).done){
                    return { done: false };
                }

                s.textAlign(`center`);
                if (!drawNextPart(`GAME OVER`, drawActionInputText, {
                    color: responseColor,
                    fontSize: FONT_SIZE_L,
                }).done){
                    return { done: false };
                }

                s.textAlign(`left`);
                if (!drawActionInputSection(gameOverActions.map(x => ({ name: x, description: `` })), undefined, input).done){
                    return { done: false };
                }
            }

        }


        return { done: true };
    };

    const result = inner();

    // Scroll up
    const lineCount_final = lineCount;
    const lineBottom = (lineCount_final) * LINE_HEIGHT;
    if (lineBottom > frame.height){
        const translateY = lineBottom - frame.height;
        sRaw.translate(0, -translateY);
    }
    sQueue.forEach(s => s.callback());

    return result;
};

const gameOverActions = [`retry`, `restart`] as const;
type GameOverAction = typeof gameOverActions[number];

export type GameState = {
    timeStartMs?: number;
    stepIndex?: number;
    actionIndex?: number;
    input: string;
    mode: 'step' | 'response';
};
export const drawGame = ({
    gameState,
    gameData,
    gameCache,
    s,
    frame,
    seed,
    timeMs,
}: {
    gameState: GameState;
    gameData: GameData;
    gameCache: GameCache;
    s: p5;
    frame: { width: number, height: number };
    seed: string;
    timeMs: number;
}): { done: boolean, gameState: GameState } => {


    if (gameState.input){
        gameState.timeStartMs = 1;
        // gameState.actionIndex = undefined;
    }

    const {
        stepIndex = 0,
        actionIndex,
        input = ``,
        mode,
    } = gameState;

    const step = gameData.story[stepIndex || 0] ?? undefined;

    if (!step){
        return {
            done: true,
            gameState,
        };
    }

    const result = drawGameStep({
        step, gameCache, actionIndex, s,
        timeMs, frame, seed, input, mode,
    });

    if (input.endsWith(`\n`) && input.trim()){
        const words = input.trim().split(` `).filter(x => x);

        if (mode === `step`){
            const i = step.actions.findIndex(x => x.name.split(` `).some(n => words.some(w => w === n)));

            if (i >= 0){
                return {
                    done: false,
                    gameState: {
                        ...gameState,
                        input: ``,
                        actionIndex: i,
                        mode: `response`,
                        timeStartMs: undefined,
                    },
                };
            }

            return {
                done: false,
                gameState: {
                    ...gameState,
                    input: ``,
                },
            };
        }
    }

    if (gameState.mode === `response` && result.done){

        const isGameOver = step.actions[gameState.actionIndex ?? -1]?.result?.gameOver ?? true;
        if (isGameOver){

            // Start over
            if (input === `restart\n`){
                return {
                    done: false,
                    gameState: {
                        ...gameState,
                        mode: `step`,
                        stepIndex: 0,
                        actionIndex: undefined,
                        timeStartMs: undefined,
                        input: ``,
                    },
                };
            }
            if (input === `retry\n`){
                return {
                    done: false,
                    gameState: {
                        ...gameState,
                        mode: `step`,
                        actionIndex: undefined,
                        timeStartMs: undefined,
                        input: ``,
                    },
                };
            }
            if (input.endsWith(`\n`)){
                return {
                    done: false,
                    gameState: {
                        ...gameState,
                        input: ``,
                    },
                };
            }

            return {
                done: true,
                gameState,
            };
        }

        return {
            done: false,
            gameState: {
                ...gameState,
                mode: `step`,
                stepIndex: stepIndex + 1,
                actionIndex: undefined,
                timeStartMs: undefined,
            },
        };
    }

    return {
        ...result,
        gameState,
    };
};
