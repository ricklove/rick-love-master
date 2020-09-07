import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { shuffle } from 'utils/arrays';
import { EmojiIdleService, EmojiIdleState, EmojiIdleEmotionKind } from './emoji-idle-service';

export const styles = {
    container: {
        height: 36,
    },
    fixed: {
        position: `fixed`,
        top: 0, right: 0, left: 0,
        zIndex: 1000,
    },
    inner: {
        position: `relative`,
        height: 36,
    },
    characterEmoji: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 24,
    },
    characterEmoji_small: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 12,
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
    emotionEmoji: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 24,
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
                    <EmojiCharacterView emoji={gameState?.characterEmoji ?? ``} targetEmoji={gameState?.targetEmoji ?? ``} />
                    <EmotionView emotion={gameState?.emotion ?? null} />
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

    if (gameState.targetOptions && gameState.targetOptions.length > 0) {
        return (
            <View style={{ position: `absolute`, top: 0, left: 0, right: 0 }} >
                <View style={{ flexDirection: `row`, justifyContent: `center` }}>
                    <View>
                        <Text style={styles.characterEmoji}>{` ❔ `}</Text>
                    </View>
                    {gameState.targetOptions.map(x => (
                        <TouchableOpacity key={x.emoji} onPress={() => EmojiIdleService.get().selectOption(x.emoji)}>
                            <View>
                                <Text style={styles.characterEmoji}>{x.emoji}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View>
                        <Text style={styles.characterEmoji}>{` ❔ `}</Text>
                    </View>
                </View>
            </View>
        );
    }

    if (gameState.requirementsAvailable && gameState.requirementsAvailable.length > 0) {
        return (
            <View style={{ position: `absolute`, top: 0, left: 0, right: 0 }} >
                <View style={{ alignSelf: `center`, alignItems: `center`, background: `#222222`, borderRadius: 4, padding: 4 }}>
                    <View style={{ flexDirection: `row`, justifyContent: `center` }}>
                        {gameState.requirementsAvailable.slice(0, 5).map(x => (
                            <TouchableOpacity key={x.emoji} onPress={() => EmojiIdleService.get().selectOption(x.emoji)}>
                                <View style={{ flexDirection: `column`, margin: 4, alignItems: `center`, background: `#333333`, borderRadius: 4 }}>
                                    <Text style={styles.characterEmoji}>{x.emoji}</Text>
                                    <Text style={styles.costText}>{`$${x.cost.toLocaleString()}`}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.money_small}>{`$${(gameState.money ?? 0).toLocaleString()}`}</Text>
                </View>
            </View>
        );
    }

    return (
        <View>
            <View style={{ position: `absolute`, left: 40, top: 0 }} >
                {gameState.requirementsRemaining && gameState.requirementsRemaining.length > 0 && (
                    <View style={{ flexDirection: `column`, alignItems: `center`, background: `#553300`, borderRadius: 4, paddingLeft: 1, paddingRight: 1 }}>
                        <Text style={styles.characterEmoji_small}>{gameState.requirementsRemaining[0].emoji}</Text>
                        <Text style={styles.costText_small}>{`$${gameState.requirementsRemaining[0].cost.toLocaleString()}`}</Text>
                    </View>
                )}
            </View>
            <ScoreView {...gameState ?? { money: 0, multiplier: 1 }} />
        </View>
    );
};


const EmojiCharacterView = ({ emoji, targetEmoji }: { emoji: string, targetEmoji: string }) => {
    return (
        <View style={{ position: `absolute`, right: 4, top: 0, flexDirection: `column`, alignItems: `flex-end` }} >
            <Text style={styles.characterEmoji}>{emoji}</Text>
            <Text style={styles.targetCharacterEmoji}>{`🔹${targetEmoji}`}</Text>
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
        <View style={{ position: `absolute`, left: 40, top: 0, right: 40 }} >
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


const EmotionView = ({ emotion }: { emotion: null | EmojiIdleEmotionKind }) => {
    const [emoji, setEmoji] = useState(getEmoji(emotion, 0));
    useEffect(() => {
        let variant = 0;
        const update = () => {
            setEmoji(getEmoji(emotion, variant++));
        };
        update();

        const id = setInterval(update, 3000);
        return () => clearInterval(id);
    }, [emotion]);

    return (
        <View style={{ position: `absolute`, left: 4, top: 0 }} >
            <Text style={styles.emotionEmoji}>{emoji}</Text>
        </View>
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
