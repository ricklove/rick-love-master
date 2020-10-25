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
const gameStart = null as unknown as GameState<HideType<{ hasStarted: false, _location: '', _inventory: {}, _environment: {} }>>;

// type GameStart = {
//     /** ### Begin Your Adventure
//      * 
//      * You have begun an amazing adventure!
//      * 
//      * Have fun!
//      */
//     begin: <T> () => Omit<T, 'begin'> & InFrontOfHouse & InventoryContainer<{}>;
// }

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

// // Helpers ---
// type InventoryContainer<TInventory> = {
//     /** ### Inventory 
//      * 
//      * This is all the stuff you found in the game.
//      * 
//      * Of course it is an infinite inventory. What kind of game do you think this is?
//      * 
//      * Yes, there is room in here for large objects like a submarine.
//      */
//     inventory: TInventory;
// };
// type AddInventoryItem<TGS, TNewInventoryItem> = TGS extends InventoryContainer<infer TOldInventory> ? Omit<TGS, 'inventory'> & InventoryContainer<TOldInventory & TNewInventoryItem> : never;
// type RemoveInventoryItem<TGS, TInventoryItemToRemove extends string> = TGS extends InventoryContainer<infer TOldInventory> ? Omit<TGS, 'inventory'> & InventoryContainer<Omit<TOldInventory, TInventoryItemToRemove>> : never;

// // type r01 = { inventory: { letter: true } };
// // const c01: r01 = null as unknown as r01;
// // type r02 = RemoveInventoryItem<r01, 'letter'>;
// // const c02: r02 = c01;
// // const c03 = c02.inventory;

// // Chapter 01 ---
// type InFrontOfHouse = {

//     /** ### In Front of House
//      * 
//      * You are in front of an old house.
//      * 
//      * There is a mailbox nearby.
//      */
//     look: <T>(this: T) => T;

//     /** ### Open Mailbox 
//      * 
//      * You open the mainbox and find a letter inside 
//      * 
//      * The front of the envelope reads: 
//      * 
//      * 'To: The Finder of This Letter'
//      */
//     openMailbox: <T> (this: T) => EnvelopeInventory<T>;
// };

// type EnvelopeInventory<T> = AddInventoryItem<Omit<T, 'openMailbox'>, {

//     /** ### Old Envelope 
//      * 
//      * An old envelope with a letter inside
//      * 
//      */
//     envelope: Envelope<EnvelopeInventory<T>>;
// }>;

// type Envelope<T> = {

//     /** ### Open Envelope 
//      * 
//      * You open the envelope and find an single sheet of paper inside.
//      * 
//      * The paper is very brittle, it must be very old. You've never touched parchment before, but this is probably it. 
//      */
//     openEnvelope: () => LetterInventory<T>;
// };

// type LetterInventory<T> = AddInventoryItem<RemoveInventoryItem<T, 'envelope'>, {

//     /** ### Old Letter
//      * 
//      * An old letter written on parchment
//      * 
//      */
//     letter: Letter<LetterInventory<T>>;
// }>;

// type Letter<T> = {

//     /** ### Read Letter
//      * 
//      * You read the old letter:
//      * 
//      * > You are beginning to enter a dangerous realm. 
//      * > What you thought you knew previously will soon be a shadow in your dreams.
//      * > Find the best way forward and do not listen to the foolish.
//      * >
//      * > It is not the unknown which you should fear. 
//      * >
//      * > Beware the any!
//      */
//     readLetter: () => Omit<T, 'look'> & InFrontOfHouse_ReadLetter;
// };

// type InFrontOfHouse_ReadLetter = {

//     /** ### In Front of House
//      * 
//      * You are in front of an old house.
//      * 
//      * There is an open mailbox nearby.
//      * 
//      * You notice a light flickering in the house.
//      */
//     look: <T>(this: T) => T;

//     /** ### Approach House
//      * 
//      * You walk towards the old house.
//      * 
//      * You hear the wind rustling through the trees, and a branch scratching against a window in the back of the house.
//      * 
//      * As you get near, the flickering light buzzes and finally goes out.
//      */
//     approachHouse: <T>(this: T) => Omit<T, 'approachHouse' | 'look'> & OutsideOldHouse;
// };

// type OutsideOldHouse = {

//     /** ### Outside Old House
//      * 
//      * You are standing outside an old house.
//      * 
//      * The wind is getting very strong now and you need to find shelter.
//      * 
//      * In the window beside the door, you see a sign that says:
//      * 
//      * "May all those who enter as guests, leave ~~as friends~~ *without giving us Cornavirus*"
//      * 
//      */
//     look: <T>(this: T) => T;

//     /** ### You break the window
//      * 
//      * Maybe if you break the window, you will be able to crawl through it to get into the house.
//      * 
//      * However, you quickly regret your decision.
//      * 
//      */
//     breakWindow: <T>(this: T) => {
//         /** You Are Dead
//          * 
//          * Breaking that window may have been a little aggressive.
//          * 
//          * At least it seems that whatever was inside the house didn't appreciate it.
//          * 
//          * You don't know exactly what happened, but you are dead.
//          * 
//          * ![](https://ricklove.me/blog-content/posts/2020-10-24-typescript-type-system-adventure/broken-window-eye.gif)
//          */
//         youAreDead: true;
//     };

//     knockOnDoor: <T>(this: T) => T;
//     ringDoorBell: <T>(this: T) => T;


// };

type SetInventory<T extends { _inventory: {} }, TNew> = Omit<T, '_inventory'> & { _inventory: Omit<T['_inventory'], keyof TNew> & TNew };
type SetEnvironment<T extends { _environment: {} }, TNew> = Omit<T, '_environment'> & { _environment: Omit<T['_environment'], keyof TNew> & TNew };
// type _testEnvironment00 = GameStateCommon<'InFrontOfHouse', {}, {}>;
// type _testEnvironment01 = SetEnvironment<_testEnvironment00, { isMailboxOpen: false }>;
// type _testEnvironment01b = GameState<_testEnvironment01>;
// type _testEnvironment02 = SetEnvironment<_testEnvironment01b, { isMailboxOpen: true }>;
// const _testEnvironment03 = (null as unknown as _testEnvironment02).environment.isMailboxOpen;

type GameStateCommon<TLocation extends string = string, TInventory extends {} = {}, TEnvironment extends {} = {}> = { _location: TLocation, _inventory: TInventory, _environment: TEnvironment };
type GameState_Environment<T extends GameStateCommon> =
    // Game Start
    T extends { hasStarted: false } ? T & {
        /** ### Begin Your Adventure
          * 
          * You have begun an amazing adventure!
          * 
          * Have fun!
          */
        begin: (this: T) => GameState<Omit<T, 'hasStarted' | '_location'> & { _location: 'InFrontOfHouse', _inventory: {}, _environment: {} }>;
    }
    // In Front of House ---
    : T extends GameStateCommon<'InFrontOfHouse', {}, { isMailboxOpen?: false }> ? T & {
        /** ### In Front of House
         * 
         * You are in front of an old house.
         * 
         * There is a mailbox nearby.
         */
        look: (this: T) => GameState<T>;

        /** ### Open Mailbox 
         * 
         * You open the mainbox and find a letter inside 
         * 
         * The front of the envelope reads: 
         * 
         * 'To: The Finder of This Letter'
         */
        openMailbox: (this: T) => GameState<SetInventory<SetEnvironment<T, { isMailboxOpen: true }>, { envelop: true }>>;
        // openMailbox: (this: T) => GameState<SetEnvironment<T, { isMailboxOpen: true }>>;
    } : T extends GameStateCommon<'InFrontOfHouse', {}, { isMailboxOpen: true }> ? T & {
        /** ### In Front of House
         * 
         * You are in front of an old house.
         * 
         * There is an open mailbox nearby.
         */
        look: (this: T) => GameState<T>;

        // /** ### Open Mailbox 
        //  * 
        //  * You open the mainbox and find a letter inside 
        //  * 
        //  * The front of the envelope reads: 
        //  * 
        //  * 'To: The Finder of This Letter'
        //  */
        // // openMailbox: (this: T) => GameState<SetInventory<SetEnvironment<T, { isMailboxOpen: true }>, { envelop: true }>>;
        // openMailbox: (this: T) => GameState<SetEnvironment<T, { isMailboxOpen: true }>>;
    }
    // Game Over - Endless void
    : {
        /** ### Game Over
         * 
         * You have entered an endless space devoid of meaning.
         * 
         * You have failed!
         * 
         * Beware the any!
         * 
         * */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gameOver: any;
    };

type GameState_Inventory<T extends GameStateCommon> =
    T extends { _inventory: { envelop: true } } ? {
        /** ### Open Envelope 
         * 
         * You open the envelope and find an single sheet of paper inside.
         * 
         * The paper is very brittle, it must be very old. You've never touched parchment before, but this is probably it. 
         */
        openEnvelop: () => GameState<SetInventory<T, { envelop: false, letter: true }>>;
    } : {}
    & T extends { _inventory: { letter: true } } ? {
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
        readLetter: () => GameState<T>;
    } : {}
    & {};

type GameState<T extends GameStateCommon> = HideType<GameState_Environment<T> & GameState_Inventory<T>>;
type HideType<T> = T extends T ? {
    _00: `  Typescript Type System Adventure                                   `;
    _01: `  by: Rick Love                                                      `;
    _02: `                                            _____                    `;
    _03: `  |-------------------------------|        |     |                   `;
    _04: `  |-----____________________------|        |     |                   `;
    _05: `  |-----| Typescript       |------|        |     |                   `;
    _06: `  |-----|  Type            |------|        |     |                   `;
    _07: `  |-----|   System         |------|        |     |                   `;
    _08: `  |-----|    Adventure     |------|        |     |                   `;
    _09: `  |-----____________________------|        |     |                   `;
    _10: `  |-------------------------------|        |     |                   `;
    _11: `  |-------------------------------|        |     |                   `;
    _12: `  |------|            |    |------|      __|     |__                 `;
    _13: `  |------|  --        |    |------|       *       *                  `;
    _14: `  |------| |  |       |    |------|        *     *                   `;
    _15: `  |------| |__|       |    |------|         *   *                    `;
    _16: `  |______|_________________|______|          * *                     `;
    _17: `                                              *                      `;
    _18: `                                                                     `;
    _19: `                                                                     `;
    _20: `                                                                     `;
} & T : never;

// Play Game (Test)
const play = () => {

    gameStart
        .begin()
        .look()
        .openMailbox()
        .openEnvelop()
        .readLetter()
        .look()
        ;
    // gameStart.
    // command({ gameStarted: false });

    // const result = gameStart
    //     .begin()
    // .look()
    // .openMailbox()
    // .inventory.envelope.openEnvelope()
    // .inventory.letter.readLetter()
    // .look()
    // .approachHouse()
    // .look()
    // .breakWindow().youAreDead
    // .knockOnDoor()
    ;

    // const _hasWon: GameWon = result;
    // const _hasLost: { youAreDead: true } | true = result;
};
