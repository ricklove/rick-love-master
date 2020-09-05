export const educationalGamesList = [
    { name: `multiples-counting`, load: async () => (await import(`./multiples-counting`)).EducationalGame_MultiplesCounting },
    { name: `multiples-counting-words`, load: async () => (await import(`./multiples-counting-words`)).EducationalGame_MultiplesCountingWords },
    { name: `multiples-monster`, load: async () => (await import(`./multiples-monster`)).EducationalGame_MultiplesMonster },
    { name: `multiples-snake`, load: async () => (await import(`./multiples-snake`)).EducationalGame_MultiplesSnake },
    { name: `multiples-large-board`, load: async () => (await import(`./multiples-large-board`)).EducationalGame_MultiplesLargeBoard },
    { name: `multiples-star-blast`, load: async () => (await import(`./star-blast`)).EducationalGame_StarBlast_Multiples },
    { name: `multiples-star-blast-sideways`, load: async () => (await import(`./star-blast-sideways`)).EducationalGame_StarBlastSideways_Multiples },
    { name: `spanish-star-blast-sideways`, load: async () => (await import(`./star-blast-sideways-with-subjects/star-blast-spanish`)).EducationalGame_StarBlastSideways_Spanish },
    { name: `spelling-star-blast-sideways`, load: async () => (await import(`./star-blast-sideways-with-subjects/star-blast-spelling`)).EducationalGame_StarBlastSideways_Spelling },
];
export const educationalGameUtils = {
    pet: { name: `pet`, load: async () => (await import(`./pet/pet-view`)).PetView },
};
