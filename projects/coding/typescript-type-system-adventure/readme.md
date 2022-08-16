### Typescript Type System Adventure

@author Rick Love
@date 2020-10-24
@license This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.

### Summary

This is a text adventure entirely implemented in the typescript type system.

- Play in vscode using autocomplete and tooltips
- Game output displayed in tooltips using jsdoc3 with markdown
- Implemented using conditional types, string literals, and a minimal state machine

### Getting Started

```ts
import { gameStart } from '@ricklove/typescript-type-system-adventure';

const play = () => {
  return gameStart.command(`look`).execute;
};
```

### Help

Commands to try:

- look
- inventory
- open mailbox
- open envelope
- read letter
- move house

### Ascii Art

```text
.......................................................
:                                                     :
: _________________________________        _______    :
: |----|  Typescript        |-----|        |     |    :
: |----|   Type             |-----|        |     |    :
: |----|    System          |-----|        |     |    :
: |----|     Adventure      |-----|        |     |    :
: |----|______by: Rick Love_|-----|        |     |    :
: |-------------------------------|        |     |    :
: |-------------------------------|        |     |    :
: |-------_________________-------|        |     |    :
: |------|            |    |------|      __|     |__  :
: |------|  --        |    |------|       *       *   :
: |------| |  |       |    |------|        *     *    :
: |------| |__|       |    |------|         *   *     :
:  *_____|____________|____|______|          * *      :
:                                             *       :
:.....................................................:
```

### Note:

This is a work of fiction. It's not code that you can run or anything. It's a fun toy playing with the typescript type system.
Feel free to learn and make your own, but please give me credit for coming up with the idea with this link:
https://ricklove.me/typescript-type-system-adventure

### Inspiration:

Also this was inspired by this amazing SQL typescript type system parser:
https://github.com/codemix/ts-sql

### Sharing

**Please share it with all your nerd friends!**

https://ricklove.me/typescript-type-system-adventure
