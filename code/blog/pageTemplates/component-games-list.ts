export const componentGamesList = [
    { name: `multiples-counting`, load: async () => (await import(`educational-games/multiples-counting`)).EducationalGame_MultiplesCounting },
    { name: `multiples-monster`, load: async () => (await import(`educational-games/multiples-monster`)).EducationalGame_MultiplesMonster },
];
