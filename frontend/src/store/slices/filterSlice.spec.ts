import { clearFilter, initialFilterState, saveFilter, filterSlice } from './filterSlice';

describe('Filter slice tests', () => {
  const reducer = filterSlice.reducer;

  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialFilterState);
  });

  it('Should store the filter', () => {
    const filter = 'filter';
    expect(reducer(undefined, saveFilter(filter))).toEqual(filter);
  });

  it('Should clear filter', () => {
    expect(reducer('filter', clearFilter())).toEqual('');
  });
});
