import { generateMultiSortCriteria, resolveSortCriteriaFromUrl } from 'utils';
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

  it('Should resolve sort fields', () => {
    // setup
    const input = ['Name asc', 'Agency desc'];
    const expectedOutput = { name: 'asc', agency: 'desc' };

    // act
    const output = resolveSortCriteriaFromUrl(input);

    // assert
    expect(output).toEqual(expectedOutput);
  });

  it('Should generate sort query', () => {
    // setup
    const input: any = { name: 'asc', agency: 'desc' };
    const expectedOutput = ['Name asc', 'Agency desc'];

    // act
    const output = generateMultiSortCriteria(input);

    // assert
    expect(output).toEqual(expectedOutput);
  });
});
