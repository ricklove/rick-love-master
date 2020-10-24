// Typescript Type System Adventure
// Author: Rick Love
// This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.

// Note: This is a work of fiction. It's not code that you can run or anything. It's a fun toy playing with the typescript type system.
// Feel free to learn and make your own, but please give me credit for coming up with the idea with this link:
// ricklove.me/typescript-type-system-adventure
//
// Also this was inspired by this amazing SQL typescript type system parser:
// https://github.com/codemix/ts-sql


type TGameState<TInventory> = {
    /** This is all the stuff you found in the game.
     * 
     * Of course it is an infinite inventory. What kind of game do you think this is?
     * 
     * Yes, there is room in here for large objects like a submarine.
     */
    inventory: TInventory;
};
type AddInventoryItem<TGS, TNewInventoryItem> = TGS extends TGameState<infer TOldInventory> ? TGameState<TOldInventory & TNewInventoryItem> : never;
type RemoveInventoryItem<TGS, TInventoryItemToRemove> = TGS extends TGameState<infer TOldInventory> ? TGameState<Exclude<TOldInventory, TInventoryItemToRemove>> : never;

type At<T, TLocation> = T & { _at: TLocation };

/** You are in front of an old house.
 * 
 * There is a mailbox nearby.
 */
type InFrontOfHouse<T> = {
    /** You open the mainbox and find a letter inside 
     * 
     * The front of the envelope reads: 
     * 
     * 'To: The Finder of This Letter'
     */
    openMailbox: () => AddInventoryItem<T, {
        /** An old letter
         * 
         */
        letter: Letter<T>;
    }>;
};

type Letter<T> = {
    /** You open the envolope and find an single sheet of paper inside.
     * 
     * The paper is very brittle, it must be very old. You've never touched parchment before, but this is probably it. 
     * 
     * It reads:
     * 
     * You are beginning to enter a dangerous realm. 
     * What you thought you knew previously will soon be a shadow in your dreams.
     * Find the best way forward and do not listen to the foolish.
     * 
     * It is not the unknown which you should fear. 
     * Beware the any!
     */
    openLetter: () => RemoveInventoryItem<T, {
        letter: unknown;
    }>;
};

// type OpenMailbox = At<{}, InFrontOfHouse>;

type GameStart = {
    /** You have begun an amazing adventure!
     * 
     * Have fun!
     * 
     * Beware the any!
     */
    begin: () => InFrontOfHouse<TGameState<{}>>;
}

/** Typescript Type System Adventure
 * 
 * author: Rick Love - 2020
 */
const gameStart: GameStart = null as unknown as GameStart;

// Play Game (Test)
const play = () => {
    const s000 = gameStart.begin();
    const s001 = s000.openMailbox();
    const s002 = s001.inventory.letter.openLetter();
};
