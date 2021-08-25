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
const gameStart = null as unknown as GameState<HideType<{ _hasStarted: false, _location: '', _inventory: {}, _environment: {} }>>;

type GameWon = {

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
    win: () => void;
};


type SetLocation<T extends GameStateCommon, TNew extends string> = Omit<T, '_location'> & { _location: TNew };
type SetInventory<T extends GameStateCommon, TNew> = Omit<T, '_inventory'> & { _inventory: Omit<T['_inventory'], keyof TNew> & TNew };
type SetEnvironment<T extends GameStateCommon, TNew> = Omit<T, '_environment'> & { _environment: Omit<T['_environment'], keyof TNew> & TNew };
// type _testEnvironment00 = GameStateCommon<'InFrontOfHouse', {}, {}>;
// type _testEnvironment01 = SetEnvironment<_testEnvironment00, { isMailboxOpen: false }>;
// type _testEnvironment01b = GameState<_testEnvironment01>;
// type _testEnvironment02 = SetEnvironment<_testEnvironment01b, { isMailboxOpen: true }>;
// const _testEnvironment03 = (null as unknown as _testEnvironment02).environment.isMailboxOpen;

type GameStateCommon<TLocation extends string = string, TInventory extends {} = {}, TEnvironment extends {} = {}> = { _location: TLocation, _inventory: TInventory, _environment: TEnvironment };
type GameState_Environment<T extends GameStateCommon> =
    // Game Start
    T extends { _hasStarted: false } ? T & {
        /** ### Begin Your Adventure
          * 
          * You have begun an amazing adventure!
          * 
          * Have fun!
          */
        begin: () => GameState<Omit<T, '_hasStarted' | '_location'> & { _location: 'InFrontOfHouse', _inventory: {}, _environment: {} }>;
    }
    // In Front of House ---
    : T extends GameStateCommon<'InFrontOfHouse', {}, { isMailboxOpen?: false }> ? T & {
        /** ### In Front of House
         * 
         * You are in front of an old house.
         * 
         * There is a mailbox nearby.
         */
        look: () => GameState<T>;

        /** ### Open Mailbox 
         * 
         * You open the mainbox and find a letter inside 
         * 
         * The front of the envelope reads: 
         * 
         * 'To: The Finder of This Letter'
         */
        openMailbox: () => GameState<SetInventory<SetEnvironment<T, { isMailboxOpen: true }>, { envelop: true }>>;
    } : T extends GameStateCommon<'InFrontOfHouse', { letter?: false }, { isMailboxOpen: true }> ? T & {
        /** ### In Front of House
         * 
         * You are in front of an old house.
         * 
         * There is an open mailbox nearby.
         */
        look: () => GameState<T>;

    } : T extends GameStateCommon<'InFrontOfHouse', { letter: true }, {}> ? T & {
        /** ### In Front of House
         * 
         * You are in front of an old house.
         * 
         * There is an open mailbox nearby.
         * 
         * You notice a light flickering in the house.
         */
        look: () => GameState<T>;

        /** ### Approach House
         * 
         * You walk towards the old house.
         * 
         * You hear the wind rustling through the trees, and a branch scratching against a window in the back of the house.
         * 
         * As you get near, the flickering light buzzes and finally goes out.
         */
        approachHouse: () => GameState<SetLocation<T, 'OutsideOldHouse'>>;
    }
    // OutsideOldHouse ---
    : T extends GameStateCommon<'OutsideOldHouse', {}, {}> ? T & {

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
        look: () => GameState<T>;

        /** ### Break the Window
         * 
         * Maybe if you break the window, you will be able to crawl through it to get into the house.
         * 
         * However, you quickly regret your decision...
         * 
         */
        breakWindow: () => {
            /** ### You Are Dead
             * 
             * Breaking that window may have been a little aggressive.
             * 
             * At least it seems that whatever was inside the house thought so.
             * 
             * You don't know exactly what happened, but you are dead.
             * 
             * ![](https://ricklove.me/blog-content/posts/2020-10-24-typescript-type-system-adventure/broken-window-eye.gif)
             */
            youAreDead: GameOver;
        };

        /** ### Open the Door
         * 
         * Just make yourself at home! 
         * 
         * Or maybe not...
         */
        openDoor: () => {
            /** ### You Are Dead
             * 
             * The owners didn't appreciate your rude entrance and neither did their shotgun.
             * 
             * You are dead.
             * 
             */
            youAreDead: GameOver;
        };

        /** ### Ring the Doorbell
        * 
        * You press the button for the doorbell, but don't hear anything.
        * 
        * After waiting a moment, nothing seems to have happened.
        * 
        */
        ringDoorBell: <T>() => T;

        /** ### Knock on the Door
         * 
         * You knock on the door.
         * 
         * It appears someone is home, you hear footsteps inside...
         */
        knockOnDoor: () => {
            /** * ### Wait at Door
             * 
             * After waiting a moment, a nice old lady appears:
             * 
             * > Welcome!
             * >
             * > I always like it when children visit.
             * > 
             * > I just got done baking some chocolate chip cookies.
             */
            wait: () => {
                /** ### Eat the Cookie
                 * 
                 * You take a cookie from the plate the lady is pushing towards you.
                 * 
                 * You aren't sure about it, but decide that it's better not to be rude.
                 */
                eatCookie: () => {
                    /** ### You are Now Being Tracked
                     * 
                     * You accepted the cookies and now everywhere you go you see ads about the last thing you mentioned to your friend in private conversation.
                     * 
                     * Oh well, worse things could have happened.
                     * 
                     */
                    youAreNowBeingTracked: () => GameWon;
                };
            };
        };
        // knockOnDoor: <T>() => T;
    }
    // This is needed when forcing an inventory action
    : {};

// // The Unknown ---
// : {
//     /** ### The Unknown
//      * 
//      * You have broken the game, or rather you have found an unhandled state.
//      * 
//      * It's a feature! Not a bug!
//      * 
//      * The good news is that you didn't succumb to the 'any', so you are still safe.
//      * 
//      */
//     unknown: unknown;
// };


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

type GameOver = {
    /** ### Game Over
     * 
     * You have entered an endless space devoid of meaning.
     * 
     * You have failed!
     * 
     * Beware the any!
     * 
     * https://ricklove.me/typescript-any-is-evil
     * 
     * */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gameOver: any;
};
type GameState<T extends GameStateCommon> =
    T extends { youAreDead: true } ? GameOver
    : HideType<GameState_Environment<T> & GameState_Inventory<T>>;

type HideType<T> = T extends T ? {
    __: ' ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​ ';
} & T : never;

// type HideType<T> = T extends T ? {
//     __: [
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//         '⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇ READ BELOW ⬇',
//     ];
// } & T : never;
// type HideType<T> = T extends T ? { __: { '                                                                                                                                                                                                                                  ': {} } } & T : never;
// type HideType<T> = T extends T ? {
//     __: [
//         '  Typescript Type System Adventure                                   ',
//         '  by: Rick Love                                                      ',
//         '                                            _____                    ',
//         '  _________________________________        |     |                   ',
//         '  |----|  Typescript        |-----|        |     |                   ',
//         '  |----|   Type             |-----|        |     |                   ',
//         '  |----|    System          |-----|        |     |                   ',
//         '  |----|     Adventure      |-----|        |     |                   ',
//         '  |----|______by: Rick Love_|-----|        |     |                   ',
//         '  |-------------------------------|        |     |                   ',
//         '  |-------------------------------|        |     |                   ',
//         '  |-------_________________-------|        |     |                   ',
//         '  |------|            |    |------|      __|     |__                 ',
//         '  |------|  --        |    |------|       *       *                  ',
//         '  |------| |  |       |    |------|        *     *                   ',
//         '  |------| |__|       |    |------|         *   *                    ',
//         '   *_____|____________|____|______|          * *                     ',
//         '                                              *                      ',
//         '                                                                     ',
//         '                                                                     ',
//         '                                                                     ',
//     ];
// } & T : never;

// Play Game (Test)
const play = () => {

    gameStart
        .begin()
        .look()
        .openMailbox()
        .openEnvelop()
        .readLetter()
        .look()
        .approachHouse()
        .knockOnDoor()
        .wait()
        .eatCookie()
        .youAreNowBeingTracked()
        .win();

    // gameStart.begin().openMailbox().
    // gameStart
    //     .begin()
    //     .openMailbox()
    //     .openEnvelop()
    //     .readLetter()
    //     .approachHouse()
    //     .look()
    //     // .breakWindow().youAreDead.gameOver
    //     // .openDoor().youAreDead.gameOver
    //     // .ringDoorBell()
    //     .knockOnDoor().wait().eatCookie().youAreNowBeingTracked().winner();
    // .knockOnDoor().eatCookie().youAreNowBeingTracked().winner();


    // gameStart
    //     .begin();
    // gameStart.begin().look().openMailbox().openEnvelop().readLetter().approachHouse().breakWindow().youAreDead.gameOver;

    // gameStart
    //     .begin()
    //     .look()
    //     .openMailbox()
    //     .openEnvelop()
    //     .readLetter()
    //     .look()
    //     .approachHouse()
    //     .readLetter()
    //     .look()
    //     // .breakWindow().youAreDead.gameOver
    //     ;
};
