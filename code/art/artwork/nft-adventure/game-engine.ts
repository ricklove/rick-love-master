import { createRandomGenerator } from 'art/rando';
import type p5 from 'p5';

type GameStep = {
    title: string;
    asciiArt?: string;
    description: string;
    glitch?: {
        ratio: number;
        messages: string[];
    };
    inventory: string[];
    actions: {
        name: string;
        description: string;
        gameOver?: string | false;
    }[];
};
type GameItem = {
    key: string;
    description: string;
};
type GameData = {
    story: GameStep[];
    items: readonly GameItem [];
};
export const drawGameStep = ({
    step,
    actionIndex,
    s,
    timeMs: timeMsRaw,
    frame,
    seed,
    input,
    mode,
}: {
    step: GameStep;
    actionIndex?: number;
    s: p5;
    timeMs: number;
    frame: { width: number, height: number };
    seed: string;
    input: string;
    mode: 'step' | 'response';
}): { done: boolean } => {

    if (!step){ return { done: true };}

    const timeMs = timeMsRaw;

    const { random: randomSlow } = createRandomGenerator(`${seed}${step}${Math.floor(timeMs / 250)}`);
    const { random: random } = createRandomGenerator(`${seed}${step}${Math.floor(timeMs / 50)}`);
    const shouldGlitch = step.glitch && randomSlow() > (1.0 - step.glitch.ratio);

    const charsPerSecond = 30;
    let charLength = Math.floor(timeMs / 1000 * charsPerSecond);

    s.background(s.color(25 - 25 * Math.cos((2 * Math.PI * timeMs / 1000) / 10), 0, 0));
    // s.background(0);
    s.fill(s.color(255, 255, 255));
    s.textFont(`monospace`);
    s.textAlign(`left`);
    s.textSize(14);

    const LINE = 20;
    const PAD = 4;
    const actionCount = step.actions.length;

    const drawTitleText = (t: string) => {
        s.text(t,
            PAD,
            PAD * +1 + 0 * LINE,
            PAD * -2 + frame.width,
            PAD * +1 + 2 * LINE,
        );
    };
    const drawAsciiArtText = (t: string) => {
        s.text(t,
            PAD,
            PAD + +3 + 2 * LINE,
            PAD * -2 + frame.width,
            PAD * -1 + frame.height,
        );
    };
    const drawDescriptionText = (t: string) => {
        s.text(t,
            PAD,
            PAD + +3 + 2 * LINE,
            PAD * -2 + frame.width,
            PAD * -6 + frame.height - (actionCount + 2) * LINE,
        );
    };
    const drawActionsText = (t: string) => {
        s.text(t,
            PAD,
            PAD * -4 + frame.height - (actionCount + 2) * LINE,
            PAD * -2 + frame.width,
            PAD * -3 + frame.height - 2 * LINE,
        );
    };
    const drawActionInputText = (t: string) => {
        s.text(t,
            PAD,
            PAD * -2 + frame.height - 2 * LINE,
            PAD * -2 + frame.width,
            PAD * -1 + frame.height,
        );
    };

    const drawNextPart = (text: string, drawText: (t: string) => void, color: p5.Color, fontSize: number, speedMultiplier = 1) => {
        s.fill(color);
        s.textSize(fontSize);

        if (charLength * speedMultiplier < text.length){
            const t = text.substr(0, charLength * speedMultiplier);
            drawText(t);
            return { done: false };
        }

        drawText(text);
        charLength -= Math.floor(text.length / speedMultiplier);

        return { done: true };
    };

    const drawWaitMessage = (timeMs: number,
        text?: string, altText?: string,
        drawText?: (t: string) => void, color?: p5.Color, fontSize?: number,
    ) => {
        const waitChars = timeMs / 1000 * charsPerSecond;
        if (charLength < waitChars){
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
                drawText(waitText);
            }
            return { done: false };
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
            s.textSize(12);
            const glitches = step.glitch.messages;
            s.text(glitches[Math.floor(random() * glitches.length) ],
                PAD,
                PAD + LINE * 5,
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
    if (!drawNextPart(step.title.trim(), drawTitleText, titleColor, 14).done){
        return { done: false };
    }

    if (!drawWaitMessage(5000, step.asciiArt, step.asciiArt, drawAsciiArtText, titleColor, 10).done){
        return { done: false };
    }

    s.textAlign(`left`);
    if (!drawNextPart(step.description.trim(), drawDescriptionText, s.color(255, 255, 255), 12).done){
        return { done: false };
    }
    if (!drawWaitMessage(1000).done){
        return { done: false };
    }

    const actionsText = `${step.actions.map(x => `    - ${x.name}\n`).join(``)}`;
    if (!drawNextPart(actionsText, drawActionsText, s.color(255, 255, 100), 12).done){
        return { done: false };
    }

    // Blink
    if (!drawWaitMessage(3000, `>`, `> |`, drawActionInputText, s.color(100, 255, 100), 12).done){
        return { done: false };
    }

    const action = step.actions[actionIndex ?? -1];
    const actionName = action?.name ?? input ?? ``;
    if (!drawNextPart(`> ${actionName}`, drawActionInputText, s.color(100, 255, 100), 14).done){
        return { done: false };
    }

    if (!drawWaitMessage(1000).done){
        return { done: false };
    }

    if (mode === `response` && action){
        charLength = Math.floor(timeMs / 1000 * charsPerSecond);

        s.background(s.color(25 - 25 * Math.cos((2 * Math.PI * timeMs / 1000) / 10), 0, 0));

        const actionResponse = action.description;
        const gameOver = action.gameOver ?? false;
        const actionColor = gameOver ? s.color(255, 100, 100) : s.color(100, 100, 255);
        if (!drawNextPart(actionResponse, drawDescriptionText, actionColor, 14).done){
            return { done: false };
        }

        if (!drawWaitMessage(1000).done){
            return { done: false };
        }

        if (action.gameOver == null){
            s.textAlign(`center`);
            if (!drawNextPart(`TO BE CONTINUED`, drawActionInputText, actionColor, 14).done){
                return { done: true };
            }
        }

        if (gameOver){
            s.background(s.color(25 - 25 * Math.cos((2 * Math.PI * timeMs / 1000) / 10), 0, 0));

            if (!drawNextPart(gameOver, drawDescriptionText, actionColor, 14).done){
                return { done: false };
            }

            if (!drawWaitMessage(1000).done){
                return { done: false };
            }

            s.textAlign(`center`);
            if (!drawNextPart(`GAME OVER`, drawActionInputText, actionColor, 14).done){
                return { done: true };
            }
        }
    }


    return { done: true };
};

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
    s,
    frame,
    seed,
    timeMs,
}: {
    gameState: GameState;
    gameData: GameData;
    s: p5;
    frame: { width: number, height: number };
    seed: string;
    timeMs: number;
}): { done: boolean, gameState: GameState } => {


    if (gameState.mode === `step` && gameState.input){
        gameState.timeStartMs = 1;
        gameState.actionIndex = undefined;
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
        step, actionIndex, s,
        timeMs, frame, seed, input, mode,
    });

    if (input.endsWith(`\n`) && input.trim()){
        const words = input.trim().split(` `).filter(x => x);
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
        } else {
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

        const isGameOver = step.actions[gameState.actionIndex ?? -1]?.gameOver ?? true;
        if (isGameOver){

            // Start over
            if (input){
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