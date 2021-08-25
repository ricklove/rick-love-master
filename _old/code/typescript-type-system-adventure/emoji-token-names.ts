

/** ❌ variable declarations */
// const 😾 = false;
// const _😥 = false;
// const [`_😥`] = false;

/** ❌ function declarations */
// export function _😾  () { };

/** ❌ function parameters */
// export function o_o (😾: boolean) { };

/** ✔ function parameter literal string type */
export function o_o(cat: '😺') { };

/** ✔ Object Fields with String Names */
const profile = {
    [`🏷️`]: `Rick Love`,
    [`🤓`]: true,
    ['🧙‍♂️']: true,
};

/** ✔ Types support - string literals */
type EmojiType = '🤓' | '🧙‍♂️';

/** ✔ Emoji Enum */
enum EmojiEnum {
    [`🏷️`] = `🏷️`,
    [`🤓`] = `🤓`,
    ['🧙‍♂️'] = '🧙‍♂️',
}
const emojiEnum = EmojiEnum[`🏷️`];

/** ❌ export */
// export { profile[`🏷️`] as 🏷️ };

/** ❌ catch error parameter name */
// const tryCatchBlock = () => {
//     try {
//         const ok = true;
//     } catch (🥵) {
//     }
// };


/** ### Have Fun! 
 * 
 * - Note: these are not the same
 * - Hint: zero-width-space
*/
const criticalSwitch = (value: '😇' | '​😇' | '😇​' | '​') => {
    switch (value) {
        case '😇': return '😳';
        case '​😇': return '​😳';
        case '😇​': return '😳​';
        case '​': return '​';
        default: return '';
    }
};