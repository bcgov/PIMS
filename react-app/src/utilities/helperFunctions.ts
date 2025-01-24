import { z } from 'zod';

/**
 * Pass an array of some arbitrary type and a function that retrieves the key determining uniqueness.
 * Returns an new array with any duplicate values omitted.
 * Ex: arrayUniqueBy([{foo: 1}, {foo: 1}], (obj) => obj.foo) --> [{foo: 1}]
 * Ex: arrayUniqueBy([[123, 456], [567], [123, 456]], JSON.stringify) --> [[123, 456], [567]]
 * @param arr {Array<T>}
 * @param key {(T) => string}
 * @returns {Array<T>}
 */
export const arrayUniqueBy = <T>(arr: Array<T>, key: (a: T) => string) => {
  const seen = {};
  return arr.filter(function (item) {
    const k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
};

/**
 * In the event that you have the numeric value of an enum, and you need to find the string key
 * which points to that number, you can use this function.
 *
 * Given:
 *  enum Action { Subscribe = 0, Unsubscribe = 1 }
 *  enumReverseLookup(Actions, 0) -> "Subscribe"
 *
 * @param enumObj Typescript enumerated type
 * @param value number that enum resolves to
 * @returns {string}
 */
export const enumReverseLookup = <T>(enumObj: T, value: number): keyof T | undefined => {
  return Object.keys(enumObj).find((key) => (enumObj as any)[key] === value) as keyof T | undefined;
};

/**
 * Traverse an arbitrary object type using a string representing its key structure.
 * Ex:
 * getValueByNestedKey({ a: [ { b: 1 } ], 'a.0.b') -> 1
 * @param obj Some object type
 * @param key String representation of object keys
 * @returns {any}
 */
export const getValueByNestedKey = <T extends Record<string, any>>(obj: T, key: string) => {
  const nestedKeys = key.split('.');
  let result = obj;
  for (const key of nestedKeys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  return result;
};

/**
 * Returns the provider based on the username and optional BCSC identifier.
 * @param username The username to check for provider information.
 * @param bcscIdentifier The optional BCSC identifier to check for BCSC provider.
 * @returns The provider name ('IDIR', 'BCeID', 'BCSC') based on the username or an empty string if no match.
 */
export const getProvider = (username: string, bcscIdentifier?: string) => {
  if (!username) return '';
  switch (true) {
    case username.includes('idir'):
      return 'IDIR';
    case username.includes('bceid'):
      return 'BCeID';
    case bcscIdentifier && username.includes(bcscIdentifier):
      return 'BC Services Card';
    default:
      return '';
  }
};

export const validateEmail = (email: string): boolean =>
  z.string().email().safeParse(email).success;

/**
 * SheetJS does not like to receive invalid dates. Use this function to avoid that if value is unpopulated.
 * @param date
 * @returns Date or undefined
 */
export const makeDateOrUndefined = (date: unknown | undefined) => {
  if (!date) return undefined;
  if (typeof date == 'string' && (date as string).length === 0) return undefined;
  return new Date(date as string | number | Date);
};

/**
 * Generates a list of numbers based on a start and end value.
 * @param start The first number in the list
 * @param end The last number in the list (inclusive)
 * @returns A list of numbers.
 */
export const generateNumberList = (start, end) =>
  Array.from({ length: end - (start - 1) + 1 }, (_, i) => start - 1 + i);
