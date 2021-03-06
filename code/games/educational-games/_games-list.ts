export const educationalGamesList = [
    { name: `multiples-counting`, load: async () => (await import(`./multiples-counting`)).EducationalGame_MultiplesCounting },
    { name: `multiples-counting-words`, load: async () => (await import(`./multiples-counting-words`)).EducationalGame_MultiplesCountingWords },
    { name: `multiples-monster`, load: async () => (await import(`./multiples-monster`)).EducationalGame_MultiplesMonster },
    { name: `multiples-snake`, load: async () => (await import(`./multiples-snake`)).EducationalGame_MultiplesSnake },
    { name: `multiples-large-board`, load: async () => (await import(`./multiples-large-board`)).EducationalGame_MultiplesLargeBoard },
    { name: `multiples-star-blast`, load: async () => (await import(`./star-blast-sideways`)).EducationalGame_StarBlastSideways_Multiples },
    { name: `spanish-star-blast`, load: async () => (await import(`./star-blast-sideways-with-subjects/star-blast-spanish`)).EducationalGame_StarBlastSideways_Spanish },
    { name: `spelling-star-blast`, load: async () => (await import(`./star-blast-sideways-with-subjects/star-blast-spelling`)).EducationalGame_StarBlastSideways_Spelling },
    { name: `doodle-spelling`, load: async () => (await import(`./doodle-subjects/doodle-spelling`)).EducationalGame_Doodle_Spelling },
    { name: `doodle-browser`, load: async () => (await import(`doodle/doodle-view`)).DoodleBrowser },
    { name: `doodle-party`, load: async () => (await import(`doodle/doodle-party`)).DoodlePartyView },
];
export const educationalGameUtils = {
    progressGame: { name: `progressGame`, load: async () => (await import(`./progress-games/progress-game`)).ProgressGameView },
};
