import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { shuffle } from 'utils/arrays';
import { EmojiIdleService, EmojiIdleState, EmojiIdleEmotionKind } from './emoji-idle-service';

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
    useEffect(() => {
        const service = EmojiIdleService.get();
        const sub = service.subscribePetStateChange(setGameState);
        return () => sub.unsubscribe();
    });

    return (
        <View style={styles.container}>
            <View style={styles.fixed}>
                <View style={styles.inner}>
                    <EmojiCharacterView emoji={gameState?.characterEmoji ?? ``} targetEmoji={gameState?.targetEmoji ?? ``} emotion={gameState?.emotion ?? null} />
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

const CommandsView = ({ gameState }: { gameState: EmojiIdleState }) => {

    const [offset, setOffset] = useState(0);
    useEffect(() => {
        setOffset(0);
    }, [gameState.targetOptions, gameState.requirementsAvailable]);

    if (gameState.targetOptions && gameState.targetOptions.length > 0) {
        const listSize = 5;
        const targetOptionsLength = gameState.targetOptions.length;
        return (
            <View style={{ position: `absolute`, top: 0, left: 0, right: 0 }} >
                <View style={{ flexDirection: `row`, justifyContent: `center` }}>
                    {gameState.targetOptions.slice(offset, listSize).map(x => (
                        <TouchableOpacity key={x.emoji} onPress={() => EmojiIdleService.get().selectOption(x.emoji)}>
                            <View>
                                <Text style={styles.characterEmoji}>{x.emoji}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {offset + listSize < targetOptionsLength && (
                        <TouchableOpacity onPress={() => setOffset(s => { const i = s + 5; return i >= targetOptionsLength ? 0 : i; })}>
                            <View>
                                <Text style={styles.characterEmoji}>{` ⏩ `}</Text>
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
            <View style={{ position: `absolute`, left: 60, top: 0, flexDirection: `row` }} >
                {reqs.slice(0, reqShowLength).map(x => (
                    <TouchableOpacity key={x.emoji} onPress={() => EmojiIdleService.get().selectOption(x.emoji)}>
                        <View style={{ flexDirection: `column`, alignItems: `center`, background: x.cost <= gameState.money ? `#003300` : `#553300`, borderRadius: 4, paddingLeft: 2, paddingRight: 2 }}>
                            <Text style={styles.characterEmoji_small}>{x.emoji}</Text>
                            <Text style={styles.costText_small}>{`$${x.cost.toLocaleString()}`}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <ScoreView {...gameState ?? { money: 0, multiplier: 1 }} />
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

const EmojiCharacterView = ({ emoji, targetEmoji, emotion }: { emoji: string, targetEmoji: string, emotion: null | EmojiIdleEmotionKind }) => {
    return (
        <>
            <View style={{ position: `absolute`, left: 4, top: 0, flexDirection: `column`, alignItems: `flex-end` }} >
                <EmotionView emotion={emotion ?? null} emoji={emoji} />
            </View>
            <View style={{ position: `absolute`, left: 36, top: 0, flexDirection: `column`, alignItems: `flex-end` }} >
                <Text style={styles.targetCharacterEmoji}>{`${targetEmoji}`}</Text>
            </View>
        </>
    );
};

const EmotionView = ({ emotion, emoji }: { emotion: null | EmojiIdleEmotionKind, emoji: string }) => {
    const [display, setDisplay] = useState({ text: emoji, isEmotion: false });
    useEffect(() => {
        let showEmotion = true;
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
    }, [emotion]);

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
