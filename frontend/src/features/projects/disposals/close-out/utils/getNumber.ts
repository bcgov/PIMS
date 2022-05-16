/**
 * Return a numeric value.
 * If the specified 'value' is NaN then return 0.
 * @param value A value that will be parsed.
 */
export const getNumber = (value?: string | number) => {
  const result = Number(value);
  return isNaN(result) ? 0 : result;
};
