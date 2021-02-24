/**
 * Formats the specified 'value' as US currency.
 * Will return an empty string if the specified 'value' is undefined or empty.
 * @param value The value to format as money.
 */
export const formatMoney = (value?: number | ''): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return typeof value === 'undefined' || value === '' ? '' : formatter.format(value || 0);
};

/**
 * Formats the specified 'value' as US currency.
 * @param value The valut to format as money.
 * @param fractionDigits The number of digits to include.
 */
export const formatNumber = (value: number, fractionDigits = 0): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping: true, // use thousands separators - 1,000,000
  });
  return formatter.format(value);
};
