/**
 * Formats the GUID given by Keycloak Gold to the standard GUID format.
 *
 * @since v02.01.00
 * @author [Zach Bourque]
 * @param {string} input - The GUID given by Keycloak Gold
 * @returns {string} guid - A GUID formatted GUID
 *
 * @example
 * const guid: string = convertToGuidFormat("517189e00b5a4fb184ab803b7d19271a");
 * // returns "517189e0-0b5a-4fb1-84ab-803b7d19271a"
 */

export const convertToGuidFormat: Function = (input: string): string => {
  if (!input) {
    return '';
  }
  // Remove any non-alphanumeric characters from the input string
  input = input.replace(/[^a-zA-Z0-9]/g, '');

  // Check the length of the resulting string
  if (input.length !== 32) {
    // If the length is not 32, the input string is not a valid GUID
    return '';
  }

  // Split the input string into groups of 8, 4, 4, 4, and 12 characters
  const groups = [
    input.substring(0, 8),
    input.substring(8, 12),
    input.substring(12, 16),
    input.substring(16, 20),
    input.substring(20, 32),
  ];
  // Join the groups together with dashes to create a valid GUID string
  return groups.join('-');
};
