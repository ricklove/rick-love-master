import { createSubscribable } from 'utils/subscribable';
import { toMap } from 'utils/objects';
import { buildEmojiSkillTree } from './emoji-skills/emoji-skill-tree';

export type EmojiIdleEmotionKind = 'excited' | 'happy' | 'normal' | 'angry' | 'sick' | 'dead';
export type EmojiIdleState = {
    characterEmoji: string;
    targetEmoji?: string;
    targetOptions?: { emoji: string }[];
    requirementsPurchased?: string[];
    requirementsAvailable?: { emoji: string, cost: number }[];
    requirementsRemaining?: { emoji: string, cost: number }[];
    requirementsNeeded?: { emoji: string, cost: number }[];
    lastPurchaseTimestamp: number;

    emotion: EmojiIdleEmotionKind;
    lastEmotionTimestamp: number;

    money: number;

    multiplier: number;
    lastMultipleDecreaseTimestamp: number;

};

const storageKey = `EmojiIdleState`;
const storage = {
    save: (value: EmojiIdleState) => { localStorage.setItem(storageKey, JSON.stringify(value)); },
    load: () => {
        if (!localStorage.getItem(storageKey)) { return null; }
        try {
            return JSON.parse(localStorage.getItem(storageKey) ?? ``);
        } catch{
            return null;
        }
    },
};

const createService = () => {
    const skillTree = buildEmojiSkillTree();
    const reqMap = toMap(skillTree.allRequirements.map(x => ({ key: x.emoji, value: x })));

    const defaultState: EmojiIdleState = {
        characterEmoji: skillTree.root.emoji,
        emotion: `happy`,
        lastEmotionTimestamp: Date.now(),
        money: 0,
        multiplier: 1,
        lastMultipleDecreaseTimestamp: Date.now(),
        lastPurchaseTimestamp: Date.now(),
    };
    let s: EmojiIdleState = storage.load() ?? defaultState;

    const sub = createSubscribable<EmojiIdleState>(s);

    const changeState = (partialState: Partial<EmojiIdleState>) => {
        // console.log(`changePetState`, { partialState, before: { ...s } });
        s = { ...s, ...partialState };
        sub.onStateChange(s);
        storage.save(s);
    };

    const rewardInner = (value: number) => {
        changeState({
            money: s.money + s.multiplier,
            multiplier: s.multiplier + value,
            lastMultipleDecreaseTimestamp: Date.now(),
        });
    };

    const punish = () => {
        changeState({
            multiplier: Math.max(1, s.multiplier - 10),
            lastMultipleDecreaseTimestamp: Date.now(),
        });
    };

    const selectOption = (emoji: string) => {
        // console.log(`selectOption`, { emoji });

        // Choose character
        if (s.targetOptions?.find(x => x.emoji === emoji)) {
            changeState({
                targetEmoji: emoji,
                targetOptions: undefined,
                emotion: `excited`,
                lastEmotionTimestamp: Date.now(),
                lastPurchaseTimestamp: Date.now(),
            });
        }

        // Purchases
        const r = s.requirementsAvailable?.find(x => x.emoji === emoji);
        if (r && r.cost <= s.money) {
            // Purchase 
            changeState({
                requirementsPurchased: [...s.requirementsPurchased ?? [], r.emoji],
                requirementsRemaining: undefined,
                money: s.money - r.cost,
                requirementsAvailable: undefined,
                emotion: `excited`,
                lastEmotionTimestamp: Date.now(),
                lastPurchaseTimestamp: Date.now(),
            });
        }

        // Ignore
    };

    // Update state
    setInterval(() => {
        const second = 1000;
        const minute = 60 * second;
        const hour = 60 * minute;

        // console.log(`emoji-idle-service update`, {});

        // Decrease Multiplier over time
        const decTime = 3 * second;
        if (s.multiplier > 1 && Date.now() > s.lastMultipleDecreaseTimestamp + decTime) {
            const timeDelta = Date.now() - s.lastMultipleDecreaseTimestamp;
            const multChange = Math.floor(timeDelta / decTime);

            // console.log(`emoji-idle-service`, { timeDelta, multChange });
            changeState({
                multiplier: Math.max(1, s.multiplier - multChange),
                lastMultipleDecreaseTimestamp: Date.now(),
            });
        }

        // Choose target
        if (!s.targetEmoji && !s.targetOptions) {
            const skillNode = skillTree.allNodes.find(x => x.emoji === s.characterEmoji);
            if (skillNode) {
                const t = skillNode.children.map(x => ({ emoji: x.emoji }));
                if (t.length === 1) {
                    // Auto select
                    changeState({
                        targetEmoji: t[0].emoji,
                    });
                } else {
                    changeState({
                        targetOptions: t,
                    });
                }
            }
        }

        // Populate Available Requirements
        if (s.targetEmoji) {
            const targetSkillNode = skillTree.allNodes.find(x => x.emoji === s.targetEmoji);
            if (targetSkillNode) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const reqs = targetSkillNode.requirementEmojis.map(x => reqMap.get(x)).filter(x => x).map(x => x!);
                const reqs_remaining = reqs.filter(x => !s.requirementsPurchased?.includes(x.emoji));
                reqs_remaining.sort((a, b) => a.cost - b.cost);
                const reqs_available = reqs_remaining.filter(x => x.cost <= s.money);

                if (reqs_available.length !== s.requirementsAvailable?.length) {
                    changeState({
                        requirementsNeeded: reqs,
                        requirementsAvailable: reqs_available,
                    });
                }

                if (reqs_remaining.length !== s.requirementsRemaining?.length) {
                    changeState({
                        requirementsRemaining: reqs_remaining,
                    });
                }

                // Target completed
                if (reqs_remaining.length <= 0) {
                    changeState({
                        characterEmoji: s.targetEmoji,
                        targetEmoji: undefined,
                        targetOptions: undefined,
                        requirementsAvailable: undefined,
                        requirementsNeeded: undefined,
                        requirementsPurchased: undefined,
                    });
                }
            }

            // Emotion
            if (Date.now() > (s.lastEmotionTimestamp ?? 0) + 15 * second) {
                // TODO: Sickness
                const emotion = Date.now() > (s.lastPurchaseTimestamp ?? 0) + 5 * minute ? `angry`
                    : `normal`;

                if (s.emotion !== emotion) {
                    changeState({ emotion, lastEmotionTimestamp: Date.now() });
                }
            }
        }

    }, 1000);

    return {
        subscribePetStateChange: sub.subscribe,
        reward: () => rewardInner(1),
        reward_major: () => rewardInner(10),
        reward_extreme: () => rewardInner(100),
        punish,

        selectOption,
    };
};

export type EmojiIdleService = ReturnType<typeof createService>;

const serviceState = {
    instance: null as null | EmojiIdleService,
};
export const EmojiIdleService = {
    get: () => {
        // eslint-disable-next-line no-return-assign
        return serviceState.instance ?? (serviceState.instance = createService());
    },
};
