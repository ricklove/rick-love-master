export type GameArt = {
    timeMs?: number;
    ascii?: string;
    base64?: string;
};
export type GameStepAction = {
    name: string;
    description: string;

    // Result
    result?: {
        /** If Game Over - the game over art
         *
         * - minting an nft action would give the buyer a 2nd NFT also
         * - this would have a placeholder metadata/image until the result is known (i.e. the final NFT image would be revealed later once the results are known)
         * */
        art?: GameArt;
        gameOver: string | false;
    };
};

export type GameStep<TInventory extends string = string> = {
    title: string;
    /** Story art
     *
     * - This would be the nft of the step when no action is selected
     */
    art?: GameArt;
    description: string;
    glitch?: {
        ratio: number;
        messages: string[];
    };
    inventory: TInventory[];

    /** Actions can be purchased as NFTs
     *
     * Action NFT artwork:
     * - Before Results: this will just be the step.art + action prompt
     * - After Results: this will become the result.art
     */
    actions: GameStepAction[];
};
