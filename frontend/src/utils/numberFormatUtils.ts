export const formatMoney = (value?: number | ''): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value || 0);
};

export const formatNumber = (value: number, fractionDigits = 0): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping: true, // use thousands separators - 1,000,000
  });
  return formatter.format(value);
};
