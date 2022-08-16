import React, { useEffect, useState } from 'react';
import { Text, View } from '@ricklove/react-native-lite';
import { shuffle } from '@ricklove/utils-core';
import { PetEmotionKind, PetService, PetState } from './pet-service';

export const styles = {
  container: {
    height: 36,
  },
  fixed: {
    position: `fixed`,
    top: 0,
    right: 0,
    left: 0,
  },
  inner: {
    position: `relative`,
    height: 36,
  },
  text: {
    fontFamily: `"Lucida Console", Monaco, monospace`,
    fontSize: 24,
    color: `#333300`,
  },
  foodText: {
    fontFamily: `"Lucida Console", Monaco, monospace`,
    fontSize: 12,
    color: `#333300`,
  },
} as const;

export const PetView = (props: {}) => {
  const [petState, setPetState] = useState(null as null | PetState);
  useEffect(() => {
    const petService = PetService.get();
    const sub = petService.subscribePetStateChange(setPetState);
    return () => sub.unsubscribe();
  });

  return (
    <View style={styles.container}>
      <View style={styles.fixed}>
        <View style={styles.inner}>
          <PetTextView petState={petState} />
          {petState &&
            petState.food > 0 &&
            [...new Array(petState.food)].map((x, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <View
                key={`${i}`}
                style={{
                  position: `absolute`,
                  transform: `translate(${50 + ((i * 87) % 100)}px,${4 + ((i * 43) % 12)}px)`,
                }}
              >
                <Text style={styles.foodText}>{getFoodVariant(i)}</Text>
              </View>
            ))}
        </View>
      </View>
    </View>
  );
};

const PetTextView = ({ petState }: { petState: null | PetState }) => {
  const [emoji, setEmoji] = useState(getEmoji(petState?.emotion ?? null, 0));
  useEffect(() => {
    let variant = 0;
    const update = () => {
      setEmoji(getEmoji(petState?.emotion ?? null, variant++));
    };
    update();

    const id = setInterval(update, 3000);
    return () => clearInterval(id);
  }, [petState]);

  return <Text style={styles.text}>{emoji}</Text>;
};

// 😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺🙂🤗🤩🤔🤨😐😑😶
// 🙄😏😣😥😮🤐😯😪😫🥱😴😌😛😜😝🤤😒😓😔😕🙃🤑😲☹🙁😖😞
// 😟😤😢😭😦😧😨😩🤯😬😰😱🥵🥶😳🤪😵🥴😠😡🤬😷🤒🤕🤢🤮
// 🤧😇🥳🥺🤠🤡🤥🤫🤭🧐🤓😈👿👹👺💀☠👻👽👾🤖💩
// 🧟‍♂️
const getEmoji = (emotion: null | PetEmotionKind, variant: number) => {
  // console.log(`getEmoji`, { emotion, variant });

  // Setup State
  if (!emotion) {
    return `😶`;
  }

  if (emotion === `full`) {
    const items = shuffle([`😁`, `😍`, `😎`, `🤩`, `🤗`, `🥳`, `😂`]);
    return items[variant % items.length];
  }
  if (emotion === `happy`) {
    const items = [`😀`, `🙂`, `😄`, `😃`, `😊`];
    return items[variant % items.length];
  }
  if (emotion === `hungry`) {
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

const foodItems = shuffle(
  ` 
        🍕 🍔 🍟 🌭 🍿 🥓 🥚 🧇 🥞 🧈 🥐 🍞 🥨 🥖 🥯 🧀 🥗 🥙 🥪 🌯 🌮 
        🥩 🍗 🍖 🍠 🥟 🥠 🍘 🥡 🍱 🍚 🍙 🍛 🍜 🦪 🍣 🥮 🍥 🍤 🍢 🧆 
        🥣 🍝 🍲 🥧 🍦 🍧 🍪 🍩 🍨 🎂 🍰 🧁 🍮 🍯 🍵 `
    .replace(`\n`, ` `)
    .split(` `)
    .map((x) => x.trim())
    .filter((x) => x),
);

const getFoodVariant = (variant: number) => {
  return foodItems[variant % foodItems.length];
};
