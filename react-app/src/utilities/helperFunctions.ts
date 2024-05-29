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
