/**
 * formatCurrency - transform a string or number to the local Canadian currency string format.
 * Ex: 1234: number -> CA$1,234: string
 * @param value a number or string formatted number
 * @returns {string}
 */
const formatCurrency = (value: number | string | undefined): string => {
  if (value == null) {
    return '';
  }

  let cleanedValue = 0;
  if (typeof value === 'string') {
    cleanedValue = parseFloat(value.replace(',', '').replace('$', ''));
    if (Number.isNaN(cleanedValue)) {
      return '';
    }
  } else if (typeof value === 'number') {
    cleanedValue = value;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'CAD',
  }).format(cleanedValue);
};

export default formatCurrency;
