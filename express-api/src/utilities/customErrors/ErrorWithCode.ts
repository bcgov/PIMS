/**
 * Represents an error with an associated error code.
 *
 * @class ErrorWithCode
 * @extends Error
 *
 * @param {string} message - The error message.
 * @param {number} code - The error code. Defaults to 400.
 *
 * @example
 * const err = new ErrorWithCode('test');
 * console.log(err.code); // 400
 *
 * @example
 * const err = new ErrorWithCode('test', 401);
 * console.log(err.code); // 401
 * console.log(err.message); // 'test'
 */
export class ErrorWithCode extends Error {
  public code: number;

  constructor(message: string, code: number = 400) {
    super(message);
    this.code = code;
  }
}
