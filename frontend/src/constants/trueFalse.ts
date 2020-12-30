/**
 * TrueFalse enum type to ensure strict compile time checking.
 * Can't be named 'Boolean' because typescript has a type with that name.
 */
export enum TrueFalse {
  True = 'true',
  False = 'false',
}
