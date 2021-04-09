import { Config } from './config';
import { ga } from './ga';
import { isMobile, randomIntRange } from './utils';

type DatGui = {
    add: (configObject: unknown, key: string, options?: (number | { [key: string]: number }), options2?: number) => {
        name: (value: string) => {
            onFinishChange: (callback: () => void) => void;
            listen: () => void;
            step: (count: number) => void;
            __li: {
                className: string;
                style: HTMLDivElement['style'];
            };
            domElement: HTMLDivElement;
        };
    };
    addFolder: (name: string) => DatGui;
    addColor: (configObject: unknown, key: string) => {
        name: (value: string) => void;
    };
    close: () => void;
};
declare let dat: {
    GUI: {
        new(...args: unknown[]): DatGui;
    };
};

export function startGUI({
    config,
    splatStack,
    initFramebuffers,
    updateKeywords,
    captureScreenshot,
}: {
    config: Config;
    splatStack: number[];
    initFramebuffers: () => void;
    updateKeywords: () => void;
    captureScreenshot: () => void;
}) {
    if (typeof (dat) === `undefined`) { return; }

    const gui = new dat.GUI({ width: 300 });
    gui.add(config, `DYE_RESOLUTION`, { 'high': 1024, 'medium': 512, 'low': 256, 'very low': 128 }).name(`quality`).onFinishChange(initFramebuffers);
    gui.add(config, `SIM_RESOLUTION`, { '32': 32, '64': 64, '128': 128, '256': 256 }).name(`sim resolution`).onFinishChange(initFramebuffers);
    gui.add(config, `DENSITY_DISSIPATION`, 0, 4).name(`density diffusion`);
    gui.add(config, `VELOCITY_DISSIPATION`, 0, 4).name(`velocity diffusion`);
    gui.add(config, `PRESSURE`, 0, 1).name(`pressure`);
    gui.add(config, `CURL`, 0, 50).name(`vorticity`).step(1);
    gui.add(config, `SPLAT_RADIUS`, 0.01, 1).name(`splat radius`);
    gui.add(config, `SHADING`).name(`shading`).onFinishChange(updateKeywords);
    gui.add(config, `COLORFUL`).name(`colorful`);
    gui.add(config, `PAUSED`).name(`paused`).listen();

    gui.add({
        fun: () => {
            splatStack.push(randomIntRange(5, 25));
        },
    }, `fun`).name(`Random splats`);

    const bloomFolder = gui.addFolder(`Bloom`);
    bloomFolder.add(config, `BLOOM`).name(`enabled`).onFinishChange(updateKeywords);
    bloomFolder.add(config, `BLOOM_INTENSITY`, 0.1, 2).name(`intensity`);
    bloomFolder.add(config, `BLOOM_THRESHOLD`, 0, 1).name(`threshold`);

    const sunraysFolder = gui.addFolder(`Sunrays`);
    sunraysFolder.add(config, `SUNRAYS`).name(`enabled`).onFinishChange(updateKeywords);
    sunraysFolder.add(config, `SUNRAYS_WEIGHT`, 0.3, 1).name(`weight`);

    const captureFolder = gui.addFolder(`Capture`);
    captureFolder.addColor(config, `BACK_COLOR`).name(`background color`);
    captureFolder.add(config, `TRANSPARENT`).name(`transparent`);
    captureFolder.add({ fun: captureScreenshot }, `fun`).name(`take screenshot`);

    const github = gui.add({
        fun: () => {
            window.open(`https://github.com/PavelDoGreat/WebGL-Fluid-Simulation`);
            ga(`send`, `event`, `link button`, `github`);
        },
    }, `fun`).name(`Github`);
    github.__li.className = `cr function bigFont`;
    github.__li.style.borderLeft = `3px solid #8C8C8C`;
    const githubIcon = document.createElement(`span`);
    github.domElement.parentElement?.append(githubIcon);
    githubIcon.className = `icon github`;

    const twitter = gui.add({
        fun: () => {
            ga(`send`, `event`, `link button`, `twitter`);
            window.open(`https://twitter.com/PavelDoGreat`);
        },
    }, `fun`).name(`Twitter`);
    twitter.__li.className = `cr function bigFont`;
    twitter.__li.style.borderLeft = `3px solid #8C8C8C`;
    const twitterIcon = document.createElement(`span`);
    twitter.domElement.parentElement?.append(twitterIcon);
    twitterIcon.className = `icon twitter`;

    const discord = gui.add({
        fun: () => {
            ga(`send`, `event`, `link button`, `discord`);
            window.open(`https://discordapp.com/invite/CeqZDDE`);
        },
    }, `fun`).name(`Discord`);
    discord.__li.className = `cr function bigFont`;
    discord.__li.style.borderLeft = `3px solid #8C8C8C`;
    const discordIcon = document.createElement(`span`);
    discord.domElement.parentElement?.append(discordIcon);
    discordIcon.className = `icon discord`;

    const app = gui.add({
        fun: () => {
            ga(`send`, `event`, `link button`, `app`);
            window.open(`http://onelink.to/5b58bn`);
        },
    }, `fun`).name(`Check out mobile app`);
    app.__li.className = `cr function appBigFont`;
    app.__li.style.borderLeft = `3px solid #00FF7F`;
    const appIcon = document.createElement(`span`);
    app.domElement.parentElement?.append(appIcon);
    appIcon.className = `icon app`;

    if (isMobile())
        gui.close();
}
