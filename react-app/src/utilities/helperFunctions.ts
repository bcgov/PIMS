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
