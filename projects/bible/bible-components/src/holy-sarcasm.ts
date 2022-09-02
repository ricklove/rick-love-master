export const getHolySarcasticPhrase = (selfRighteousnessLevel: number) => {
  if (selfRighteousnessLevel >= 1.0) {
    return `Thou art 100x more righeteous than we art!`;
  }
  if (selfRighteousnessLevel >= 0.25) {
    return `You art not that holy!`;
  }

  return `Unclean!`;
};
