/**
 * Calculate the net proceeds.
 * @param gainBeforeSpl The gain before SPL value.
 * @param programCost The program cost value.
 */
export const calcNetProceeds = (gainBeforeSpl: number, programCost: number) => {
  return gainBeforeSpl - programCost;
};
