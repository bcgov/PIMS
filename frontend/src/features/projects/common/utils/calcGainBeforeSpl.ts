/**
 * Calculate the gain before SPL.
 * @param market The estimated or current market value.
 * @param interestComponent The interest component value.
 * @param salesCost The sales cost value.
 * @param netBook The net book value.
 */
export const calcGainBeforeSpl = (
  market: number,
  interestComponent: number,
  salesCost: number,
  netBook: number,
) => {
  return market - interestComponent - salesCost - netBook;
};
