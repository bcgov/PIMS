import { isPositiveNumberOrZero } from './utils';

describe('Is Positive or Zero', () => {
  it('Should return false, undefined', () => {
    expect(isPositiveNumberOrZero(undefined)).toBeFalsy();
  });

  it('Should return false, null', () => {
    expect(isPositiveNumberOrZero(null)).toBeFalsy();
  });

  it('Should return false, empty string', () => {
    expect(isPositiveNumberOrZero('')).toBeFalsy();
  });

  it('Should return false, white space', () => {
    expect(isPositiveNumberOrZero(' ')).toBeFalsy();
  });

  it('Should return false, string', () => {
    expect(isPositiveNumberOrZero('test')).toBeFalsy();
  });

  it('Should return false, negative number string', () => {
    expect(isPositiveNumberOrZero('-1')).toBeFalsy();
  });

  it('Should return false, negative number', () => {
    expect(isPositiveNumberOrZero(-1)).toBeFalsy();
  });

  it('Should return true, positive number string', () => {
    expect(isPositiveNumberOrZero('1')).toBeTruthy();
  });

  it('Should return true, positive number', () => {
    expect(isPositiveNumberOrZero(1)).toBeTruthy();
  });

  it('Should return true, zero string', () => {
    expect(isPositiveNumberOrZero('0')).toBeTruthy();
  });

  it('Should return true, zero', () => {
    expect(isPositiveNumberOrZero(0)).toBeTruthy();
  });
});
