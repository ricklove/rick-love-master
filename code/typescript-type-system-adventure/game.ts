/** ### Typescript Type System Adventure
 * 
 * @author Rick Love
 * @date   2020-10-24
 * @license This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
 * 
 * ### Summary
 * 
 * So this was written for fun!
 * 
 * ### Note: 
 * 
 * This is a work of fiction. It's not code that you can run or anything. It's a fun toy playing with the typescript type system.
 *
 * Feel free to learn and make your own, but please give me credit for coming up with the idea with this link:
 * https://ricklove.me/typescript-type-system-adventure
 * 
 * ### Inspiration:
 * 
 * Also this was inspired by this amazing SQL typescript type system parser:
 * https://github.com/codemix/ts-sql
 * 
 * ### Sharing
 * 
 * **Please share it with all your nerd friends!**
 * 
 * https://ricklove.me/typescript-type-system-adventure
 */
export const gameStart: GameStart = null as unknown as GameStart;

type GameStart = {
    /** ### Begin Your Adventure
     * 
     * You have begun an amazing adventure!
     * 
     * Have fun!
     */
    begin: <T> () => Omit<T, 'begin'> & InFrontOfHouse & InventoryContainer<{}>;
}

/** ### Winner!
 * 
 * You have won! 
 * 
 * Great job!
 * I hope this was fun.
 * 
 * **Please share it with all your nerd friends!**
 * 
 * https://ricklove.me/typescript-type-system-adventure
 * 
 * */
type GameWon = { winner: true };

// Helpers ---
type InventoryContainer<TInventory> = {
    /** ### Inventory 
     * 
     * This is all the stuff you found in the game.
     * 
     * Of course it is an infinite inventory. What kind of game do you think this is?
     * 
     * Yes, there is room in here for large objects like a submarine.
     */
    inventory: TInventory;
};
type AddInventoryItem<TGS, TNewInventoryItem> = TGS extends InventoryContainer<infer TOldInventory> ? Omit<TGS, 'inventory'> & InventoryContainer<TOldInventory & TNewInventoryItem> : never;
type RemoveInventoryItem<TGS, TInventoryItemToRemove extends string> = TGS extends InventoryContainer<infer TOldInventory> ? Omit<TGS, 'inventory'> & InventoryContainer<Omit<TOldInventory, TInventoryItemToRemove>> : never;

type YouAreDead<TReason extends string> = {
    /** ### You Are Dead
     * 
     * Do not pass go, do not collect $200
     * 
     * You did not win.
     */
    youAreDead: TReason;
};
// type r01 = { inventory: { letter: true } };
// const c01: r01 = null as unknown as r01;
// type r02 = RemoveInventoryItem<r01, 'letter'>;
// const c02: r02 = c01;
// const c03 = c02.inventory;

// Chapter 01 ---
type InFrontOfHouse = {

    /** ### In Front of House
     * 
     * You are in front of an old house.
     * 
     * There is a mailbox nearby.
     */
    look: <T>(this: T) => T;

    /** ### Open Mailbox 
     * 
     * You open the mainbox and find a letter inside 
     * 
     * The front of the envelope reads: 
     * 
     * 'To: The Finder of This Letter'
     */
    openMailbox: <T> (this: T) => EnvelopeInventory<T>;
};

type EnvelopeInventory<T> = AddInventoryItem<Omit<T, 'openMailbox'>, {

    /** ### Old Envelope 
     * 
     * An old envelope with a letter inside
     * 
     */
    envelope: Envelope<EnvelopeInventory<T>>;
}>;

type Envelope<T> = {

    /** ### Open Envelope 
     * 
     * You open the envelope and find an single sheet of paper inside.
     * 
     * The paper is very brittle, it must be very old. You've never touched parchment before, but this is probably it. 
     */
    openEnvelope: () => LetterInventory<T>;
};

type LetterInventory<T> = AddInventoryItem<RemoveInventoryItem<T, 'envelope'>, {

    /** ### Old Letter
     * 
     * An old letter written on parchment
     * 
     */
    letter: Letter<LetterInventory<T>>;
}>;

type Letter<T> = {

    /** ### Read Letter
     * 
     * You read the old letter:
     * 
     * > You are beginning to enter a dangerous realm. 
     * > What you thought you knew previously will soon be a shadow in your dreams.
     * > Find the best way forward and do not listen to the foolish.
     * >
     * > It is not the unknown which you should fear. 
     * >
     * > Beware the any!
     */
    readLetter: () => Omit<T, 'look'> & InFrontOfHouse_ReadLetter;
};

type InFrontOfHouse_ReadLetter = {

    /** ### In Front of House
     * 
     * You are in front of an old house.
     * 
     * There is an open mailbox nearby.
     * 
     * You notice a light flickering in the house.
     */
    look: <T>(this: T) => T;

    /** ### Approach House
     * 
     * You walk towards the old house.
     * 
     * You hear the wind rustling through the trees, and a branch scratching against a window in the back of the house.
     * 
     * As you get near, the flickering light buzzes and finally goes out.
     */
    approachHouse: <T>(this: T) => Omit<T, 'approachHouse' | 'look'> & OutsideOldHouse;
};

type OutsideOldHouse = {

    /** ### Outside Old House
     * 
     * You are standing outside an old house.
     * 
     * The wind is getting very strong now and you need to find shelter.
     * 
     * In the window beside the door, you see a sign that says:
     * 
     * "May all those who enter as guests, leave ~~as friends~~ *without giving us Cornavirus*"
     * 
     */
    look: <T>(this: T) => T;

    /** ### You break the window
     * 
     * Maybe if you break the window, you will be able to crawl through it to get into the house.
     * 
     * However, you quickly regret your decision.
     * 
     * ![](https://ricklove.me/blog-content/posts/2020-10-24-typescript-type-system-adventure/broken-window-eye.gif)
     * 
     */
    breakWindow: <T>(this: T) => YouAreDead<'I guess people really do defend their property'>;

    knockOnDoor: <T>(this: T) => T;
    ringDoorBell: <T>(this: T) => T;


};

// Play Game (Test)
const play = (): GameWon => {
    const result = gameStart
        .begin()
        .look()
        .openMailbox()
        .inventory.envelope.openEnvelope()
        .inventory.letter.readLetter()
        .look()
        .approachHouse()
        .look()
        .breakWindow()
        ;

    return result;
};
