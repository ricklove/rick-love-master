import { NetworkIdentifier } from "../types";

export type GamePlayerInfo = { networkIdentifier: NetworkIdentifier, playerName: string, entity: IEntity };
export type GameConsequenceType = {
    onCorrect: (player: GamePlayerInfo) => void,
    onWrong: (player: GamePlayerInfo) => void,
};

export const createGameConsequences = (system: IVanillaServerSystem): GameConsequenceType => {
    return {
        onCorrect: (player) => {
            // TODO: Reward player
        },
        onWrong: (player) => {
            // Player Consequence
            const pos = system.getComponent(player.entity, MinecraftComponent.Position);
            if (!pos) { return; }

            // Hit player with lightning
            // system.executeCommand(`/summon lightning_bolt ${pos.data.x + 1} ${pos.data.y + 0} ${pos.data.z + 1}`, () => { });
            // system.executeCommand(`/summon lightning_bolt ${pos.data.x + 1} ${pos.data.y + 0} ${pos.data.z - 1}`, () => { });
            // system.executeCommand(`/summon lightning_bolt ${pos.data.x - 1} ${pos.data.y + 0} ${pos.data.z + 1}`, () => { });
            // system.executeCommand(`/summon lightning_bolt ${pos.data.x - 1} ${pos.data.y + 0} ${pos.data.z - 1}`, () => { });

            // Hit bedrock with lightning (not player - just for sound and light)
            const y = pos.data.y > 16 ? 0 : 256;
            system.executeCommand(`/summon lightning_bolt ${pos.data.x + 1} ${y} ${pos.data.z + 1}`, () => { });
            system.executeCommand(`/summon lightning_bolt ${pos.data.x + 1} ${y} ${pos.data.z - 1}`, () => { });
            system.executeCommand(`/summon lightning_bolt ${pos.data.x - 1} ${y} ${pos.data.z + 1}`, () => { });
            system.executeCommand(`/summon lightning_bolt ${pos.data.x - 1} ${y} ${pos.data.z - 1}`, () => { });

            // Random effect
            const badEffects = [
                { name: `blindness`, maxTime: 10, maxLevel: 255 },
                { name: `hunger`, maxTime: 20, maxLevel: 4 },
                { name: `nausea`, maxTime: 20, maxLevel: 255 },
                { name: `poison`, maxTime: 5, maxLevel: 1 },
                { name: `slowness`, maxTime: 20, maxLevel: 3 },
                // { name: `weakness`, maxTime: 20, maxLevel: 1 },
            ];

            const effect = badEffects[Math.floor(badEffects.length * Math.random())];
            const effectLevel = Math.ceil(effect.maxLevel * Math.random());
            const effectTime = Math.ceil(effect.maxTime * (0.5 + 0.5 * Math.random()));
            system.executeCommand(`/effect ${player.playerName} ${effect.name} ${effectTime} ${effectLevel}`, () => { });
        },
    };
};