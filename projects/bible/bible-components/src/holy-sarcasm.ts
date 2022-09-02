export const getHolySarcasticPhrase = (selfRighteousnessLevel: number) => {
  if (selfRighteousnessLevel >= 1.0) {
    return `You don't think that your poop don't stink!`;
  }
  if (selfRighteousnessLevel >= 0.75) {
    return `Almost holy!`;
  }
  if (selfRighteousnessLevel >= 0.5) {
    return `You are holy as a pair of old underwear!`;
  }
  if (selfRighteousnessLevel >= 0.25) {
    return `You art not that holy!`;
  }

  return `I'm 1,000,000x as humble as thou art!`;
};
