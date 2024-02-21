import { ErrorWithCode } from "@/utilities/customErrors/ErrorWithCode"
describe('UNIT - ErrorWithCode', () => {
  it('should have a default 400 error code', () => {
    const err = new ErrorWithCode('test');
    expect(err.code).toEqual(400);
  })

  it('should use the error code provided', () => {
    const err = new ErrorWithCode('test', 401);
    expect(err.code).toEqual(401);
    expect(err.message).toBe('test');
  })
})
