import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { shuffle } from 'utils/arrays';
import { EmojiIdleService, EmojiIdleState, EmojiIdleEmotionKind } from './emoji-idle-service';
import { buildEmojiSkillTree } from './emoji-skills/emoji-skill-tree';

export const styles = {
    container: {
        height: 40,
    },
    fixed: {
        position: `fixed`,
        top: 0, right: 0, left: 0,
        zIndex: 1000,
    },
    inner: {
        position: `relative`,
        height: 40,
    },
    emotionEmoji: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 24,
    },
    characterEmoji: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 24,
    },
    characterEmoji_small: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 16,
    },
    costText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 16,
        color: `#00FF00`,
    },
    costText_small: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 10,
        color: `#00FF00`,
    },
    targetCharacterEmoji: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 16,
    },
    objectEmoji: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 12,
    },

    money: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 20,
        color: `#FFFF00`,
        marginLeft: 8,
    },
    money_small: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 16,
        color: `#FFFF00`,
    },
    multiplier: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 14,
        color: `#FF00FF`,
        marginLeft: 8,
    },
    foodText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 12,
        color: `#333300`,
    },
} as const;

export const EmojiIdleView = (props: {}) => {
    const [gameState, setGameState] = useState(null as null | EmojiIdleState);
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(() => {
        const service = EmojiIdleService.get();
        const sub = service.subscribePetStateChange(setGameState);
        return () => sub.unsubscribe();
    });

    if (isExpanded && gameState) {
        return (
            <TownView gameState={gameState} onClose={() => setIsExpanded(false)} />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.fixed}>
                <View style={styles.inner}>
                    <EmojiCharacterView
                        emoji={gameState?.characterEmoji ?? ``}
                        targetEmoji={gameState?.targetEmoji ?? ``}
                        emotion={gameState?.emotion ?? null}
                        purchased={gameState?.requirementsPurchased ?? []}
                        onPress={() => setIsExpanded(s => !s)}
                    />
                    {gameState && <CommandsView gameState={gameState} />}
                    {/* {gameState && gameState.food > 0 && [...new Array(gameState.food)].map((x, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <View key={`${i}`} style={{ position: `absolute`, transform: `translate(${100 + i * 87 % 100}px,${4 + i * 43 % 12}px)` }} >
                            <Text style={styles.foodText}>{getFoodVariant(i)}</Text>
                        </View>
                    ))} */}
                </View>
            </View>
        </View>
    );
};

export const townStyles = {
    container: {
        background: `#555555`,
    },
    payText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 14,
        color: `#FFFFFF`,
    },
    payText_disabled: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 14,
        color: `#CCCCCC`,
    },
    moneyText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 16,
        color: `#FFFF00`,
    },
    townMoneyText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 16,
        color: `#00FF00`,
    },
} as const;

const skillTree = buildEmojiSkillTree();
const TownView = ({ gameState, onClose }: { gameState: EmojiIdleState, onClose: () => void }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const townPersons = gameState.townState.characters.map(x => ({
        character: x,
        skill: skillTree.allNodes.find(n => n.emoji === x.characterEmoji) ?? skillTree.root,
    }))
        .filter(x => x.skill.pay)
        .map(x => ({
            ...x,
            years: (Date.now() - x.character.finishedTimestamp) / (24 * 60 * 60 * 1000),
            money: Math.floor((Date.now() - x.character.finishedTimestamp) / (24 * 60 * 60 * 1000) * x.skill.pay),
        }));
    const missingSkills = skillTree.allNodes.filter(x => x.children.length <= 0 && !gameState.townState.characters.find(t => t.characterEmoji === x.emoji));
    // eslint-disable-next-line unicorn/no-reduce
    const townMoney = townPersons.reduce((out, x) => { out += x.money ?? 0; return out; }, 0);
    return (
        <View style={townStyles.container}>
            <View>
                <View style={{ background: `#333333`, flexDirection: `row`, alignItems: `center` }}>
                    <View style={{ position: `relative`, width: 100, height: 40 }}>
                        <View style={{ position: `absolute`, left: 0, top: 0, flexDirection: `column`, alignItems: `flex-end` }} >
                            <TouchableOpacity onPress={() => onClose()}>
                                <Text style={styles.characterEmoji}>{` 🏙 `}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 1 }} />
                    <View style={{ padding: 4 }}>
                        <Text style={townStyles.townMoneyText}>{`$${(townMoney).toLocaleString()}`}</Text>
                    </View>
                </View>
            </View>
            <View style={{ background: `#333333`, flexDirection: `row`, alignItems: `center` }}>
                <View style={{ position: `relative`, width: 100, height: 40 }}>
                    <EmojiCharacterView
                        emoji={gameState?.characterEmoji ?? ``}
                        targetEmoji={gameState?.targetEmoji ?? ``}
                        emotion={gameState?.emotion ?? null}
                        purchased={gameState?.requirementsPurchased ?? []}
                        onPress={() => onClose()}
                    />
                </View>
            </View>
            {/* Finished Characters */}
            {townPersons.map(x => (
                <View style={{ background: `#333333`, flexDirection: `row`, alignItems: `center` }}>
                    <View style={{ position: `relative`, width: 100, height: 40 }}>
                        <EmojiCharacterView
                            emoji={x.character.characterEmoji}
                            targetEmoji=''
                            emotion='happy'
                            purchased={x.skill?.requirementEmojis ?? []}
                        />
                    </View>
                    <View style={{ padding: 4 }}>
                        <Text style={townStyles.payText}>{`$${(x.skill?.pay ?? 0).toLocaleString()}`}</Text>
                    </View>
                    <View style={{ padding: 4 }}>
                        <Text style={townStyles.payText}>{`x${(x.years).toFixed(1)}`}</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <View style={{ padding: 4 }}>
                        <Text style={townStyles.moneyText}>{`$${(x.money).toLocaleString()}`}</Text>
                    </View>
                </View>
            ))}
            {/* Missing Characters */}
            {missingSkills.map(x => (
                <View style={{ background: `#555555`, flexDirection: `row`, alignItems: `center` }}>
                    <View style={{ position: `relative`, width: 100, height: 40, opacity: 0.5 }}>
                        <EmojiCharacterView
                            emoji={x.emoji}
                            targetEmoji=''
                            emotion={null}
                            purchased={[]}
                        />
                    </View>
                    <View style={{ padding: 4 }}>
                        <Text style={townStyles.payText_disabled}>{`$${(x.pay).toLocaleString()}`}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

const CommandsView = ({ gameState }: { gameState: EmojiIdleState }) => {

    const [offset, setOffset] = useState(0);
    useEffect(() => {
        setOffset(0);
    }, [gameState.targetOptions, gameState.requirementsAvailable]);

    if (gameState.targetOptions && gameState.targetOptions.length > 0) {
        const listSize = 4;
        const targetOptionsLength = gameState.targetOptions.length;
        return (
            <View style={{ position: `absolute`, top: 0, left: 0, right: 0 }} >
                <View style={{ flexDirection: `row`, justifyContent: `center` }}>
                    {gameState.targetOptions.slice(offset, offset + listSize).map(x => (
                        <TouchableOpacity key={x.emoji} onPress={() => EmojiIdleService.get().selectOption(x.emoji)}>
                            <View>
                                <Text style={styles.characterEmoji}>{x.emoji}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {targetOptionsLength > listSize && (
                        <TouchableOpacity onPress={() => setOffset(s => { const i = s + 5; return i >= targetOptionsLength ? 0 : i; })}>
                            <View>
                                <Text style={styles.characterEmoji}>{offset + listSize < targetOptionsLength ? `⏩` : `⏮`}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }

    // if (gameState.requirementsAvailable && gameState.requirementsAvailable.length > 0) {
    //     return (
    //         <View style={{ position: `absolute`, top: 0, left: 0, right: 0 }} >
    //             <View style={{ alignSelf: `center`, alignItems: `center`, background: `#222222`, borderRadius: 4, padding: 4 }}>
    //                 <View style={{ flexDirection: `row`, justifyContent: `center` }}>
    //                     {gameState.requirementsAvailable.slice(0, 5).map(x => (
    //                         <TouchableOpacity key={x.emoji} onPress={() => EmojiIdleService.get().selectOption(x.emoji)}>
    //                             <View style={{ flexDirection: `column`, margin: 4, alignItems: `center`, background: `#333333`, borderRadius: 4 }}>
    //                                 <Text style={styles.characterEmoji}>{x.emoji}</Text>
    //                                 <Text style={styles.costText}>{`$${x.cost.toLocaleString()}`}</Text>
    //                             </View>
    //                         </TouchableOpacity>
    //                     ))}
    //                 </View>
    //                 <Text style={styles.money_small}>{`$${(gameState.money ?? 0).toLocaleString()}`}</Text>
    //             </View>
    //         </View>
    //     );
    // }

    const reqs = gameState.requirementsRemaining ?? [];
    const reqShowLength = 3;
    return (
        <View>
            <ScoreView {...gameState ?? { money: 0, multiplier: 1 }} />
            <View style={{ position: `absolute`, left: 90, top: 0, flexDirection: `row`, zIndex: 10 }} >
                {reqs.slice(0, reqShowLength).map(x => {
                    const canBuy = x.cost <= gameState.money;
                    return (
                        <TouchableOpacity key={x.emoji} onPress={() => EmojiIdleService.get().selectOption(x.emoji)}>
                            <View style={{ flexDirection: `column`, alignItems: `center`, background: canBuy ? `#003300` : `#553300`, borderRadius: 4, paddingLeft: 2, paddingRight: 2 }}>
                                <Text style={styles.characterEmoji_small}>{x.emoji}</Text>
                                <Text style={{ ...styles.costText_small, ...(canBuy ? {} : { color: `#FF0000` }) }}>{`$${x.cost.toLocaleString()}`}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};


const ScoreView = ({ money, multiplier }: { money: number, multiplier: number }) => {

    const [moneySizeOffset, setMoneySizeOffset] = useState(0);
    const [multiplierSizeOffset, setMultiplierSizeOffset] = useState(0);
    const lastMultiplier = useRef(multiplier);
    const [multiplierDelta, setMultiplierDelta] = useState(0);


    useEffect(() => {
        setMoneySizeOffset(5);

        const update = () => {
            setMoneySizeOffset(s => {
                if (s > 0) {
                    return s - 1;
                }
                clearInterval(id);
                return 0;
            });
        };
        update();

        const id = setInterval(update, 25);
        return () => clearInterval(id);
    }, [money]);

    useEffect(() => {
        setMultiplierSizeOffset(10);
        setMultiplierDelta(multiplier - lastMultiplier.current);
        lastMultiplier.current = multiplier;

        const update = () => {
            setMultiplierSizeOffset(s => {
                if (s > 0) {
                    return s - 1;
                }
                clearInterval(id);
                return 0;
            });
        };
        update();

        const id = setInterval(update, 25);
        return () => clearInterval(id);
    }, [multiplier]);


    return (
        <View style={{ position: `absolute`, top: 0, right: 4 }} >
            <View style={{ flexDirection: `row`, justifyContent: `flex-end` }}>
                <View style={{ transform: `translate(-${moneySizeOffset}px,${2 * moneySizeOffset}px) scale(${moneySizeOffset * 0.1 + 1})` }}>
                    <Text style={styles.money}>{`$${(money ?? 0).toLocaleString()}`}</Text>
                </View>
                <View style={{ transform: `translate(-${multiplierSizeOffset}px,${2 * multiplierSizeOffset}px) scale(${multiplierSizeOffset * 0.1 + 1})` }}>
                    <Text style={{ ...styles.multiplier, ...(multiplierDelta < -5 ? { color: `#FF0000` } : multiplierDelta < 0 ? { color: `#FFFF00` } : { color: `#00FF00` }) }}>{`x${(multiplier ?? 1).toLocaleString()}`.padStart(4, ` `)}</Text>
                </View>
            </View>
        </View>
    );
};

const EmojiCharacterView = ({ emoji, targetEmoji, emotion, purchased, onPress }: { emoji: string, targetEmoji: string, emotion: null | EmojiIdleEmotionKind, purchased: string[], onPress?: () => void }) => {
    return (
        <>
            <PurchasedView purchased={purchased} />
            <View style={{ position: `absolute`, left: 20, top: 0, flexDirection: `column`, alignItems: `flex-end` }} >
                <TouchableOpacity onPress={() => onPress?.()}>
                    <EmotionView emotion={emotion ?? null} emoji={emoji} />
                </TouchableOpacity>
            </View>
            <View style={{ position: `absolute`, left: 66, top: 0, flexDirection: `column`, alignItems: `flex-end` }} >
                <Text style={styles.targetCharacterEmoji}>{`${targetEmoji}`}</Text>
            </View>
        </>
    );
};

const PurchasedView = ({ purchased }: { purchased: string[] }) => {
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        const update = () => {
            setOffset(s => s + 1);
        };
        update();

        const id = setInterval(update, 200);
        return () => clearInterval(id);
    }, [purchased.length]);

    return (
        <>
            {purchased.map((x, i) => (
                <View key={x} style={{ position: `absolute`, left: 0, top: 0, flexDirection: `column`, alignItems: `flex-end` }} >
                    <View style={{ transform: `translate(${((i * 17) + offset) % 60}px,${((i * 5) + offset) % 24}px)` }}>
                        <Text style={styles.objectEmoji}>{`${x}`}</Text>
                    </View>
                </View>
            ))}
        </>
    );
};

const EmotionView = ({ emotion, emoji }: { emotion: null | EmojiIdleEmotionKind, emoji: string }) => {
    const [display, setDisplay] = useState({ text: emoji, isEmotion: false });
    useEffect(() => {
        if (!emotion) {
            return () => { };
        }
        let showEmotion = false;
        let variant = 0;
        const update = () => {
            showEmotion = !showEmotion;
            if (!showEmotion) {
                setDisplay({ text: emoji, isEmotion: false });
                return;
            }
            setDisplay({ text: getEmoji(emotion, variant++), isEmotion: true });
        };
        update();

        const id = setInterval(update, 3000);
        return () => clearInterval(id);
    }, [emotion, emoji]);

    return (
        <Text style={display.isEmotion ? styles.emotionEmoji : styles.characterEmoji}>{display.text}</Text>
    );
};

// 😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺🙂🤗🤩🤔🤨😐😑😶
// 🙄😏😣😥😮🤐😯😪😫🥱😴😌😛😜😝🤤😒😓😔😕🙃🤑😲☹🙁😖😞
// 😟😤😢😭😦😧😨😩🤯😬😰😱🥵🥶😳🤪😵🥴😠😡🤬😷🤒🤕🤢🤮
// 🤧😇🥳🥺🤠🤡🤥🤫🤭🧐🤓😈👿👹👺💀☠👻👽👾🤖💩
// 🧟‍♂️
const getEmoji = (emotion: null | EmojiIdleEmotionKind, variant: number) => {
    // console.log(`getEmoji`, { emotion, variant });

    // Setup State
    if (!emotion) { return `😶`; }

    if (emotion === `excited`) {
        const items = shuffle([`😁`, `😍`, `😎`, `🤩`, `🤗`, `🥳`, `😂`]);
        return items[variant % items.length];
    }
    if (emotion === `happy`) {
        const items = [`😀`, `🙂`, `😄`, `😃`, `😊`];
        return items[variant % items.length];
    }
    if (emotion === `normal`) {
        // const items = [`🙂`, `😋`, `😮`, `🤔`, `🙄`, `🥱`, `😴`];
        const items = [`🙂`, `😋`, `😮`, `🙄`];
        return items[variant % items.length];
    }
    if (emotion === `angry`) {
        const items = [`😳`, `😟`, `😤`, `😣`, `🥺`, `😫`, `😩`];
        return items[variant % items.length];
    }
    if (emotion === `sick`) {
        const items = [`🤢`, `🤮`, `😵`, `🤧`, `😬`, `💩`, `😞`];
        return items[variant % items.length];
    }
    if (emotion === `dead`) {
        const items = [`💀`, `👻`, `🧟‍♂️`];
        return items[variant % items.length];
    }

    // Unknown
    return `👾`;
};

const foodItems = shuffle(` 
        🍕 🍔 🍟 🌭 🍿 🥓 🥚 🧇 🥞 🧈 🥐 🍞 🥨 🥖 🥯 🧀 🥗 🥙 🥪 🌯 🌮 
        🥩 🍗 🍖 🍠 🥟 🥠 🍘 🥡 🍱 🍚 🍙 🍛 🍜 🦪 🍣 🥮 🍥 🍤 🍢 🧆 
        🥣 🍝 🍲 🥧 🍦 🍧 🍪 🍩 🍨 🎂 🍰 🧁 🍮 🍯 🍵 `
    .replace(`\n`, ` `).split(` `).map(x => x.trim()).filter(x => x));

const getFoodVariant = (variant: number) => {
    return foodItems[variant % foodItems.length];
};
