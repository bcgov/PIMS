/**
 * postalCodeFormatter takes the specified postal code and formats it with a space in the middle
 * @param {string} postal The target postal to be formatted
 */
export const postalCodeFormatter = (postal: string) => {
  const regex = /([a-zA-z][0-9][a-zA-z])[\s-]?([0-9][a-zA-z][0-9])/;
  const format = postal.match(regex);
  if (format !== null && format.length === 3) {
    postal = `${format[1]} ${format[2]}`;
  }
  return postal.toUpperCase();
};
