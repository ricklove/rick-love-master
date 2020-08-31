export const componentGamesList = [
    { name: `multiples-counting`, load: async () => (await import(`educational-games/multiples-counting`)).EducationalGame_MultiplesCounting },
    { name: `multiples-counting-words`, load: async () => (await import(`educational-games/multiples-counting-words`)).EducationalGame_MultiplesCountingWords },
    { name: `multiples-monster`, load: async () => (await import(`educational-games/multiples-monster`)).EducationalGame_MultiplesMonster },
    { name: `multiples-snake`, load: async () => (await import(`educational-games/multiples-snake`)).EducationalGame_MultiplesSnake },
    { name: `multiples-large-board`, load: async () => (await import(`educational-games/multiples-large-board`)).EducationalGame_MultiplesLargeBoard },
    { name: `multiples-star-blast`, load: async () => (await import(`educational-games/star-blast`)).EducationalGame_StarBlast_Multiples },
    { name: `multiples-star-blast-sideways`, load: async () => (await import(`educational-games/star-blast-sideways`)).EducationalGame_StarBlastSideways_Multiples },
    //
];
